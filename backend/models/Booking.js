import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
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
      default: 30, // in minutes
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["online", "in-person"],
      default: "online",
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
bookingSchema.index({ teacherId: 1, date: 1, startTime: 1 });
bookingSchema.index({ studentId: 1, date: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking; 