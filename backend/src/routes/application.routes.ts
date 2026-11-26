
import { Router } from "express";
import {
  createApplicationController,
    getAllApplicationsController,
    getApplicationByIdController,
  updateApplicationStatusController,
} from "../controllers/application.controller";
const router = Router();

// Submit a new application (Public route)
router.post("/", createApplicationController);

// Get all applications
router.get("/", getAllApplicationsController);

// Get application by ID
router.get("/:id", getApplicationByIdController);

// update routes

router.patch("/:id/status", updateApplicationStatusController);
export default router;
