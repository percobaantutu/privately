import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";
import Payout from "../models/Payout.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";
import { sendEmail } from "../utils/email.js";
import Dispute from "../models/Dispute.js";

// Admin can add a new teacher, who will be auto-verified.
const addTeacherByAdmin = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

    const newUser = new User({
      fullName: name,
      email,
      password: hashedPassword,
      role: "teacher",
      profilePicture: imageUpload.secure_url,
      isVerified: true,
      isActive: true,
    });

    const savedUser = await newUser.save();

    await TeacherProfile.create({
      userId: savedUser._id,
      speciality,
      degree,
      experience,
      about,
      hourlyRate: Number(fees),
      address: JSON.parse(address),
    });

    res.status(201).json({ success: true, message: "Teacher added and verified successfully." });
  } catch (error) {
    console.error("Admin add teacher error:", error);
    res.status(500).json({ success: false, message: "Server error while adding teacher." });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

const updateTeacherStatus = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    teacher.isActive = !teacher.isActive;
    await teacher.save();

    res.status(200).json({ success: true, message: `Teacher status updated to ${teacher.isActive ? "Active" : "Inactive"}` });
  } catch (error) {
    console.error("Update teacher status error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getAllTeachersForAdmin = async (req, res) => {
  try {
    const teachersAsUsers = await User.find({ role: "teacher" }).select("-password").lean();

    if (!teachersAsUsers.length) {
      return res.status(200).json({ success: true, teachers: [] });
    }

    const teacherUserIds = teachersAsUsers.map((teacher) => teacher._id);
    const teacherProfiles = await TeacherProfile.find({
      userId: { $in: teacherUserIds },
    }).lean();

    const profileMap = new Map(teacherProfiles.map((profile) => [profile.userId.toString(), profile]));

    const fullTeacherData = teachersAsUsers.map((user) => {
      const profile = profileMap.get(user._id.toString());
      return {
        ...user,
        _id: user._id,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        speciality: profile?.speciality,
        degree: profile?.degree,
        experience: profile?.experience,
        fees: profile?.hourlyRate,
      };
    });

    res.status(200).json({ success: true, teachers: fullTeacherData });
  } catch (error) {
    console.error("Error fetching all teachers for admin:", error);
    res.status(500).json({ success: false, message: "Error fetching teacher list for admin." });
  }
};

const getSingleTeacherForAdmin = async (req, res) => {
  try {
    const teacherUser = await User.findById(req.params.id).select("-password").lean();
    if (!teacherUser || teacherUser.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }

    const teacherProfile = await TeacherProfile.findOne({ userId: teacherUser._id }).lean();
    if (!teacherProfile) {
      // This case might happen if a user was created but profile creation failed.
      return res.status(404).json({ success: false, message: "Teacher profile data not found." });
    }

    // Combine both objects into a single response
    const fullTeacherDetails = {
      ...teacherUser,
      teacherProfile,
    };

    res.status(200).json({ success: true, teacher: fullTeacherDetails });
  } catch (error) {
    console.error("Error fetching single teacher for admin:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getPendingTeachers = async (req, res) => {
  try {
    const pendingTeachers = await User.find({ role: "teacher", isVerified: false }).select("-password").lean();
    res.status(200).json({ success: true, teachers: pendingTeachers });
  } catch (error) {
    console.error("Error fetching pending teachers:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const verifyTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found." });
    }
    if (teacher.isVerified) {
      return res.status(400).json({ success: false, message: "This teacher is already verified." });
    }

    teacher.isVerified = true;
    await teacher.save();
    await createNotification(teacher._id, "account_verified", "Congratulations! Your account has been verified and is now live.", "/teacher/dashboard/profile");

    res.status(200).json({ success: true, message: "Teacher has been successfully verified." });
  } catch (error) {
    console.error("Error verifying teacher:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const MIN_PAYOUT_THRESHOLD = 100000;

    const [pendingTeachersCount, activeTeachersCount, openDisputesCount, pendingPayoutsData, recentPendingTeachers, recentOpenDisputes] = await Promise.all([
      User.countDocuments({ role: "teacher", isVerified: false }),
      User.countDocuments({ role: "teacher", isVerified: true, isActive: true }),
      Dispute.countDocuments({ status: { $in: ["open", "under_review"] } }),
      TeacherProfile.aggregate([{ $match: { earnings: { $gte: MIN_PAYOUT_THRESHOLD } } }, { $group: { _id: null, total: { $sum: "$earnings" }, count: { $sum: 1 } } }]),
      User.find({ role: "teacher", isVerified: false }).sort({ createdAt: -1 }).limit(5).select("fullName email createdAt"),
      Dispute.find({ status: { $in: ["open", "under_review"] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("filedBy", "fullName"),
    ]);

    const summary = {
      pendingTeachersCount,
      activeTeachersCount,
      openDisputesCount,
      pendingPayoutsAmount: pendingPayoutsData[0]?.total || 0,
      pendingPayoutsCount: pendingPayoutsData[0]?.count || 0,
      recentPendingTeachers,
      recentOpenDisputes,
    };

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ success: false, message: "Server error fetching dashboard data." });
  }
};

export const getPendingPayouts = async (req, res) => {
  try {
    const MIN_PAYOUT_THRESHOLD = 100000;
    const teachersToPay = await TeacherProfile.find({
      earnings: { $gte: MIN_PAYOUT_THRESHOLD },
    }).populate("userId", "fullName email");

    res.status(200).json({ success: true, payouts: teachersToPay });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching payouts." });
  }
};

export const processPayouts = async (req, res) => {
  const { teacherProfileIds } = req.body;
  if (!teacherProfileIds || !Array.isArray(teacherProfileIds) || teacherProfileIds.length === 0) {
    return res.status(400).json({ success: false, message: "No teachers selected for payout." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const profileId of teacherProfileIds) {
      const profile = await TeacherProfile.findById(profileId).populate("userId", "fullName email").session(session);
      const amountToPay = profile.earnings;

      if (profile && amountToPay > 0) {
        await Payout.create(
          [
            {
              teacherProfileId: profile._id,
              userId: profile.userId,
              amount: amountToPay,
            },
          ],
          { session }
        );

        profile.earnings = 0;
        await profile.save({ session });

        await createNotification(profile.userId, "payout_processed", `Your recent earnings of ${amountToPay} have been processed and are on their way.`, "/teacher/dashboard/earnings");
        await sendEmail(profile.userId.email, "payout_processed", {
          teacherName: profile.userId.fullName,
          amount: amountToPay,
        });
      }
    }

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Payouts marked as processed successfully." });
  } catch (error) {
    await session.abortTransaction();
    console.error("Payout processing error:", error);
    res.status(500).json({ success: false, message: "Error processing payouts." });
  } finally {
    session.endSession();
  }
};

export { addTeacherByAdmin, loginAdmin, updateTeacherStatus, getAllTeachersForAdmin, getPendingTeachers, verifyTeacher, getSingleTeacherForAdmin };
