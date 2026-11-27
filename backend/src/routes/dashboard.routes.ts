import { Router } from "express";
import { getDashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { dashboardQuerySchema } from "../validators/dashboard.validator";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("super_admin", "recruiter"),
  validateRequest({ query: dashboardQuerySchema }),
  getDashboardController
);

export default router;
