import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAdminConversations,
  getConversation,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/admin/conversations", authMiddleware, getAdminConversations);
router.get("/conversation/:employeeUserId?", authMiddleware, getConversation);
router.post("/send", authMiddleware, sendMessage);

export default router;
