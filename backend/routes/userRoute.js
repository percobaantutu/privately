import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, updateUserProfile, uploadProfilePicture } from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/me", getCurrentUser);
userRouter.put("/me", updateUserProfile);

userRouter.post("/upload-profile-picture", upload.single('image'), uploadProfilePicture);

export default userRouter;
