import express from "express";
const router = express.Router();
import addHall from "../controllers/halls/addHall";

router.post("/", addHall)

export default router;