import Session from "../models/Session.js";
import TeacherProfile from "../models/teacherProfile.js";
import validator from "validator";
import { createNotification } from "./notificationController.js";
import User from "../models/userModel.js";
import snap from "../config/midtrans.js";
import { sendEmail } from "../utils/email.js";

// Student: Create a new session booking
export const createBooking = async (req, res) => {
  try {
    const { teacherId, date, startTime, duration = 60, notes, type = "online" } = req.body;
    const studentId = req.user._id;

    // --- FIX: Fetch the full student object ---
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student user not found." });
    }

    if (!teacherId || !date || !startTime) {
      return res.status(400).json({ success: false, message: "Teacher, date, and start time are required." });
    }

    // --- Time and Price Calculation ---
    const [hours, minutes] = startTime.split(":");
    const sessionDate = new Date(`${date}T00:00:00.000Z`);
    sessionDate.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(sessionDate.getTime() + duration * 60000);
    const endTimeString = endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });

    const teacherProfile = await TeacherProfile.findOne({ userId: teacherId }).populate("userId", "fullName");
    if (!teacherProfile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }

    // --- Check for Conflicts ---
    const existingBooking = await Session.findOne({
      teacherId,
      date: sessionDate,
      status: { $in: ["pending_confirmation", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).json({ success: false, message: "This time slot is already booked or pending. Please choose another time." });
    }

    // --- Create Session with pending payment status ---
    const newSession = new Session({
      teacherId,
      studentId,
      date: sessionDate,
      startTime,
      endTime: endTimeString,
      duration,
      price: teacherProfile.hourlyRate,
      type,
      notes,
      status: "pending_payment",
      paymentStatus: "pending",
    });

    await newSession.save(); // Save the session first to get a unique _id

    // Create a transaction object for Midtrans
    const transactionDetails = {
      transaction_details: {
        order_id: newSession._id.toString(),
        gross_amount: newSession.price,
      },
      customer_details: {
        first_name: student.fullName,
        email: student.email,
        phone: student.phoneNumber || "N/A",
      },
      item_details: [
        {
          id: teacherId.toString(),
          price: newSession.price,
          quantity: 1,
          name: `Tutoring Session with ${teacherProfile.userId.fullName}`,
          category: "Education",
        },
      ],
    };

    const transactionToken = await snap.createTransactionToken(transactionDetails);

    res.status(201).json({
      success: true,
      message: "Booking initiated. Please complete the payment.",
      token: transactionToken,
      sessionId: newSession._id,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: "Error creating booking." });
  }
};

// --- REST OF THE FILE REMAINS THE SAME ---

// Teacher: Confirm a session and add the meeting link
export const confirmSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sessionLink } = req.body;
    const teacherId = req.user._id;

    if (!sessionLink || !validator.isURL(sessionLink)) {
      return res.status(400).json({ success: false, message: "A valid session link is required." });
    }

    // --- MODIFIED: Added checks for data integrity ---
    const session = await Session.findById(sessionId).populate("studentId", "fullName email").populate("teacherId", "fullName email"); // Populating email for the teacher as well

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    // This check handles the case where the teacher record was deleted.
    if (!session.teacherId) {
      console.error(`Data integrity issue: Session ${sessionId} has an invalid teacherId.`);
      return res.status(404).json({ success: false, message: "The teacher associated with this booking could not be found." });
    }
    // ----------------------------------------------------

    if (session.teacherId._id.toString() !== teacherId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to confirm this session." });
    }
    if (session.status !== "pending_confirmation") {
      return res.status(400).json({ success: false, message: `Cannot confirm a session with status: ${session.status}` });
    }

    session.sessionLink = sessionLink;
    session.status = "confirmed";
    await session.save();

    await createNotification(session.studentId, "booking_confirmed", `Your session with ${session.teacherId.fullName} on ${new Date(session.date).toLocaleDateString()} has been confirmed.`, "/my-appointments");

    await sendEmail(session.studentId.email, "session_confirmed", {
      studentName: session.studentId.fullName,
      teacherName: session.teacherId.fullName,
      sessionDate: new Date(session.date).toLocaleDateString(),
      sessionLink: sessionLink,
    });

    res.status(200).json({ success: true, message: "Session confirmed successfully.", session });
  } catch (error) {
    console.error("Confirm session error:", error);
    res.status(500).json({ success: false, message: "Error confirming session." });
  }
};

// Get sessions for the logged-in student
export const getUserBookings = async (req, res) => {
  try {
    const studentId = req.user._id;
    const sessions = await Session.find({ studentId })
      .populate({
        path: "teacherId",
        select: "fullName profilePicture",
      })
      .sort({ date: -1 });

    res.status(200).json({ success: true, bookings: sessions });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ success: false, message: "Error fetching your sessions." });
  }
};

// Get sessions for the logged-in teacher
export const getTeacherBookings = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const sessions = await Session.find({ teacherId }).populate("studentId", "fullName profilePicture").sort({ date: -1 });

    res.status(200).json({ success: true, bookings: sessions });
  } catch (error) {
    console.error("Get teacher bookings error:", error);
    res.status(500).json({ success: false, message: "Error fetching your sessions." });
  }
};

// Update booking status - This is a general function, might be used by an admin later.
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const session = await Session.findById(bookingId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if user has permission to update
    if (session.studentId.toString() !== req.user._id.toString() && session.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this session" });
    }

    session.status = status;
    await session.save();

    res.status(200).json({
      success: true,
      message: "Session status updated successfully",
      booking: session,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Error updating session status", error: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const cancelingUser = req.user;

    const session = await Session.findById(bookingId).populate("studentId", "fullName email").populate("teacherId", "fullName email");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    const isStudent = session.studentId._id.toString() === cancelingUser._id.toString();
    const isTeacher = session.teacherId._id.toString() === cancelingUser._id.toString();

    if (!isStudent && !isTeacher) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this session." });
    }

    if (session.status === "completed" || session.status === "cancelled") {
      return res.status(400).json({ success: false, message: `Cannot cancel a session that is already ${session.status}.` });
    }

    if (isTeacher) {
      session.status = "cancelled";
      await session.save();

      await createNotification(session.studentId, "booking_cancelled_by_teacher", `Your session with ${cancelingUser.fullName} has been cancelled. A full refund will be processed.`, "/my-appointments");

      await sendEmail(session.studentId.email, "session_cancelled", {
        recipientName: session.studentId.fullName,
        cancellerName: cancelingUser.fullName,
        sessionDate: new Date(session.date).toLocaleDateString(),
        reason: "The session was cancelled by the teacher. A full refund will be processed.",
      });

      return res.status(200).json({ success: true, message: "Session cancelled successfully. The student has been notified and refunded." });
    }

    if (isStudent) {
      if (session.status === "confirmed") {
        return res.status(403).json({ success: false, message: "This session is confirmed and can no longer be cancelled. Please contact the teacher or support if you have an issue." });
      }

      const sessionTime = new Date(session.date).getTime();
      const now = new Date().getTime();
      const hoursUntil = (sessionTime - now) / (1000 * 60 * 60);

      session.status = "cancelled";
      await session.save();

      await createNotification(session.teacherId, "booking_cancelled_by_student", `${cancelingUser.fullName} has cancelled their upcoming session.`, "/teacher/dashboard/sessions");

      await sendEmail(session.teacherId.email, "session_cancelled", {
        recipientName: session.teacherId.fullName,
        cancellerName: cancelingUser.fullName,
        sessionDate: new Date(session.date).toLocaleDateString(),
        reason: "The session was cancelled by the student.",
      });

      if (hoursUntil > 24) {
        return res.status(200).json({ success: true, message: "Session cancelled successfully. A full refund will be processed." });
      }
      if (hoursUntil >= 2 && hoursUntil <= 24) {
        const tutorPayment = session.price * 0.5;
        await TeacherProfile.findOneAndUpdate({ userId: session.teacherId }, { $inc: { earnings: tutorPayment } });
        return res.status(200).json({ success: true, message: "Session cancelled. A 50% refund will be processed and the tutor has been compensated." });
      }
      if (hoursUntil < 2) {
        const tutorPayment = session.price * 0.95;
        await TeacherProfile.findOneAndUpdate({ userId: session.teacherId }, { $inc: { earnings: tutorPayment } });
        return res.status(200).json({ success: true, message: "Cancellation is within 2 hours. No refund is applicable and the tutor has been paid." });
      }
    }
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ success: false, message: "Error cancelling session." });
  }
};

export const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const teacherId = req.user._id;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    if (session.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to complete this session." });
    }

    if (session.status !== "confirmed") {
      return res.status(400).json({ success: false, message: `Cannot complete a session with status: ${session.status}` });
    }

    const sessionStartTime = new Date(session.date).getTime();
    if (Date.now() < sessionStartTime - 30 * 60 * 1000) {
      return res.status(400).json({ success: false, message: "Cannot complete a session that is still far in the future." });
    }

    session.status = "completed";
    await session.save();

    const commissionRate = 0.05;
    const sessionPrice = session.price;
    const commissionAmount = sessionPrice * commissionRate;
    const netEarnings = sessionPrice - commissionAmount;

    await TeacherProfile.findOneAndUpdate(
      { userId: session.teacherId },
      {
        $inc: { earnings: netEarnings, lifetimeEarnings: netEarnings },
      }
    );

    await createNotification(session.studentId, "session_completed", `Your session with ${req.user.fullName} is complete. We'd love to hear your feedback!`, "/my-appointments");
    res.status(200).json({ success: true, message: "Session marked as completed successfully.", session });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ success: false, message: "Error completing session." });
  }
};
