import { Router } from "express";
import { getStatusHistoryController } from "../controllers/applicationStatusHistory.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Get application status history - Admin and Recruiter only
router.get(
  "/:applicationId",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  getStatusHistoryController
);

export default router;