import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import db from "../../DBModels/index";

import { HallInstance } from "../../DBModels/Hall";
import { EventInstance, validateAddEvent } from "../../DBModels/Event"
import { AddEvent } from "../../models/request/AddEvent";
const Event = db.event;
const Hall  = db.hall


const addEvent = async (req: Request, res: Response): Promise<Response> => {

    const body: AddEvent = req.body;

    const { error } = validateAddEvent(body);
    if(error) return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    const hall: HallInstance = await Hall.findByPk(body.hallId);

    if(!hall) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "There is no hall!"
        });
    }
    
    try {
        const event: EventInstance = await Event.create({
            name: body.name, 
            startDate: body.startDate,
            hallId: hall.id,
            sectorAPrice: body.sectorAPrice,
            sectorBPrice: body.sectorBPrice,
            sectorCPrice: body.sectorCPrice,
            sectorDPrice: body.sectorDPrice,
            soldTickets: 0
        
    });
    return res.status(StatusCodes.OK).send({
        message: `Event ${event.name} created`,
        event
    })
} catch (err) {
    console.log(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Something goes wrong while saving event. Try again later"
    })
}
}

export default addEvent;