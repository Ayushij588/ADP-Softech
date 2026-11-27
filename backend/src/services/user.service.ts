import bcrypt from "bcrypt";
import User from "../models/User";
import {
  UpdateRecruiterInput,
  UpdateRecruiterStatusInput,
} from "../validators/auth.validator";
import mongoose from "mongoose";

// Get all recruiters
export const getAllRecruiters = async () => {
    const recruiters = await User.find({ role: "recruiter" })
        .select("-password")
        .sort({ createdAt: -1 });

    return recruiters;
};

// Get recruiter by ID
export const getRecruiterById = async (recruiterId: string) => {
  if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
    throw new Error("Invalid recruiter ID");
  }

  const recruiter = await User.findOne({
    _id: recruiterId,
    role: "recruiter",
  }).select("-password");

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  return recruiter;
};

// Update recruiter profile
export const updateRecruiter = async (
  recruiterId: string,
  data: UpdateRecruiterInput
) => {
  if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
    throw new Error("Invalid recruiter ID");
  }

  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();

  if (data.name !== undefined && !name) {
    throw new Error("Name is required");
  }

  if (data.email !== undefined && !email) {
    throw new Error("Email is required");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  const recruiter = await User.findOne({
    _id: recruiterId,
    role: "recruiter",
  });

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  if (email && email !== recruiter.email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: recruiterId },
    });

    if (existingUser) {
      throw new Error("Email is already registered");
    }
  }

  if (name !== undefined) {
    recruiter.name = name;
  }

  if (email !== undefined) {
    recruiter.email = email;
  }

  try {
    await recruiter.save();
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new Error("Email is already registered");
    }

    throw error;
  }

  return {
    id: recruiter._id,
    name: recruiter.name,
    email: recruiter.email,
    role: recruiter.role,
    status: recruiter.status,
    createdAt: recruiter.createdAt,
    updatedAt: recruiter.updatedAt,
  };
};

// Change recruiter account status
export const updateRecruiterStatus = async (
  recruiterId: string,
  data: UpdateRecruiterStatusInput
) => {
  if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
    throw new Error("Invalid recruiter ID");
  }

  const recruiter = await User.findOneAndUpdate(
    {
      _id: recruiterId,
      role: "recruiter",
    },
    { status: data.status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  return {
    id: recruiter._id,
    name: recruiter.name,
    email: recruiter.email,
    role: recruiter.role,
    status: recruiter.status,
    updatedAt: recruiter.updatedAt,
  };
};
// Reset recruiter password
export const resetRecruiterPassword = async (
  recruiterId: string,
  password: string
) => {
  if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
    throw new Error("Invalid recruiter ID");
  }

  const recruiter = await User.findOne({
    _id: recruiterId,
    role: "recruiter",
  });

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Save hashed password
  recruiter.password = hashedPassword;
  await recruiter.save();

  return {
    id: recruiter._id,
    name: recruiter.name,
    email: recruiter.email,
    role: recruiter.role,
    status: recruiter.status,
    message: "Recruiter password reset successfully",
  };
};