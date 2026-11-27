import { Router } from "express";
import {
  getAllRecruitersController,
  getRecruiterByIdController,
  updateRecruiterController,
  updateRecruiterStatusController,
  resetRecruiterPasswordController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
  resetRecruiterPasswordSchema,
  updateRecruiterSchema,
  updateRecruiterStatusSchema,
} from "../validators/auth.validator";

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
  validateRequest({ body: updateRecruiterSchema }),
  updateRecruiterController
);

// Change recruiter status
router.patch(
  "/recruiters/:id/status",
  authMiddleware,
  authorizeRoles("super_admin"),
  validateRequest({ body: updateRecruiterStatusSchema }),
  updateRecruiterStatusController
);
// Reset recruiter password
router.patch(
  "/recruiters/:id/reset-password",
  authMiddleware,
  authorizeRoles("super_admin"),
  validateRequest({ body: resetRecruiterPasswordSchema }),
  resetRecruiterPasswordController
);

export default router;