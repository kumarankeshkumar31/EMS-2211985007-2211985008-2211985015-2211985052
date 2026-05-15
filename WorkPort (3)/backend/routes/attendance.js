import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllAttendance, getMyAttendance, markPresent } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllAttendance);
router.get("/me", authMiddleware, getMyAttendance);
router.post("/mark-present", authMiddleware, markPresent);

export default router;
