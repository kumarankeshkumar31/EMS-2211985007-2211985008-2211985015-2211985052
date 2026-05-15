import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  reviewTask,
  submitTask,
  updateTaskProgress,
  uploadTaskReport,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllTasks);
router.post("/", authMiddleware, createTask);
router.get("/my", authMiddleware, getMyTasks);
router.put("/:id/progress", authMiddleware, updateTaskProgress);
router.put("/:id/review", authMiddleware, reviewTask);
router.post("/:id/submit", authMiddleware, uploadTaskReport.single("report"), submitTask);

export default router;
