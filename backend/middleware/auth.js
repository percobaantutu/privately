import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import teacherModel from "../models/teacherModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Please login to access this resource" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token or token expired" });
  }
};

export const isTeacher = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Please login to access this resource" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await teacherModel.findById(decoded._id);

    if (!teacher) {
      return res.status(401).json({ message: "Teacher not found" });
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token or token expired" });
  }
}; 