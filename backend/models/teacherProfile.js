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
    lifetimeEarnings: {
      type: Number,
      default: 0,
    },
    // Sensitive data for admin verification and payout
    // NOTE: In a production environment, this data should be encrypted at rest.
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      bankName: String,
    },
    verificationDetails: {
      idType: String, // e.g., 'KTP', 'Passport'
      idNumber: String,
      // idDocumentUrl: String, // For future file uploads
    },
  },
  {
    timestamps: true,
  }
);

const TeacherProfile = mongoose.models.TeacherProfile || mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
