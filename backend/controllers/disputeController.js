import Dispute from "../models/Dispute.js";
import Session from "../models/Session.js";
import TeacherProfile from "../models/teacherProfile.js";
import mongoose from "mongoose";

// Helper function to handle freezing earnings for a disputed session
const freezeDisputedEarnings = async (session, transactionSession) => {
  const commissionRate = 0.05;
  const netEarnings = session.price * (1 - commissionRate);

  // Decrement the current balance and increment a new 'disputedEarnings' field
  await TeacherProfile.findOneAndUpdate(
    { userId: session.teacherId },
    {
      $inc: {
        earnings: -netEarnings, // Remove from payable balance
      },
    },
    { session: transactionSession }
  );
};

// User (Student or Teacher): File a new dispute for a session
export const fileDispute = async (req, res) => {
  const { sessionId } = req.params;
  const { reason, details } = req.body;
  const userId = req.user._id;

  const transactionSession = await mongoose.startSession();
  transactionSession.startTransaction();

  try {
    const session = await Session.findById(sessionId).session(transactionSession);

    if (!session) {
      await transactionSession.abortTransaction();
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    const isStudent = session.studentId.toString() === userId.toString();
    const isTeacher = session.teacherId.toString() === userId.toString();

    if (!isStudent && !isTeacher) {
      await transactionSession.abortTransaction();
      return res.status(403).json({ success: false, message: "You are not authorized to file a dispute for this session." });
    }

    const existingDispute = await Dispute.findOne({ sessionId }).session(transactionSession);
    if (existingDispute) {
      await transactionSession.abortTransaction();
      return res.status(400).json({ success: false, message: "A dispute has already been filed for this session." });
    }

    const newDispute = new Dispute({
      sessionId,
      filedBy: userId,
      reason,
      details,
    });

    await newDispute.save({ session: transactionSession });

    // If the session was 'completed', freeze the tutor's earnings for this session
    if (session.status === "completed") {
      await freezeDisputedEarnings(session, transactionSession);
    }

    await transactionSession.commitTransaction();

    res.status(201).json({ success: true, message: "Dispute filed successfully. Our team will review it shortly." });
  } catch (error) {
    await transactionSession.abortTransaction();
    console.error("File dispute error:", error);
    res.status(500).json({ success: false, message: "Server error while filing dispute." });
  } finally {
    transactionSession.endSession();
  }
};

// Admin: Get all disputes
export const getAdminDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find().populate("sessionId").populate("filedBy", "fullName role").sort({ createdAt: -1 });

    res.status(200).json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching disputes." });
  }
};

// Admin: Resolve a dispute
export const resolveDispute = async (req, res) => {
  const { disputeId } = req.params;
  const { status, resolution } = req.body;

  try {
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ success: false, message: "Dispute not found." });
    }

    dispute.status = status;
    dispute.resolution = resolution;
    await dispute.save();

    // Note: Actual refund logic would be a manual process by the admin for now.
    // This action simply records the decision in the system.

    res.status(200).json({ success: true, message: "Dispute resolved successfully.", dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error resolving dispute." });
  }
};

// User: Get disputes they have filed
export const getUserDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({ filedBy: req.user._id })
      .populate({
        path: "sessionId",
        populate: [
          { path: "studentId", select: "fullName" },
          { path: "teacherId", select: "fullName" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching your disputes." });
  }
};
