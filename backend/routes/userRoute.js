import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/userController.js";
// Removed import of upload middleware as uploadProfilePicture moved
// import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/me", getCurrentUser);
// Removed the PUT /me and POST /upload-profile-picture routes
// userRouter.put("/me", updateUserProfile);
// userRouter.post("/upload-profile-picture", upload.single('image'), uploadProfilePicture);

export default userRouter;
