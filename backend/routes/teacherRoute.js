import express from "express";
import { teacherList } from "../controllers/teacherController.js";

const teacherRouter = express.Router();

teacherRouter.get("/list", teacherList);

export default teacherRouter;
