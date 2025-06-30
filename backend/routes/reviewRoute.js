// backend/routes/reviewRoute.js

import express from "express";
import { createReview, getTeacherReviews } from "../controllers/reviewController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Route for a student to create a new review for a specific session
// POST /api/reviews/session/:sessionId
router.post("/session/:sessionId", isAuthenticated, authorizeRoles("student"), createReview);

// Route to get all reviews for a specific teacher (this can be public)
// GET /api/reviews/teacher/:teacherId
router.get("/teacher/:teacherId", getTeacherReviews);

export default router;
