
import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import User, { type UserRole } from "../models/User";

const isUserRole = (role: unknown): role is UserRole =>
  role === "super_admin" || role === "recruiter";

// Custom request type
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

// Authentication middleware
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Get token from request header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  const bearerTokenMatch =
    /^Bearer +([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i.exec(
      authHeader
    );

  if (!bearerTokenMatch) {
    res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
    return;
  }

  // 2. Verify token
  let decoded: string | jwt.JwtPayload;
  try {
    decoded = jwt.verify(bearerTokenMatch[1], env.JWT_SECRET);
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    !mongoose.Types.ObjectId.isValid(decoded.userId) ||
    !isUserRole(decoded.role)
  ) {
    res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
    return;
  }

  const user = await User.findById(decoded.userId).select("status");

  if (!user || user.status !== "active") {
    res.status(401).json({
      success: false,
      message: "User account is inactive or unavailable",
    });
    return;
  }

  // 4. Attach user details to request
  req.user = {
    userId: decoded.userId,
    role: decoded.role,
  };

  // 5. Allow request to continue
  next();
};
