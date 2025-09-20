import express from "express";
import {
  addTeacherByAdmin,
  getPendingPayouts,
  loginAdmin,
  processPayouts,
  updateTeacherStatus,
  getAllTeachersForAdmin,
  getPendingTeachers,
  verifyTeacher,
  getSingleTeacherForAdmin,
  getDashboardSummary,
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard-summary", authAdmin, getDashboardSummary);
adminRouter.post("/add-teacher", authAdmin, upload.single("image"), addTeacherByAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-teachers", authAdmin, getAllTeachersForAdmin);
adminRouter.get("/teacher/:id", authAdmin, getSingleTeacherForAdmin); // New route for single teacher details
adminRouter.put("/teacher-status", authAdmin, updateTeacherStatus);

// --- VERIFICATION ROUTES ---
adminRouter.get("/teachers/pending", authAdmin, getPendingTeachers);
adminRouter.put("/teachers/verify/:teacherId", authAdmin, verifyTeacher);

// --- FINANCIAL ROUTES ---
adminRouter.get("/payouts/pending", authAdmin, getPendingPayouts);
adminRouter.post("/payouts/process", authAdmin, processPayouts);

export default adminRouter;
