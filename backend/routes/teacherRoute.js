import express from "express";
import { 
  teacherList, 
  registerTeacher, 
  loginTeacher, 
  getTeacherProfile, 
  updateTeacherProfile, 
  updateTeacherAvailability, 
  getTeacherSessions 
} from "../controllers/teacherController.js";
import { isTeacher } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const teacherRouter = express.Router();

// Public routes
teacherRouter.post("/register", registerTeacher);
teacherRouter.post("/login", loginTeacher);
teacherRouter.get("/list", teacherList);

// Protected routes (require teacher authentication)
teacherRouter.get("/profile", isTeacher, getTeacherProfile);
teacherRouter.put("/profile", isTeacher, updateTeacherProfile);
teacherRouter.put("/availability", isTeacher, updateTeacherAvailability);
teacherRouter.get("/sessions", isTeacher, getTeacherSessions);

export default teacherRouter;
