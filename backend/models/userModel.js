// backend/models/userModel.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie", // A default image
    },
    phoneNumber: {
      type: String,
    },
    address: {
      line1: String,
      line2: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    isVerified: {
      // ✅ FIX: The `default` property has been removed.
      // The value will now be set exclusively by the controller.
      type: Boolean,
    },
    isActive: {
      // Can be used to suspend accounts
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Rename `name` to `fullName` for consistency with roadmap if you want. Here I'll use `fullName`
userSchema.virtual("name").get(function () {
  return this.fullName;
});
userSchema.virtual("name").set(function (v) {
  this.fullName = v;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
