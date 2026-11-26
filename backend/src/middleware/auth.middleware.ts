
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../models/User";

// Custom request type
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

// Authentication middleware
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded === "string" ||
      !decoded.userId ||
      !["super_admin", "recruiter"].includes(decoded.role)
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    // 4. Attach user details to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role as UserRole,
    };

    // 5. Allow request to continue
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
