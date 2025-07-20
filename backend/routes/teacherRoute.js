// backend/routes/teacherRoute.js

import express from "express";

// --- UPDATED: Import new controller functions ---
import {
  teacherList,
  getTeacherEarnings,
  getMyAvailability, // New
  updateMyAvailability, // New
  getPublicTeacherSlots, // New
} from "../controllers/teacherController.js";

import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const teacherRouter = express.Router();

// --- PUBLIC ROUTES ---
// Get a list of all verified teachers with filters
teacherRouter.get("/list", teacherList);

// Get calculated, bookable slots for a specific teacher on a given date
teacherRouter.get("/:teacherId/slots/:date", getPublicTeacherSlots);

// --- TEACHER AUTHENTICATED ROUTES ---
// Get the logged-in teacher's earnings data
teacherRouter.get("/me/earnings", isAuthenticated, authorizeRoles("teacher"), getTeacherEarnings);

// Get the logged-in teacher's weekly availability schedule
teacherRouter.get("/me/availability", isAuthenticated, authorizeRoles("teacher"), getMyAvailability);

// Update the logged-in teacher's weekly availability schedule
teacherRouter.put("/me/availability", isAuthenticated, authorizeRoles("teacher"), updateMyAvailability);

export default teacherRouter;
