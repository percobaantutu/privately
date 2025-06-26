import User from "../models/userModel.js"; // Note the model name change if you aliased it
import TeacherProfile from "../models/teacherProfile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

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

    // ✅ THE FIX: Build the user data object BEFORE creating the model instance.
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role: userRole,
    };

    // --- Role-Specific Logic ---
    if (userRole === "teacher") {
      // Teacher-specific validation
      if (!speciality || !degree || !experience || !about || !fees || !address) {
        return res.status(400).json({ success: false, message: "All teacher profile fields are required for registration." });
      }
      // Add the isVerified property to our data object
      userData.isVerified = false;
    } else {
      // Add the isVerified property for students
      userData.isVerified = true;
    }

    // ✅ Now create the new user instance with the complete data object
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // If it was a teacher, create their profile now
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

    // Check if the teacher account is verified
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

    // Prepare user object for the response, excluding the password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ success: true, user: userResponse });
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
    const user = req.user;
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

// Update user profile (only name, phone, address, gender, dob, image)
export const updateUserProfile = async (req, res) => {
  try {
    // Assuming isAuthenticated middleware has already attached user to req.user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, phone, address, gender, dob, image } = req.body;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;
    if (image !== undefined) user.image = image; // Allow updating image URL directly

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dob: user.dob,
        image: user.image,
        role: user.role, // Include role in response
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload user profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    // Assuming isAuthenticated middleware has already attached user to req.user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const imageFile = req.file; // Assuming file is available on req.file via middleware

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      folder: "user_profiles", // Optional: organize uploads into a folder
      public_id: `user_${user._id}_${Date.now()}`, // Optional: give a unique public ID
    });
    const imageUrl = imageUpload.secure_url;

    // Update user's image URL in the database
    user.image = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      imageUrl: imageUrl, // Send the new image URL back to the frontend
      user: {
        // Optionally send updated user object
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role, // Include role in response
      },
    });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
