// backend/controllers/reviewController.js

import Review from "../models/Review.js";
import Session from "../models/Session.js";
import TeacherProfile from "../models/teacherProfile.js";
import { createNotification } from "./notificationController.js";
import User from "../models/userModel.js"; // We need this for populating student info

// Helper function to calculate and update a teacher's average rating
const updateTeacherRating = async (teacherId) => {
  const reviews = await Review.find({ teacherId });

  if (reviews.length === 0) {
    await TeacherProfile.findOneAndUpdate({ userId: teacherId }, { rating: 0 });
    return;
  }

  const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
  const averageRating = totalRating / reviews.length;

  await TeacherProfile.findOneAndUpdate({ userId: teacherId }, { rating: averageRating.toFixed(1) });
};

// Controller to create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { sessionId } = req.params;
    const studentId = req.user._id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    if (session.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({ success: false, message: "You can only review your own sessions." });
    }

    if (session.status !== "completed") {
      return res.status(400).json({ success: false, message: "You can only review completed sessions." });
    }

    const existingReview = await Review.findOne({ sessionId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this session." });
    }

    const newReview = new Review({
      sessionId,
      studentId,
      teacherId: session.teacherId,
      rating,
      comment,
    });

    await newReview.save();
    await updateTeacherRating(session.teacherId);
    await createNotification(session.teacherId, "new_review", `${req.user.fullName} left a ${rating}-star review for your recent session.`, `/session/${session.teacherId}`);

    res.status(201).json({ success: true, message: "Thank you for your review!", review: newReview });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Server error while creating review." });
  }
};

// Controller to get all reviews for a specific teacher
export const getTeacherReviews = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const reviews = await Review.find({ teacherId }).populate("studentId", "fullName profilePicture").sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching reviews." });
  }
};

export const checkReviewExists = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const existingReview = await Review.findOne({ sessionId: sessionId, studentId: req.user._id });

    if (existingReview) {
      res.status(200).json({ success: true, exists: true });
    } else {
      res.status(200).json({ success: true, exists: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error checking review." });
  }
};
