
import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { UserRole } from "../models/User";

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
      return;
    }

    // Check user role
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};
