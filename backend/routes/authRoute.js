// backend/routes/authRoute.js

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/auth.js";
import {
  register,
  login,
  logout,
  getMe, // This function gets the currently logged-in user's profile
  updateUserProfile,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// --- Auth Routes ---
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// --- Google OAuth Routes ---
// This route starts the Google authentication process
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// This is the callback route that Google will redirect to
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login", // Redirect to login on failure
    session: false, // We are using JWTs, not sessions
  }),
  (req, res) => {
    // User is authenticated by passport at this point. `req.user` is available.
    const user = req.user;

    // Generate our own JWT for the user
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect the user back to the frontend homepage
    res.redirect("http://localhost:5173/");
  }
);

// --- User Profile Routes (works for any logged-in user, including teachers) ---
router.get("/me", isAuthenticated, getMe); // The frontend will call this to get profile data
router.put("/me", isAuthenticated, updateUserProfile);
router.post("/upload-profile-picture", isAuthenticated, upload.single("image"), uploadProfilePicture);

export default router;
