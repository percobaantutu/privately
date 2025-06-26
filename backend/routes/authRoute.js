// backend/routes/authRoute.js

import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  register,
  login,
  logout,
  getMe, // This function gets the currently logged-in user's profile
  updateUserProfile,
  uploadProfilePicture,
} from "../controllers/authController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// --- Auth Routes ---
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// --- User Profile Routes (works for any logged-in user, including teachers) ---
router.get("/me", isAuthenticated, getMe); // The frontend will call this to get profile data
router.put("/me", isAuthenticated, updateUserProfile);
router.post("/upload-profile-picture", isAuthenticated, upload.single("image"), uploadProfilePicture);

export default router;
