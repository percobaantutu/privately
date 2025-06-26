// backend/controllers/teacherController.js

import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";

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

// We no longer need registerTeacher or loginTeacher here.
export {
  teacherList,
  changeAvailability,
  // updateTeacherProfile
};
