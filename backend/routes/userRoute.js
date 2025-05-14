import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/me", getCurrentUser);

export default userRouter;
