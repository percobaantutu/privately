// backend/routes/bookingRoute.js

import express from "express";
import {
  createBooking,
  getUserBookings,
  getTeacherBookings,
  cancelBooking,
  confirmSession,
  completeSession, // <-- Import the new function here
} from "../controllers/bookingController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import validator from "validator";

const router = express.Router();

// --- Student Routes ---
router.post("/create", isAuthenticated, authorizeRoles("student"), createBooking);
router.get("/user", isAuthenticated, authorizeRoles("student"), getUserBookings);

// --- Teacher Routes ---
router.get("/teacher", isAuthenticated, authorizeRoles("teacher"), getTeacherBookings);
router.put("/:sessionId/confirm", isAuthenticated, authorizeRoles("teacher"), confirmSession);

// --- NEW ROUTE ---
// Teacher marks a confirmed session as complete
router.put("/:sessionId/complete", isAuthenticated, authorizeRoles("teacher"), completeSession);

// --- Shared Routes ---
router.put("/:bookingId/cancel", isAuthenticated, cancelBooking);

export default router;
