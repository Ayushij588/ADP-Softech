
import bcrypt from "bcrypt";
import User from "../models/User";
import {
  LoginInput,
  CreateRecruiterInput,
} from "../validators/auth.validator";
import { generateToken } from "../utils/token";

// Login service
export const loginUser = async (data: LoginInput) => {
  // 1. Find user by email
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check user status
  if (user.status !== "active") {
    throw new Error("Your account is inactive or suspended");
  }

  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // 4. Update last login
  user.lastLogin = new Date();
  await user.save();

  // 5. Generate JWT token
  const token = generateToken(user._id.toString(), user.role);

  // 6. Return user data and token
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
    },
  };
};

// Create Recruiter service
export const createRecruiter = async (data: CreateRecruiterInput) => {
  // 1. Check if email already exists
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3. Create recruiter
  const recruiter = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "recruiter",
    status: "active",
    isEmailVerified: true,
  });

  // 4. Return recruiter data
  return {
    id: recruiter._id,
    name: recruiter.name,
    email: recruiter.email,
    role: recruiter.role,
    status: recruiter.status,
    createdAt: recruiter.createdAt,
  };
};
