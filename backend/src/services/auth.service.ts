
import bcrypt from "bcrypt";
import User, { type IUser } from "../models/User";
import {
  loginSchema,
  createRecruiterSchema,
  type LoginInput,
  type CreateRecruiterInput,
} from "../validators/auth.validator";
import { generateToken } from "../utils/token";

// Login service
export const loginUser = async (data: LoginInput) => {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Invalid email or password");
  }

  const { email, password } = validation.data;

  // 1. Find user by email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check user status
  if (user.status !== "active") {
    throw new Error("Your account is inactive or suspended");
  }

  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

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
  const validation = createRecruiterSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(
      validation.error.issues[0]?.message ?? "Invalid recruiter data"
    );
  }

  const { name, email, password } = validation.data;

  // 1. Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create recruiter
  let recruiter: IUser;
  try {
    recruiter = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "recruiter",
      status: "active",
      isEmailVerified: true,
    });
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
