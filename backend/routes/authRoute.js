// backend/routes/authRoute.js

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/auth.js";
import { register, login, logout, getMe, updateUserProfile, uploadProfilePicture, forgotPassword, resetPassword } from "../controllers/authController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// --- Auth Routes ---
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// --- Google OAuth Routes ---
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // USE THE ENVIRONMENT VARIABLE FOR THE FAILURE REDIRECT
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // USE THE ENVIRONMENT VARIABLE FOR THE SUCCESS REDIRECT
    res.redirect(process.env.FRONTEND_URL);
  }
);

// --- User Profile Routes ---
router.get("/me", isAuthenticated, getMe);
router.put("/me", isAuthenticated, updateUserProfile);
router.post("/upload-profile-picture", isAuthenticated, upload.single("image"), uploadProfilePicture);

export default router;
