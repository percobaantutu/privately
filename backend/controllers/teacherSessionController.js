import Session from "../models/Session.js";
import userModel from "../models/userModel.js"; // To populate student details

// @desc    Get all sessions for the logged-in teacher
// @route   GET /api/teacher/sessions
// @access  Private (Teacher)
export const getTeacherSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ teacherId: req.teacher._id })
      .populate("studentId", "name email image") // Basic student info for list view
      .sort({ date: -1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Error fetching teacher sessions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a single session by ID for the logged-in teacher
// @route   GET /api/teacher/sessions/:sessionId
// @access  Private (Teacher)
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      teacherId: req.teacher._id,
    }).populate("studentId", "name email image educationLevel learningGoals preferredSubjects"); // Populate more for details view later

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Error fetching session by ID:", error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new session
// @route   POST /api/teacher/sessions
// @access  Private (Teacher)
export const createSession = async (req, res) => {
  try {
    const {
      studentId,
      date: dateString, // Expecting YYYY-MM-DD string from client
      startTime,   // e.g., "14:00"
      duration,    // 60 or 120
      topic,
    } = req.body;

    const teacherId = req.teacher._id;
    const teacherFeePerSession = req.teacher.fees; // This is per-session fee

    if (!studentId || !dateString || !startTime || !duration || !topic) {
      return res.status(400).json({ success: false, message: "Missing required fields: studentId, date, startTime, duration, topic" });
    }
    if (![60, 120].includes(Number(duration))) {
        return res.status(400).json({ success: false, message: "Duration must be 60 or 120 minutes." });
    }
    const studentExists = await userModel.findById(studentId);
    if (!studentExists) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Construct the full session start Date object
    // Assuming dateString is 'YYYY-MM-DD' and startTime is 'HH:MM'
    const [hours, minutes] = startTime.split(":").map(Number);
    const sessionStartDateTime = new Date(dateString);
    sessionStartDateTime.setUTCHours(hours, minutes, 0, 0); // Use UTC to avoid local timezone shifts if dateString is just date part

    if (isNaN(sessionStartDateTime.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date or startTime format. Use YYYY-MM-DD for date and HH:MM for startTime." });
    }

    const sessionEndDateTime = new Date(sessionStartDateTime.getTime() + Number(duration) * 60000);
    const endTimeString = `${String(sessionEndDateTime.getUTCHours()).padStart(2, '0')}:${String(sessionEndDateTime.getUTCMinutes()).padStart(2, '0')}`;

    // 24-hour advance booking requirement
    const now = new Date();
    if (sessionStartDateTime.getTime() - now.getTime() < (24 * 60 * 60 * 1000)) {
        return res.status(400).json({ success: false, message: "Sessions must be scheduled at least 24 hours in advance." });
    }

    // Basic conflict check (can be improved later)
    const existingSession = await Session.findOne({
      teacherId,
      date: sessionStartDateTime, // Check against the exact start date & time
      // Could also check for overlapping time ranges if needed for more robust conflict detection
      status: { $in: ["pending_confirmation", "confirmed"] }
    });
    if (existingSession) {
      return res.status(409).json({ success: false, message: "Time slot conflict. The teacher already has a session at this time." });
    }

    const newSession = new Session({
      teacherId,
      studentId,
      date: sessionStartDateTime, // Store the full Date object
      startTime,                 // Store the string for display
      endTime: endTimeString,
      duration: Number(duration),
      topic,
      price: teacherFeePerSession, // Price per session
      status: "confirmed",       // Teacher creates it as confirmed
    });

    await newSession.save();
    const populatedSession = await Session.findById(newSession._id)
                                      .populate("studentId", "name email image");

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      session: populatedSession,
    });

  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};