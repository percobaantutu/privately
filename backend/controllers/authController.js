import { v2 as cloudinary } from "cloudinary"; // <--- THIS IS THE FIX
import User from "../models/userModel.js";
import TeacherProfile from "../models/teacherProfile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendEmail } from "../utils/email.js"; // IMPORT THE EMAIL UTILITY

// Register a new user (student or teacher)
export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      // Teacher-specific data
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    // --- Validation ---
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const userRole = role || "student";

    // --- Hash Password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role: userRole,
    };

    // --- Role-Specific Logic ---
    if (userRole === "teacher") {
      if (!speciality || !degree || !experience || !about || !fees || !address) {
        return res.status(400).json({ success: false, message: "All teacher profile fields are required for registration." });
      }
      userData.isVerified = false;
    } else {
      userData.isVerified = true;
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (userRole === "teacher") {
      await TeacherProfile.create({
        userId: savedUser._id,
        speciality,
        degree,
        experience,
        about,
        hourlyRate: fees,
        address,
      });
    }

    // --- ADDED: Send welcome email ---
    await sendEmail(savedUser.email, "welcome", { name: savedUser.fullName });
    // ------------------------------------

    res.status(201).json({
      success: true,
      message: `Registration successful! ${userRole === "teacher" ? "Your account is now pending admin verification." : "Please log in."}`,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

// Login any user (student, teacher, admin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid credentials." });
    }

    if (user.role === "teacher" && !user.isVerified) {
      return res.status(403).json({ success: false, message: "Your teacher account has not been verified yet." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    let userObject = user.toObject(); // Convert to a plain JS object to modify it

    if (userObject.role === "teacher") {
      const teacherProfile = await TeacherProfile.findOne({ userId: userObject._id }).lean();
      if (teacherProfile) {
        userObject.teacherProfile = teacherProfile; // Attach the teacher profile
      }
    }
    // -------------------------

    res.status(200).json({ success: true, user: userObject }); // Send the complete user object
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// Logout user
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Get current user
export const getMe = async (req, res) => {
  try {
    let user = req.user.toObject();

    if (user.role === "teacher") {
      const teacherProfile = await TeacherProfile.findOne({ userId: user._id }).lean();
      if (teacherProfile) {
        user.teacherProfile = teacherProfile;
      }
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user data",
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, phone, address, gender, dob, image } = req.body;

    // FIX: The User model uses 'fullName', not 'name'. This ensures the name updates correctly.
    if (name !== undefined) user.fullName = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;

    // FIX: The User model uses 'profilePicture', not 'image'.
    if (image !== undefined) user.profilePicture = image;

    await user.save();

    // To ensure consistency, we'll manually build the response object
    // to match the structure used elsewhere.
    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      profilePicture: user.profilePicture, // FIX: Return the correct property name
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload user profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      folder: "user_profiles",
      public_id: `user_${user._id}_${Date.now()}`,
    });

    user.profilePicture = imageUpload.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      imageUrl: user.profilePicture,
    });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    res.status(500).json({ success: false, message: "Error uploading profile picture." });
  }
};
