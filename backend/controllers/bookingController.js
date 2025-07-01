import Session from "../models/Session.js";
import TeacherProfile from "../models/teacherProfile.js";
import validator from "validator"; //
import { createNotification } from "./notificationController.js";
import User from "../models/userModel.js";

// Student: Create a new session booking
export const createBooking = async (req, res) => {
  try {
    const { teacherId, date, startTime, duration = 60, notes, type = "online" } = req.body;
    const studentId = req.user._id;

    if (!teacherId || !date || !startTime) {
      return res.status(400).json({ success: false, message: "Teacher, date, and start time are required." });
    }

    // --- Time and Price Calculation ---
    const [hours, minutes] = startTime.split(":");
    const sessionDate = new Date(date);
    sessionDate.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(sessionDate.getTime() + duration * 60000);
    const endTimeString = endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });

    const teacherProfile = await TeacherProfile.findOne({ userId: teacherId });
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

    // --- Create Session ---
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
      status: "pending_confirmation",
      paymentStatus: "paid", // Placeholder
    });

    await newSession.save();
    await createNotification(teacherId, "new_booking", `${req.user.fullName} has requested a session with you.`, "/teacher/dashboard/sessions");

    res.status(201).json({
      success: true,
      message: "Session booked successfully! Awaiting teacher's confirmation.",
      session: newSession,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: "Error creating booking." });
  }
};

// Teacher: Confirm a session and add the meeting link
export const confirmSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sessionLink } = req.body;
    const teacherId = req.user._id;

    if (!sessionLink || !validator.isURL(sessionLink)) {
      return res.status(400).json({ success: false, message: "A valid session link is required." });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }
    if (session.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to confirm this session." });
    }
    if (session.status !== "pending_confirmation") {
      return res.status(400).json({ success: false, message: `Cannot confirm a session with status: ${session.status}` });
    }

    session.sessionLink = sessionLink;
    session.status = "confirmed";
    await session.save();
    await createNotification(session.studentId, "booking_confirmed", `Your session with ${req.user.fullName} on ${new Date(session.date).toLocaleDateString()} has been confirmed.`, "/my-appointments");

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

    // ✅ FIX: Changed Booking to Session
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
      booking: session, // Keep 'booking' for frontend compatibility if needed, or change to 'session'
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
    const cancelingUser = req.user; // User object from isAuthenticated middleware

    const session = await Session.findById(bookingId).populate("studentId", "fullName").populate("teacherId", "fullName");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    // Authorization check
    if (session.studentId.toString() !== cancelingUser._id.toString() && session.teacherId.toString() !== cancelingUser._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this session." });
    }

    // Prevent cancelling sessions that are not confirmed or pending
    if (session.status !== "pending_confirmation" && session.status !== "confirmed") {
      return res.status(400).json({ success: false, message: `Cannot cancel a session with status: ${session.status}` });
    }

    // --- Cancellation Logic ---
    session.status = "cancelled";

    // CASE 1: Teacher initiates cancellation
    if (cancelingUser.role === "teacher") {
      // No payment to the tutor. Student gets a full refund (handled by payment system later).
      await session.save();
      if (cancelingUser.role === "student") {
        await createNotification(session.teacherId._id, "booking_cancelled_by_student", `${session.studentId.fullName} cancelled your upcoming session.`, "/teacher/dashboard/sessions");
      } else if (cancelingUser.role === "teacher") {
        await createNotification(session.studentId._id, "booking_cancelled_by_teacher", `Your session with ${session.teacherId.fullName} has been cancelled.`, "/my-appointments");
      }
      return res.status(200).json({ success: true, message: "Session cancelled successfully. The student has been notified." });
    }

    // CASE 2: Student initiates cancellation
    if (cancelingUser.role === "student") {
      const sessionTime = new Date(session.date).getTime();
      const now = new Date().getTime();
      const hoursUntil = (sessionTime - now) / (1000 * 60 * 60);

      // Sub-case 2.1: More than 24 hours notice
      if (hoursUntil > 24) {
        await session.save();
        return res.status(200).json({ success: true, message: "Session cancelled successfully. A full refund will be processed." });
      }

      // Sub-case 2.2: Between 2 and 24 hours notice
      if (hoursUntil >= 2 && hoursUntil <= 24) {
        const tutorPayment = session.price * 0.5; // Tutor gets 50%
        await TeacherProfile.findOneAndUpdate({ userId: session.teacherId }, { $inc: { earnings: tutorPayment } });
        await session.save();
        return res.status(200).json({ success: true, message: "Session cancelled. A 50% refund will be processed and the tutor has been compensated." });
      }

      // Sub-case 2.3: Less than 2 hours notice (or No-Show scenario)
      if (hoursUntil < 2) {
        const tutorPayment = session.price * 0.95; // Tutor gets full fee minus 5% platform commission
        await TeacherProfile.findOneAndUpdate({ userId: session.teacherId }, { $inc: { earnings: tutorPayment } });
        await session.save();
        return res.status(200).json({ success: true, message: "Cancellation is within 2 hours. No refund is applicable and the tutor has been paid." });
      }
    }

    // Fallback in case role is not student/teacher (should not happen with authorizeRoles)
    await session.save();
    res.status(200).json({ success: true, message: "Session cancelled." });
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

    // Update the status
    session.status = "completed";
    await session.save();

    // ✅ START: PHASE 4 - Commission and Earnings Logic
    const commissionRate = 0.05; // 5%
    const sessionPrice = session.price;
    const commissionAmount = sessionPrice * commissionRate;
    const netEarnings = sessionPrice - commissionAmount;

    // Atomically increment the teacher's earnings in their profile
    await TeacherProfile.findOneAndUpdate({ userId: session.teacherId }, { $inc: { earnings: netEarnings } });
    // ✅ END: PHASE 4 - Commission and Earnings Logic

    await createNotification(session.studentId, "session_completed", `Your session with ${req.user.fullName} is complete. We'd love to hear your feedback!`, "/my-appointments");
    res.status(200).json({ success: true, message: "Session marked as completed successfully.", session });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ success: false, message: "Error completing session." });
  }
};
