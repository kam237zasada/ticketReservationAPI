import { Sequelize } from "sequelize";
import { createNamespace } from "cls-hooked";

const DBConfig = require("../DBConfig");
import Reservation from "./Reservation";
import SeatsReservations from "./SeatsReservations";
import Hall from "./Hall";
import Event from "./Event";
import Seat from "./Seat";
import Ticket from "./Ticket";

const cls = createNamespace("namespace");
Sequelize.useCLS(cls);

const db: any = {};


export const sequelize = new Sequelize(DBConfig.DB, DBConfig.USER, DBConfig.PASSWORD, {
    host: DBConfig.HOST,
    dialect: DBConfig.dialect,
    pool: {
        max: DBConfig.pool.max,
        min: DBConfig.pool.min,
        acquire: DBConfig.pool.acquire,
        idle: DBConfig.pool.idle
    }
})

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hall = Hall(sequelize);
db.event = Event(sequelize);
db.seat = Seat(sequelize);
db.reservation = Reservation(sequelize);
db.seatsReservations = SeatsReservations(sequelize);
db.ticket = Ticket(sequelize);


db.hall.hasMany(db.event, {foreignKey: "hallId", as: "Events"});
db.event.belongsTo(db.hall, {foreignKey: "hallId", targetKey: "id", as: "hall"});

db.hall.hasMany(db.seat, {foreignKey: "hallId", as: "Seats"});
db.seat.belongsTo(db.hall, {foreignKey: "hallId"});

db.reservation.belongsTo(db.event, {foreignKey: "eventId", as: "Event"});
db.event.hasMany(db.reservation, { foreignKey: "eventId", as: "Reservations"});

db.seat.belongsToMany(db.reservation, {through: db.seatsReservations});
db.reservation.belongsToMany(db.seat, {through: db.seatsReservations,  as: "Seats"});

db.ticket.belongsTo(db.event, {foreignKey: "eventId", as: "Event"});
db.event.hasMany(db.ticket, {foreignKey: "eventId", as: "Ticket"});

db.ticket.belongsTo(db.seat, {foreignKey: "seatId", as: "Seat"});
db.seat.hasMany(db.ticket, {foreignKey: "seatId", as: "Ticket"});

export default db;



