import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { applicationQuerySchema } from "../validators/application.validator";

import {
  createApplicationController,
  getAllApplicationsController,
  getApplicationByIdController,
  requestApplicationVerificationController,
  updateApplicationStatusController,
} from "../controllers/application.controller";

const router = Router();

// Public route - Candidate can submit application
router.post("/verification", requestApplicationVerificationController);
router.post("/", createApplicationController);

// Protected route - Admin and Recruiter
router.get(
  "/",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  validateRequest({ query: applicationQuerySchema }),
  getAllApplicationsController
);

// Protected route - Admin and Recruiter
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  getApplicationByIdController
);

// Protected route - Admin and Recruiter
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  updateApplicationStatusController
);

export default router;