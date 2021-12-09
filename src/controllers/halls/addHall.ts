import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import db from "../../DBmodels/index";

import { SeatInstance } from "../../DBModels/Seat";
import { HallInstance } from "../../DBModels/Hall";
import { AddHall } from "../../models/request/addHall";
import { validateAddHall } from "../../DBModels/Hall";
const Hall = db.hall;
const Seat = db.seat;
const sequelize = db.sequelize;


const addHall = async (req: Request, res: Response): Promise<Response> => {

    const { error } = validateAddHall(req.body);

    if(error) { return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message)};

    const body: AddHall = req.body;

    let hall: HallInstance;

    try {
        
        hall = await createHall(body);

        return res.send({
            message: `Hall ${hall.name} created`,
            hall
        });

    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Something went wrong while saving hall. Please try again later."
        })
    }
    
}

async function createHall(body: AddHall): Promise<HallInstance> {
    let hall: HallInstance;
    const availablePlaces = body.seats.length;
    await sequelize.transaction(async () => {
        hall = await Hall.create({name: body.name, availablePlaces: availablePlaces});

        await Promise.all(body.seats.map(async seat => {
            const newSeat: SeatInstance = await Seat.create({row: seat.row, place: seat.place, sector: seat.sector});
            await hall.addSeat(newSeat);
        }))

      })

      return hall;
}

export default addHall;