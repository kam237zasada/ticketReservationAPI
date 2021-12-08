import { DataTypes, Sequelize, HasManyAddAssociationMixin } from "sequelize";
import Joi from "joi";

import { AddHall } from "../models/request/AddHall";
import { SeatInstance } from "./Seat";

export interface HallInstance {
    id: number
    name: string,
    availablePlaces: number,
    addSeat: HasManyAddAssociationMixin<SeatInstance, number>
}

const Hall = (sequelize: Sequelize) => {
    return sequelize.define("Hall", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        availablePlaces: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}

export function validateAddHall(hall: AddHall) {
    const schema = Joi.object({
        name: Joi.string().required(),
        seats: Joi.array().items(Joi.object({
            place: Joi.number().required(),
            row: Joi.number().required(),
            sector: Joi.string().valid("A", "B", "C", "D").required()
        })).required()
    })

    return schema.validate(hall);
}

export default Hall;