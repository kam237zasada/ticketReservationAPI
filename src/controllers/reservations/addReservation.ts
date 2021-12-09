import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import db, { sequelize } from "../../DBmodels/index";

import { SectorPrices } from "../../models/common/SectorPrices";
import { EventInstance } from "../../DBModels/Event";
import { ReservationInstance, validateAddReservation } from "../../DBModels/Reservation";
import { SeatInstance } from "../../DBModels/Seat";
import { AddReservation } from "../../models/request/AddReservation";
const Seat = db.seat;
const Hall = db.hall;
const Event = db.event;
const Reservation = db.reservation;



const addReservation = async (req: Request, res: Response): Promise<Response> => {

    const body: AddReservation = req.body;

    const { error } = validateAddReservation(body);

    if(error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    if(req.body.seats.length%2!==0) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            mesage: "Number of selected seats must be even"
        })
    }

    const now = new Date();
    const validTo = new Date(now.getTime() + 15 * 60000);

    let reservation: ReservationInstance;
    let seatsToReservate: SeatInstance[];

    const event: EventInstance = await Event.findOne({
        where: {
            id: body.eventId
        },
        include: [
            {model: Hall, as: "hall"}
        ]
    });

    if(!event) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "There is no event"
        })
    }

    if(event.startDate < now) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "This event has already started, so you cannot buy a ticket for it."
        })
    }

    const sectorPrices: SectorPrices = {
        A: event.sectorAPrice,
        B: event.sectorBPrice,
        C: event.sectorCPrice,
        D: event.sectorDPrice
    }

    try {
        seatsToReservate = await getSeatsFromDB(body.seats, event.hallId);
    } catch(err) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: err
        });
    }

    try {
        checkSeats(seatsToReservate);
    } catch(err) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: err
        });
    }


    try {

        const reservations: ReservationInstance[] = await getReservedSeats(now, event.id)

        if(reservations.length > 0) {

            const reservedSeats: SeatInstance[] = mapReservedSeats(reservations);

            const seatsLeft: number = event.hall.availablePlaces - reservedSeats.length - seatsToReservate.length;


            if(seatsLeft === 1) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message: "You cannot reserve seats leaving only 1 place left"
                })
            }
            
            if(!arePlacesFree(reservedSeats, seatsToReservate)) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message: "Some of places you selected are reserved. Please choose other places"
                })
            }
        }

        await sequelize.transaction(async () => {

            const totalPrice: number = computePrice(seatsToReservate, sectorPrices);

            reservation = await Reservation.create({
                eventId: body.eventId,
                timeCreated: now,
                validTo: validTo,
                status: "UNCONFIRMED",
                totalPrice: totalPrice,
                email: body.email
            });

            await Promise.all(seatsToReservate.map( async seat => {
                const price: number = getSinglePrice(seat.sector, sectorPrices);
    
                await reservation.addSeat(
                    seat, 
                    {
                        through: {
                            price: price
                        }
                    }
                )
            }))
        })     

        return res.status(StatusCodes.OK).send({
            message: "Your reservation added. Now you have 15 minutes to pay it.",
            reservation
        })

    } catch(err) {
        console.log(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
           message: "Something goes wrong while saving reservation. Try again later."
        })
    }
}

export default addReservation;

export function checkSeats(seats: SeatInstance[]): boolean {
    for (const seat of seats) {

        const sameSeats:SeatInstance[] = seats.filter((seat2:SeatInstance)=> {
            return seat.id === seat2.id;
        })

        if(sameSeats.length > 1) {
            throw `You are trying to reserve exactly the same seat more than once`;
        }

        const every: boolean = seats.some((seat2:SeatInstance) => {
            return ((seat.place === seat2.place && Math.abs(seat.row - seat2.row) === 1) || 
            (seat.row === seat2.row && Math.abs(seat.place - seat2.place) === 1))
        })

        if(!every) {
            throw 'All seats must be around each other'
        }
    }

    return true;
}

export function computePrice(seats: SeatInstance[], sectorPrices: SectorPrices): number {
    let price: number = 0;

    for (const seat of seats) {
        price += getSinglePrice(seat.sector, sectorPrices);
    }

    return price;
}

function getSinglePrice(sector:string, sectorPrices: SectorPrices): number {

    switch(sector) {
        case "A":
            return sectorPrices.A;
        case "B":
            return sectorPrices.B;
        case "C":
            return sectorPrices.C;
        case "D":
            return sectorPrices.D;
        default:
            return;
    }
}

export function arePlacesFree(reserved: SeatInstance[], seats: SeatInstance[]): boolean {
    for (const seat of seats) {
        const isReserved: boolean = reserved.some(reserved => {
            return reserved.id === seat.id
        });
        if(isReserved) {
            return false;
        }
    }
    return true
}

async function getSeatsFromDB (seats: number[], hallId: number): Promise<SeatInstance[]> {
    let response: SeatInstance[] = [];
    await Promise.all(seats.map(async seat => {
        const fetchedSeat: SeatInstance = await Seat.findOne({
            where: {
                [Op.and]: [
                { hallId: hallId },
                { id: seat }
                ]
            }
        });
        if(!fetchedSeat) {
            throw `There is no seat with Id ${seat} on this hall`;
        }
        response.push(fetchedSeat);
    }))
    return response;
}

async function getReservedSeats (now: Date, eventId: number): Promise<ReservationInstance[]> {
    const reservations: ReservationInstance[] = await Reservation.findAll({
        where: {
            eventId: eventId,
                [Op.or]: [
                    {
                        status: "CONFIRMED"
                    },
                    {
                        validTo: {
                            [Op.gt]: now
                        }
                    }
                ]
                },
                include: [
                    {model: Seat, as: "Seats"}
                ]
                
        })

        return reservations;
}

function mapReservedSeats(reservations: ReservationInstance[]): SeatInstance[] {

    let reservedSeats: SeatInstance[] = [];
    reservations.map((reservation:any) => {
            
        reservedSeats.push(...reservation.Seats)
    })

    return reservedSeats;
}
