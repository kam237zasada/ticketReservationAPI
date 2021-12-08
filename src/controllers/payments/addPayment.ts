import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize/dist";

import db, { sequelize } from "../../DBmodels/index";

import { PaymentGateway } from "../../externals/PaymentGateway";

import { ReservationInstance } from "../..//DBmodels/Reservation";
import { TicketInstance } from "../../DBModels/Ticket";
import { AddPayment } from "../../models/request/AddPayment";
const Reservation = db.reservation;
const Event = db.event;
const Seat = db.seat;
const Ticket = db.ticket;

const paymentGateway: PaymentGateway = new PaymentGateway();

const addPayment = async (req: Request, res: Response) => {

    const body: AddPayment = req.body;
    const now = new Date();

    const reservation: ReservationInstance = await Reservation.findOne({
        where: {
            id: body.reservationId
        },
        include: [
            {model: Seat, as: "Seats"}
        ]
    });

    if(!reservation) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "There is no reservation"
        });
    }

    if(reservation.status === "CONFIRMED") {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "This reservation is confirmed yet"
        })
    }

    if(reservation.validTo < now) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Sorry, but this reservations is timed out. Please create a new one."
        })
    }

    try {
        await paymentGateway.charge(reservation.totalPrice, "success");

        let tickets: TicketInstance[] = [];
        await sequelize.transaction(async () => {
            await Reservation.update({status: "CONFIRMED"}, {
                where: {
                    id: body.reservationId
                }
            });
    
            await Event.update({soldTickets: Sequelize.literal(`soldTickets + ${reservation.Seats.length}`)}, {
                where: {
                    id: reservation.eventId
                }   
            });
            await Promise.all(reservation.Seats.map(async seat => {
                const ticket = await Ticket.create({
                    price: seat.SeatsReservations.price,
                    email: reservation.email,
                    seatId: seat.id,
                    eventId: reservation.eventId
                })
                tickets.push(ticket);
            }))
        })

        return res.status(StatusCodes.OK).send({
            message: `Your reservation is now confirmed. You can just wait until the event starts`,
            reservation: reservation,
            tickets: tickets         
        })

    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Some error occured while paying " + err.message
        })
    }
}

export default addPayment;


