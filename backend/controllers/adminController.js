import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { createNotification } from "./notificationController.js";

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
      isVerified: true, // Teachers added by admin are automatically verified
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

// Admin login remains the same.
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

// This function toggles the teacher's 'isActive' status.
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
    // Find all users with the role of 'teacher', regardless of their 'isActive' or 'isVerified' status.
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
        // Combine user and profile data
        ...user,
        // Ensure primary _id is from the user model
        _id: user._id,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        speciality: profile?.speciality,
        degree: profile?.degree,
        experience: profile?.experience,
        fees: profile?.hourlyRate,
        // Add any other fields the admin list might need
      };
    });

    res.status(200).json({ success: true, teachers: fullTeacherData });
  } catch (error) {
    console.error("Error fetching all teachers for admin:", error);
    res.status(500).json({ success: false, message: "Error fetching teacher list for admin." });
  }
};

const getPendingTeachers = async (req, res) => {
  try {
    // Find users who are teachers but are not yet verified
    const pendingTeachers = await User.find({ role: "teacher", isVerified: false }).select("-password").lean();
    res.status(200).json({ success: true, teachers: pendingTeachers });
  } catch (error) {
    console.error("Error fetching pending teachers:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// NEW FUNCTION 2: Verify a specific teacher
const verifyTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params; // Get the ID from the URL parameter

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

export { addTeacherByAdmin, loginAdmin, updateTeacherStatus, getAllTeachersForAdmin, getPendingTeachers, verifyTeacher };
