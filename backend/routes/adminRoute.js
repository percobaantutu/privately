// backend/routes/adminRoute.js

import express from "express";
// Import the new function from adminController

import { addTeacherByAdmin, loginAdmin, updateTeacherStatus, getAllTeachersForAdmin, getPendingTeachers, verifyTeacher } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
// We no longer need teacherList from teacherController here
// import { teacherList } from "../controllers/teacherController.js";

const adminRouter = express.Router();

adminRouter.post("/add-teacher", authAdmin, upload.single("image"), addTeacherByAdmin);
adminRouter.post("/login", loginAdmin);

// UPDATED: This route now points to our new admin-specific controller function
adminRouter.get("/all-teachers", authAdmin, getAllTeachersForAdmin);

adminRouter.put("/teacher-status", authAdmin, updateTeacherStatus);

// --- NEW VERIFICATION ROUTES ---

// GET route to fetch all teachers waiting for verification
adminRouter.get("/teachers/pending", authAdmin, getPendingTeachers);

// PUT route to verify a specific teacher by their ID
adminRouter.put("/teachers/verify/:teacherId", authAdmin, verifyTeacher);

export default adminRouter;
