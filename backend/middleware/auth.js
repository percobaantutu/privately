// backend/middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Use the unified User model

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// New middleware to check for specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// You can deprecate `isTeacher` and use `authorizeRoles('teacher')` instead for more flexibility.
// For example: router.get("/profile", isAuthenticated, authorizeRoles('teacher'), getTeacherProfile);
