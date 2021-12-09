import express from "express";
const router = express.Router();
import addReservation from "../controllers/reservations/addReservation";
import getReservations from "../controllers/reservations/getReservations";
import getReservation from "../controllers/reservations/getReservation";

router.get("/", getReservations);
router.get("/:reservationId", getReservation);
router.post("/", addReservation);

export default router;