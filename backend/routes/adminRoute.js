import express from "express";
import { addTeacher, allTeachers, loginAdmin } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/teacherController.js";

const adminRouter = express.Router();

adminRouter.post("/add-teacher", authAdmin, upload.single("image"), addTeacher);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-teachers", authAdmin, allTeachers);
adminRouter.post("/change-availability", authAdmin, changeAvailability);

export default adminRouter;
