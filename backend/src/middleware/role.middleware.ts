
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";
import type { UserRole } from "../models/User";

const isUserRole = (role: unknown): role is UserRole =>
  role === "super_admin" || role === "recruiter";

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // Check if user is authenticated
    if (
      !req.user ||
      typeof req.user.userId !== "string" ||
      !req.user.userId.trim()
    ) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
      return;
    }

    // Check user role
    if (
      !isUserRole(req.user.role) ||
      allowedRoles.length === 0 ||
      !allowedRoles.every(isUserRole) ||
      !allowedRoles.includes(req.user.role)
    ) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};
