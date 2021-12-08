import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import db from "../../DBmodels/index";
const Reservation = db.reservation;

const getReservation = async (req: Request, res: Response) => {
    try {
        const reservation = await Reservation.findOne({
            where: {
                id: req.params.reservationId
            },
            include: [
                {all: true}
            ]
        });

        if(!reservation) {
            return res.status(StatusCodes.NOT_FOUND).send({
                message: "There is no reservation with given id"
            })
        }

        return res.status(StatusCodes.OK).send(reservation);

    } catch(err) {
        console.log(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Something goes wrong while loading reservations"
        });
    }

}


export default getReservation;