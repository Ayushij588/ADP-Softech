import { Router } from "express";
import { createCandidateController } from "../controllers/candidate.controller";

const router = Router();

// Public candidate registration
router.post("/", createCandidateController);

export default router;