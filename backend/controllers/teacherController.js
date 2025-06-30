// backend/controllers/teacherController.js

import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";
import Session from "../models/Session.js";

// Get a list of all VERIFIED teachers with their profiles
const teacherList = async (req, res) => {
  try {
    // 1. Find all verified and active teacher users
    const teachersAsUsers = await User.find({
      role: "teacher",
      isVerified: true,
      isActive: true,
    })
      .select("-password")
      .lean(); // .lean() makes them plain JS objects

    // 2. Get all of their user IDs
    const teacherUserIds = teachersAsUsers.map((teacher) => teacher._id);

    // 3. Find all teacher profiles that match those user IDs
    const teacherProfiles = await TeacherProfile.find({
      userId: { $in: teacherUserIds },
    }).lean();

    // 4. Create a map for easy lookup
    const profileMap = new Map(teacherProfiles.map((profile) => [profile.userId.toString(), profile]));

    // 5. Combine the data
    const fullTeacherData = teachersAsUsers.map((user) => {
      const profile = profileMap.get(user._id.toString());

      // ✅ Combine user data and profile data, ensuring user._id is the primary _id
      return {
        _id: user._id, // The main user ID
        name: user.fullName,
        email: user.email,
        image: user.profilePicture,
        isActive: user.isActive,
        // from profile
        speciality: profile?.speciality,
        degree: profile?.degree,
        experience: profile?.experience,
        about: profile?.about,
        fees: profile?.hourlyRate,
        address: profile?.address,
      };
    });

    res.status(200).json({ success: true, teachers: fullTeacherData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching teacher list: " + error.message });
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

// We no longer need registerTeacher or loginTeacher here.
export {
  teacherList,
  changeAvailability,

  // updateTeacherProfile
};
