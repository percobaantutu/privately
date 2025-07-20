// backend/controllers/teacherController.js

import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";
import Session from "../models/Session.js";

// Get a list of all VERIFIED teachers with their profiles
const teacherList = async (req, res) => {
  try {
    const { search, speciality, minFee, maxFee, minRating, sortBy } = req.query;

    // --- Step 1: Build the initial match criteria for the User model ---
    const userMatchCriteria = {
      role: "teacher",
      isVerified: true,
      isActive: true,
    };

    if (search) {
      // Case-insensitive search on the user's full name
      userMatchCriteria.fullName = { $regex: search, $options: "i" };
    }

    // --- Step 2: Find initial set of teacher user IDs based on user criteria ---
    const matchingUsers = await User.find(userMatchCriteria).select("_id").lean();
    const teacherUserIds = matchingUsers.map((user) => user._id);

    if (teacherUserIds.length === 0) {
      // If no users match the name search, return empty array immediately
      return res.status(200).json({ success: true, teachers: [] });
    }

    // --- Step 3: Build the match criteria for the TeacherProfile model ---
    const profileMatchCriteria = {
      userId: { $in: teacherUserIds }, // Filter profiles based on the users we found
    };

    if (speciality) {
      profileMatchCriteria.speciality = speciality;
    }
    if (minFee || maxFee) {
      profileMatchCriteria.hourlyRate = {};
      if (minFee) profileMatchCriteria.hourlyRate.$gte = Number(minFee);
      if (maxFee) profileMatchCriteria.hourlyRate.$lte = Number(maxFee);
    }
    if (minRating) {
      profileMatchCriteria.rating = { $gte: Number(minRating) };
    }
    if (search) {
      // If there's a search term, also search the 'about' section in the profile.
      // We use an $or condition to match either the user name (already filtered) OR the about text.
      // Since we've already filtered by user name, we only need to add the 'about' condition here.
      // We need to re-structure the query slightly to handle this OR condition.
      // For simplicity in this step, we will rely on the name search from the User model.
      // An even more advanced version could use an aggregation pipeline.
    }

    // --- Step 4: Define Sorting Options ---
    let sortOption = {};
    if (sortBy === "rating_desc") {
      sortOption = { rating: -1 };
    } else if (sortBy === "fee_asc") {
      sortOption = { hourlyRate: 1 };
    } else if (sortBy === "fee_desc") {
      sortOption = { hourlyRate: -1 };
    } else {
      // Default sort (e.g., by creation date or name)
      sortOption = { createdAt: -1 };
    }

    // --- Step 5: Execute the Final Query ---
    const finalTeacherProfiles = await TeacherProfile.find(profileMatchCriteria)
      .sort(sortOption)
      .populate({
        path: "userId",
        select: "-password", // Populate with user details, exclude password
      })
      .lean();

    // --- Step 6: Format the data for the frontend ---
    const fullTeacherData = finalTeacherProfiles
      .map((profile) => {
        if (!profile.userId) return null; // Skip if userId is null for some reason
        return {
          _id: profile.userId._id,
          name: profile.userId.fullName,
          email: profile.userId.email,
          image: profile.userId.profilePicture,
          isActive: profile.userId.isActive,
          speciality: profile.speciality,
          degree: profile.degree,
          experience: profile.experience,
          about: profile.about,
          fees: profile.hourlyRate,
          address: profile.address,
          rating: profile.rating, // Pass rating to frontend
        };
      })
      .filter(Boolean); // Remove any null entries

    res.status(200).json({ success: true, teachers: fullTeacherData });
  } catch (error) {
    console.error("Error fetching filtered teacher list:", error);
    res.status(500).json({ success: false, message: "Server error fetching teachers." });
  }
};

// Other teacher-specific controller functions (like updating profile) will go here.
// For example:

// Keep `changeAvailability` for the admin panel, but update it to use the new model.
const changeAvailability = async (req, res) => {
  try {
    const { teacherId } = req.body; // This is the user ID of the teacher

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    // This logic might need to change. Availability might be on the profile now.
    // For now, let's assume it's `isActive` on the User model.
    teacher.isActive = !teacher.isActive;
    await teacher.save();

    res.status(200).json({ success: true, message: "Teacher availability changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherEarnings = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1. Fetch the teacher's main profile for total earnings
    const teacherProfile = await TeacherProfile.findOne({ userId: teacherId }).lean();
    if (!teacherProfile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }

    // 2. Fetch all completed sessions to show as transactions
    const completedSessions = await Session.find({
      teacherId: teacherId,
      status: "completed",
    })
      .populate("studentId", "fullName profilePicture")
      .sort({ date: -1 })
      .lean();

    // 3. Calculate next payout date (weekly on Friday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Friday = 5
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const nextPayoutDate = new Date(today);
    nextPayoutDate.setDate(today.getDate() + daysUntilFriday);
    if (daysUntilFriday === 0 && today.getHours() >= 17) {
      // If it's Friday after 5 PM, schedule for next Friday
      nextPayoutDate.setDate(today.getDate() + 7);
    }

    res.status(200).json({
      success: true,
      earningsData: {
        totalEarnings: teacherProfile.earnings || 0,
        pendingPayout: teacherProfile.earnings || 0, // Assuming all earnings are pending for now
        transactions: completedSessions,
        nextPayoutDate: nextPayoutDate.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("Get teacher earnings error:", error);
    res.status(500).json({ success: false, message: "Server error fetching earnings data." });
  }
};

export const getMyAvailability = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }
    res.status(200).json({ success: true, availability: profile.availability });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching availability." });
  }
};

// Update the logged-in teacher's availability schedule
export const updateMyAvailability = async (req, res) => {
  try {
    const { availability } = req.body; // Expects the object like { Monday: ["09:00"], ... }

    const profile = await TeacherProfile.findOneAndUpdate({ userId: req.user._id }, { availability }, { new: true, runValidators: true });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }

    res.status(200).json({ success: true, message: "Availability updated successfully.", availability: profile.availability });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating availability." });
  }
};

// Get calculated, bookable slots for a specific teacher on a given date
export const getPublicTeacherSlots = async (req, res) => {
  try {
    const { teacherId, date } = req.params; // date is in YYYY-MM-DD format

    // ✅ FIX: Explicitly parse the incoming date string as UTC.
    const selectedDate = new Date(`${date}T00:00:00.000Z`);

    // 1. Get the teacher's general availability schedule
    const profile = await TeacherProfile.findOne({ userId: teacherId });
    if (!profile || !profile.availability) {
      return res.status(200).json({ success: true, slots: [] });
    }

    const dayOfWeek = selectedDate.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" });
    const daySchedule = profile.availability[dayOfWeek] || [];

    if (daySchedule.length === 0) {
      return res.status(200).json({ success: true, slots: [] });
    }

    // 2. Get sessions already booked for that specific UTC date
    // ✅ FIX: Use the UTC-parsed date to define the query boundaries.
    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingSessions = await Session.find({
      teacherId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["pending_confirmation", "confirmed"] },
    });

    const bookedTimes = new Set(existingSessions.map((session) => session.startTime));

    // 3. Filter the schedule to show only truly available slots
    const availableSlots = daySchedule.filter((time) => !bookedTimes.has(time));

    res.status(200).json({ success: true, slots: availableSlots });
  } catch (error) {
    console.error("Error fetching public slots:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// --- END OF NEW FUNCTIONS ---

// We no longer need registerTeacher or loginTeacher here.
export {
  teacherList,
  changeAvailability,

  // updateTeacherProfile
};
