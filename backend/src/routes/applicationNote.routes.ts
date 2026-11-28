import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

import {
  createApplicationNoteController,
  getApplicationNotesController,
} from "../controllers/applicationNote.controller";

const router = Router();

// Add note - Admin and Recruiter only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  createApplicationNoteController
);

// Get application notes - Admin and Recruiter only
router.get(
  "/:applicationId",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  getApplicationNotesController
);

export default router;