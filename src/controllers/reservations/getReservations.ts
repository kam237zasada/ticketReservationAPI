import { Request, Response,  } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import db from "../../DBmodels/index";
const Reservation = db.reservation;

const getReservations = async (req: Request, res: Response) => {

    if(req.query.limit && isNaN(+req.query.limit) || +req.query.limit <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "limit must be a number greater than 0"
        })
    }

    if(req.query.offset && isNaN(+req.query.offset) || +req.query.offset <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "offset must be a number greater than 0"
        })
    }
    try {
        const reservations = await Reservation.findAll({
            where: getReservationsQueries(req),
            limit: +req.query.limit || null,
            offset: +req.query.offset || 0,
            include: [
                {all: true}
            ]
        });

        return res.status(StatusCodes.OK).send(reservations);

    } catch(err) {
        console.log(err)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "Something goes wrong while loading reservations"
        });
    }

}

function getReservationsQueries(req: Request) {
    let conditions: any = {};

    if(req.query.eventId) {
        conditions.eventId = req.query.eventId
    }
    if(req.query.status) {
        conditions.status = req.query.status
    }
    if(req.query.valid && req.query.valid==="true") {
        const now = new Date();
        conditions.validTo = {
            [Op.gt]: now
        }
    }

    return conditions;
}


export default getReservations;