import { DataTypes, Sequelize } from "sequelize";

export interface TicketInstance {
    price: number,
    eventId: number,
    email: string,
    seatId: number
}

const Ticket = (sequelize: Sequelize) => {
    return sequelize.define("Ticket", {
    
    price: {
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

export default Ticket;
