// backend/controllers/bookingController.js

import Session from "../models/Session.js";
import TeacherProfile from "../models/teacherProfile.js"; // ✅ FIX: Corrected casing from teacherProfile.js
import validator from "validator"; // ✅ FIX: Added import for validator

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
    const session = await Session.findById(bookingId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    if (session.studentId.toString() !== req.user._id.toString() && session.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this session." });
    }

    const sessionTime = new Date(session.date).getTime();
    const now = new Date().getTime();
    const hoursUntil = (sessionTime - now) / (1000 * 60 * 60);

    if (req.user.role === "student" && hoursUntil < 2) {
      return res.status(400).json({ success: false, message: "Cannot cancel less than 2 hours before the session." });
    }

    session.status = "cancelled";
    await session.save();

    res.status(200).json({ success: true, message: "Session cancelled successfully", booking: session });
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

    // 1. Authorization: Only the teacher of this session can mark it as complete.
    if (session.teacherId.toString() !== teacherId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to complete this session." });
    }

    // 2. Status Check: Can only complete a 'confirmed' session.
    if (session.status !== "confirmed") {
      return res.status(400).json({ success: false, message: `Cannot complete a session with status: ${session.status}` });
    }

    // 3. Time Check (Optional but good practice): Prevent completing sessions far in the future.
    const sessionStartTime = new Date(session.date).getTime();
    if (Date.now() < sessionStartTime - 30 * 60 * 1000) {
      // Allows completion 30 mins before start
      return res.status(400).json({ success: false, message: "Cannot complete a session that is still far in the future." });
    }

    // 4. Update the status
    session.status = "completed";
    await session.save();

    // TODO (Phase 4): This is where we will trigger commission calculation and add to teacher's earnings.

    res.status(200).json({ success: true, message: "Session marked as completed successfully.", session });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ success: false, message: "Error completing session." });
  }
};
