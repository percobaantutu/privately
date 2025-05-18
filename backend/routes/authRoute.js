import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { register, login, logout, getMe, updateUserProfile, uploadProfilePicture } from "../controllers/authController.js";
import upload from "../middleware/multer.js"; // Assuming you have a multer middleware

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.put("/me", isAuthenticated, updateUserProfile);

// Profile picture upload route
router.post("/upload-profile-picture", isAuthenticated, upload.single('image'), uploadProfilePicture);

export default router; 