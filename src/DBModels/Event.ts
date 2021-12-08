import Joi from "joi";
import { DataTypes, Sequelize } from "sequelize";

import { AddEvent } from "../models/request/AddEvent";
import { HallInstance } from "./Hall";


export interface EventInstance {
    id: number
    name: string,
    startDate: Date,
    hallId: number,
    sectorAPrice: number,
    sectorBPrice: number,
    sectorCPrice: number,
    sectorDPrice: number

    hall: HallInstance
}

const Event = (sequelize: Sequelize) => {
    return sequelize.define("Event", {
        
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        sectorAPrice: {
            type: DataTypes.DOUBLE(10, 2),
            allowNull: false
        },
        sectorBPrice: {
            type: DataTypes.DOUBLE(10, 2),
            allowNull: false
        },
        sectorCPrice: {
            type: DataTypes.DOUBLE(10, 2),
            allowNull: false
        },
        sectorDPrice: {
            type: DataTypes.DOUBLE(10, 2),
            allowNull: false
        },
        soldTickets: {
            type: DataTypes.INTEGER,
            allowNull: false
        }     
    }, {
        timestamps: false
    })
}

export function validateAddEvent(event: AddEvent) {
    const schema = Joi.object({
        name: Joi.string().required(),
        startDate: Joi.date().required(),
        hallId: Joi.number().required(),
        sectorAPrice: Joi.number().min(0.01).required(),
        sectorBPrice: Joi.number().min(0.01).required(),
        sectorCPrice: Joi.number().min(0.01).required(),
        sectorDPrice: Joi.number().min(0.01).required()
    })

    return schema.validate(event);
}

export default Event;