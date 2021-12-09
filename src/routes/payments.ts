import express from "express";
const router = express.Router();
import addPayment from "../controllers/payments/addPayment";

router.post("/", addPayment)

export default router;