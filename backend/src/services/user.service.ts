
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

  const recruiter = await User.findOne({
    _id: recruiterId,
    role: "recruiter",
  });

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email,
      _id: { $ne: recruiterId },
    });

    if (existingUser) {
      throw new Error("Email is already registered");
    }
  }

  if (data.name !== undefined) {
    recruiter.name = data.name;
  }

  if (data.email !== undefined) {
    recruiter.email = data.email;
  }

  await recruiter.save();

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