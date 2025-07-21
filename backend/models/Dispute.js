import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    // This field will hold the evidence/details provided by the user.
    details: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved"],
      default: "open",
    },
    // This will be the final decision/note from the admin.
    resolution: {
      type: String,
    },
  },
  { timestamps: true }
);

const Dispute = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);

export default Dispute;
