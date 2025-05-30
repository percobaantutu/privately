import express from "express";
import { isTeacher } from "../middleware/auth.js";
import {
  createSession,
  getTeacherSessions,
  getSessionById,
} from "../controllers/teacherSessionController.js";

const teacherSessionRouter = express.Router();

teacherSessionRouter.use(isTeacher); // Protect all routes below

teacherSessionRouter.get("/", getTeacherSessions);
teacherSessionRouter.post("/", createSession);
teacherSessionRouter.get("/:sessionId", getSessionById);

export default teacherSessionRouter;