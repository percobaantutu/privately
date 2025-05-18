import express from "express";
import {
  createBooking,
  getUserBookings,
  getTeacherBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Create a new booking
router.post("/create", isAuthenticated, createBooking);

// Get user's bookings
router.get("/user", isAuthenticated, getUserBookings);

// Get teacher's bookings
router.get("/teacher", isAuthenticated, getTeacherBookings);

// Update booking status
router.put("/:bookingId/status", isAuthenticated, updateBookingStatus);

// Cancel booking
router.put("/:bookingId/cancel", isAuthenticated, cancelBooking);

export default router; 