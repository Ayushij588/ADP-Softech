import { Router } from "express";
import {
  createApplicationNoteController,
  getApplicationNotesController,
} from "../controllers/applicationNote.controller";

const router = Router();

// Add note to an application
router.post("/", createApplicationNoteController);

// Get all notes for a specific application
router.get("/:applicationId", getApplicationNotesController);

export default router;