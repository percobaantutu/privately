// backend/controllers/teacherController.js

import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";
import Session from "../models/Session.js";
import Payout from "../models/Payout.js"; // Import Payout model for future use

// Get a list of all VERIFIED teachers with their profiles
const teacherList = async (req, res) => {
  try {
    const { search, speciality, minFee, maxFee, minRating, sortBy } = req.query;

    const userMatchCriteria = {
      role: "teacher",
      isVerified: true,
      isActive: true,
    };

    if (search) {
      userMatchCriteria.fullName = { $regex: search, $options: "i" };
    }

    const matchingUsers = await User.find(userMatchCriteria).select("_id").lean();
    const teacherUserIds = matchingUsers.map((user) => user._id);

    if (teacherUserIds.length === 0) {
      return res.status(200).json({ success: true, teachers: [] });
    }

    const profileMatchCriteria = {
      userId: { $in: teacherUserIds },
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

    let sortOption = {};
    if (sortBy === "rating_desc") {
      sortOption = { rating: -1 };
    } else if (sortBy === "fee_asc") {
      sortOption = { hourlyRate: 1 };
    } else if (sortBy === "fee_desc") {
      sortOption = { hourlyRate: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const finalTeacherProfiles = await TeacherProfile.find(profileMatchCriteria)
      .sort(sortOption)
      .populate({
        path: "userId",
        select: "-password",
      })
      .lean();

    const fullTeacherData = finalTeacherProfiles
      .map((profile) => {
        if (!profile.userId) return null;
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
          rating: profile.rating,
        };
      })
      .filter(Boolean);

    res.status(200).json({ success: true, teachers: fullTeacherData });
  } catch (error) {
    console.error("Error fetching filtered teacher list:", error);
    res.status(500).json({ success: false, message: "Server error fetching teachers." });
  }
};

const changeAvailability = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }
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

    const teacherProfile = await TeacherProfile.findOne({ userId: teacherId }).lean();
    if (!teacherProfile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }

    const completedSessions = await Session.find({
      teacherId: teacherId,
      status: "completed",
    })
      .populate("studentId", "fullName profilePicture")
      .sort({ date: -1 })
      .lean();

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const nextPayoutDate = new Date(today);
    nextPayoutDate.setDate(today.getDate() + daysUntilFriday);
    if (daysUntilFriday === 0 && today.getHours() >= 17) {
      nextPayoutDate.setDate(today.getDate() + 7);
    }

    res.status(200).json({
      success: true,
      earningsData: {
        lifetimeEarnings: teacherProfile.lifetimeEarnings || 0,
        currentBalance: teacherProfile.earnings || 0,
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

export const updateMyAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const profile = await TeacherProfile.findOneAndUpdate({ userId: req.user._id }, { availability }, { new: true, runValidators: true });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }
    res.status(200).json({ success: true, message: "Availability updated successfully.", availability: profile.availability });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating availability." });
  }
};

export const getPublicTeacherSlots = async (req, res) => {
  try {
    const { teacherId, date } = req.params;
    const selectedDate = new Date(`${date}T00:00:00.000Z`);

    const profile = await TeacherProfile.findOne({ userId: teacherId });
    if (!profile || !profile.availability) {
      return res.status(200).json({ success: true, slots: [] });
    }

    const dayOfWeek = selectedDate.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" });
    const daySchedule = profile.availability[dayOfWeek] || [];

    if (daySchedule.length === 0) {
      return res.status(200).json({ success: true, slots: [] });
    }

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
    const availableSlots = daySchedule.filter((time) => !bookedTimes.has(time));

    res.status(200).json({ success: true, slots: availableSlots });
  } catch (error) {
    console.error("Error fetching public slots:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const teacherUserId = req.user._id;

    const { fullName, speciality, degree, experience, about, hourlyRate, address, bankDetails, verificationDetails } = req.body;

    if (fullName) {
      await User.findByIdAndUpdate(teacherUserId, { fullName });
    }

    const profileDataToUpdate = {
      speciality,
      degree,
      experience,
      about,
      hourlyRate,
      address,
      bankDetails,
      verificationDetails,
    };

    const updatedProfile = await TeacherProfile.findOneAndUpdate({ userId: teacherUserId }, profileDataToUpdate, { new: true, runValidators: true });

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Teacher profile not found." });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Update teacher profile error:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile." });
  }
};

export { teacherList, changeAvailability };
