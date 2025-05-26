import teacherModel from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

// Register teacher
export const registerTeacher = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address
    } = req.body;

    // Check if teacher already exists
    const teacherExists = await teacherModel.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create teacher
    const teacher = await teacherModel.create({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      image: "https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie", // Default image
      date: Date.now(),
      available: true,
      slots_booked: {}
    });

    // Generate token
    const token = jwt.sign({ _id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        speciality: teacher.speciality,
        degree: teacher.degree,
        experience: teacher.experience,
        about: teacher.about,
        fees: teacher.fees,
        address: teacher.address,
        image: teacher.image,
        available: teacher.available
      },
    });
  } catch (error) {
    console.error("Teacher registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error in teacher registration",
    });
  }
};

// Login teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher exists
    const teacher = await teacherModel.findOne({ email });
    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign({ _id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        speciality: teacher.speciality,
        degree: teacher.degree,
        experience: teacher.experience,
        about: teacher.about,
        fees: teacher.fees,
        address: teacher.address,
        image: teacher.image,
        available: teacher.available
      },
    });
  } catch (error) {
    console.error("Teacher login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in teacher login",
    });
  }
};

// Get teacher profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await teacherModel.findById(req.teacher._id).select("-password");
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }
    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Get teacher profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting teacher profile",
    });
  }
};

// Update teacher profile
export const updateTeacherProfile = async (req, res) => {
  try {
    const teacher = req.teacher;
    const { 
      name, 
      speciality, 
      degree, 
      experience, 
      about, 
      fees, 
      address 
    } = req.body;

    if (name) teacher.name = name;
    if (speciality) teacher.speciality = speciality;
    if (degree) teacher.degree = degree;
    if (experience) teacher.experience = experience;
    if (about) teacher.about = about;
    if (fees) teacher.fees = fees;
    if (address) teacher.address = address;

    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        speciality: teacher.speciality,
        degree: teacher.degree,
        experience: teacher.experience,
        about: teacher.about,
        fees: teacher.fees,
        address: teacher.address,
        image: teacher.image,
        available: teacher.available
      },
    });
  } catch (error) {
    console.error("Update teacher profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating teacher profile",
    });
  }
};

// Update teacher availability
export const updateTeacherAvailability = async (req, res) => {
  try {
    const teacher = req.teacher;
    const { available } = req.body;

    teacher.available = available;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      available: teacher.available,
    });
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating availability",
    });
  }
};

// Get teacher sessions
export const getTeacherSessions = async (req, res) => {
  try {
    const teacher = req.teacher;
    // TODO: Implement session fetching logic
    // This will need to be implemented once we have the booking/session model
    res.status(200).json({
      success: true,
      message: "Sessions retrieved successfully",
      sessions: [] // This will be populated with actual sessions once implemented
    });
  } catch (error) {
    console.error("Get teacher sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting teacher sessions"
    });
  }
};

// Existing functions
const changeAvailability = async (req, res) => {
  try {
    const { teacherId } = req.body;

    const teacherData = await teacherModel.findById(teacherId);
    await teacherModel.findByIdAndUpdate(teacherId, {
      available: !teacherData.available,
    });
    res.status(200).json({ success: true, message: "Teacher availability changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const teacherList = async (req, res) => {
  try {
    const teachers = await teacherModel.find({}).select("-password -email");
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { changeAvailability, teacherList };
