// backend/models/TeacherProfile.js

import mongoose from "mongoose";

const teacherProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    qualifications: [
      {
        type: String,
      },
    ],
    availability: {
      type: Object,
      default: {},
    },
    rating: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    // You can add these later for the vetting process
    // idDocument: { type: String },
    // bankDetails: {
    //   accountHolder: String,
    //   accountNumber: String,
    //   bankName: String,
    // },
  },
  {
    timestamps: true,
  }
);

const TeacherProfile = mongoose.models.TeacherProfile || mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
