import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get("/", authMiddleware, getAnnouncements);
router.post("/", authMiddleware, addAnnouncement);
router.delete("/:id", authMiddleware, deleteAnnouncement);

export default router;
