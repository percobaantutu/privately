import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher", // Make sure 'teacher' matches your teacher model name
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Make sure 'user' matches your student user model name
      required: true,
      index: true,
    },
    date: { // This will store the full date and start time of the session
      type: Date,
      required: true,
    },
    startTime: { // For display purposes, e.g., "14:00"
      type: String,
      required: true,
    },
    endTime: { // For display purposes, e.g., "15:00"
      type: String,
      required: true,
    },
    duration: { // In minutes
      type: Number,
      required: true,
      enum: [60, 120],
    },
    status: {
      type: String,
      enum: ["pending_confirmation", "confirmed", "completed", "cancelled_by_student", "cancelled_by_teacher", "cancelled_by_admin"],
      default: "confirmed", // Default when teacher creates it
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    price: { // Per-session price
      type: Number,
      required: true,
    },
    // Notes & Review structures (to be fully implemented later)
    notes: {
      content: { type: String, default: "" },
      updatedAt: { type: Date },
    },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: "" },
      createdAt: { type: Date },
    },
    cancellationDetails: {
      cancelledBy: { type: String, enum: ["student", "teacher", "admin", null], default: null },
      reason: { type: String, default: "" },
      cancelledAt: { type: Date },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

sessionSchema.index({ teacherId: 1, date: 1 });
sessionSchema.index({ studentId: 1, date: 1 });

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;