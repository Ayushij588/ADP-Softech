
import { Router } from "express";
import {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  updateJobStatusController,
  updateJobPublicationController,
  deleteJobController,
} from "../controllers/job.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Create Job
router.post(
  "/",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  createJobController
);

// Get All Jobs
router.get(
  "/",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  getAllJobsController
);

// Get Job By ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  getJobByIdController
);

// Update Job
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  updateJobController
);

// Update Job Status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  updateJobStatusController
);

// Publish / Unpublish Job
router.patch(
  "/:id/publication",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  updateJobPublicationController
);

// Delete Job
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  deleteJobController
);

export default router;
