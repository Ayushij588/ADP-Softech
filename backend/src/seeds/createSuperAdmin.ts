
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import connectDB from "../config/database";

dotenv.config();

const createSuperAdmin = async (): Promise<void> => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error("Admin credentials are missing in .env");
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Super Admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "super_admin",
      status: "active",
      isEmailVerified: true,
    });

    console.log("Super Admin created successfully!");
    console.log("Email:", email);
  } catch (error) {
    console.error("Super Admin creation failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createSuperAdmin();
