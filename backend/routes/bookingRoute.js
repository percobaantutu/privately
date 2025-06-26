// backend/routes/bookingRoute.js (or sessionRoute.js)

import express from "express";
import {
  createBooking,
  getUserBookings,
  getTeacherBookings,
  cancelBooking,
  confirmSession, // Import the new function
} from "../controllers/bookingController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import validator from "validator";

const router = express.Router();

// --- Student Routes ---
// Students create bookings
router.post("/create", isAuthenticated, authorizeRoles("student"), createBooking);
// Students get their own bookings
router.get("/user", isAuthenticated, authorizeRoles("student"), getUserBookings);

// --- Teacher Routes ---
// Teachers get their own bookings
router.get("/teacher", isAuthenticated, authorizeRoles("teacher"), getTeacherBookings);
// Teachers confirm a pending booking and add a link
router.put("/:sessionId/confirm", isAuthenticated, authorizeRoles("teacher"), confirmSession);

// --- Shared Routes ---
// Both students and teachers can cancel a session (rules applied in controller)
router.put("/:bookingId/cancel", isAuthenticated, cancelBooking);

export default router;
