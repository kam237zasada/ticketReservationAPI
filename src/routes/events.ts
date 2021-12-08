import express from "express";
const router = express.Router();
import addEvent from "../controllers/events/addEvent";

router.post("/", addEvent);

export default router;