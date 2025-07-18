// backend/models/Session.js (rename from Booking.js)

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    status: {
      type: String,
      enum: ["pending_payment", "pending_confirmation", "confirmed", "completed", "cancelled"],
      default: "pending_payment",
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending", // This will be updated once payment is integrated
    },
    sessionLink: {
      // The Zoom/GMeet link provided by the teacher
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
sessionSchema.index({ teacherId: 1, date: 1 });
sessionSchema.index({ studentId: 1, date: 1 });

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
