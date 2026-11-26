import { Router } from "express";
import {
  getAllRecruitersController,
  getRecruiterByIdController,
  updateRecruiterController,
  updateRecruiterStatusController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Get all recruiters
router.get(
  "/recruiters",
  authMiddleware,
  authorizeRoles("super_admin"),
  getAllRecruitersController
);

// Get recruiter by ID
router.get(
  "/recruiters/:id",
  authMiddleware,
  authorizeRoles("super_admin"),
  getRecruiterByIdController
);

// Update recruiter details
router.patch(
  "/recruiters/:id",
  authMiddleware,
  authorizeRoles("super_admin"),
  updateRecruiterController
);

// Change recruiter status
router.patch(
  "/recruiters/:id/status",
  authMiddleware,
  authorizeRoles("super_admin"),
  updateRecruiterStatusController
);

export default router;