
import { Router } from "express";
import {
  loginController,
  createRecruiterController,
} from "../controllers/auth.controller";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Login
router.post("/login", loginController);

// Authentication test
router.get("/me", authMiddleware, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful!",
    user: req.user,
  });
});

// Super Admin only test route
router.get(
  "/admin-test",
  authMiddleware,
  authorizeRoles("super_admin"),
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Super Admin access granted!",
      user: req.user,
    });
  }
);

// Create Recruiter (Super Admin only)
router.post(
  "/create-recruiter",
  authMiddleware,
  authorizeRoles("super_admin"),
  createRecruiterController
);

export default router;
