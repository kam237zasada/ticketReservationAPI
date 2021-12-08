import Joi from "joi";
import { BelongsToManyAddAssociationMixin, DataTypes, Sequelize } from "sequelize";

import { AddReservation } from "../models/request/AddReservation";
import { SeatInstance } from "./Seat";

export interface ReservationInstance {
    id: number
    timeCreated: Date,
    status: string,
    validTo: Date,
    totalPrice: number,
    Seats: SeatInstance[],
    eventId: number,
    email: string,
    addSeat: BelongsToManyAddAssociationMixin<SeatInstance, number>

}

const Reservation = (sequelize: Sequelize) => {
  return sequelize.define("Reservation", {
    timeCreated: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    validTo: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalPrice: {
      type: DataTypes.DOUBLE(10,2),
      allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
      timestamps: false
  })
}

export function validateAddReservation(reservation: AddReservation) {
    const schema = Joi.object({
        eventId: Joi.number().required(),
        seats: Joi.array().items(Joi.number().required()).required(),
        email: Joi.string().email().required()
    })

    return schema.validate(reservation);
}

export default Reservation;