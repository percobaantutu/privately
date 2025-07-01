// backend/routes/notificationRoute.js

import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuthenticated, getUserNotifications);
router.put("/:notificationId/read", isAuthenticated, markNotificationAsRead);

export default router;
