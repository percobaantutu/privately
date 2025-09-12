import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { createOrGetConversation, getConversations, getMessages, markConversationAsSeen } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", isAuthenticated, getConversations);
router.get("/:conversationId", isAuthenticated, getMessages);
router.post("/conversation/:recipientId", isAuthenticated, createOrGetConversation);
router.put("/:conversationId/seen", isAuthenticated, markConversationAsSeen);

export default router;
