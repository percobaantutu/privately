// backend/routes/teacherRoute.js

import express from "express";

import { teacherList, getTeacherEarnings } from "../controllers/teacherController.js";

import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
// We will add getTeacherProfile later, for now we only need teacherList

const teacherRouter = express.Router();

// PUBLIC ROUTE: Get a list of all verified teachers
teacherRouter.get("/list", teacherList);
teacherRouter.get("/me/earnings", isAuthenticated, authorizeRoles("teacher"), getTeacherEarnings);

// PROTECTED ROUTE EXAMPLE (for the future):
// This route would get the profile of the currently logged-in teacher.
// We'll add the getTeacherProfile function back to a controller later.
// For now, this shows the correct structure.
// teacherRouter.get("/profile", isAuthenticated, authorizeRoles('teacher'), getTeacherProfile);

export default teacherRouter;
