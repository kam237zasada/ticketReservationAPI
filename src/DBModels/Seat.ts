import { DataTypes, Sequelize } from "sequelize";
import { SeatsReservationInstance } from "./SeatsReservations";


export interface SeatInstance {
    id: number
    row: number,
    place: number,
    hallId: number,
    sector: string,
    SeatsReservations?: SeatsReservationInstance
}

const Seat = (sequelize: Sequelize) => {
    return sequelize.define("Seat", {
    
    row: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    place: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})
}

export default Seat;

