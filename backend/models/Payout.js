import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    teacherProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["processed", "failed"],
      default: "processed",
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Payout = mongoose.models.Payout || mongoose.model("Payout", payoutSchema);

export default Payout;
