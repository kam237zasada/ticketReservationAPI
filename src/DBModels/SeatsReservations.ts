import { DataTypes, Sequelize } from "sequelize";

export interface SeatsReservationInstance {
    price: number,
    SeatId: number,
    ReservationId: number
}

const SeatsReservations = (sequelize: Sequelize) => {
     return sequelize.define("SeatsReservations", {
        price: {
            type: DataTypes.DOUBLE(10,2)
        }
  }, {
      timestamps: false
  });

};

export default SeatsReservations;