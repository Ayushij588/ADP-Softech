import { Router } from "express";
import { createCandidateController } from "../controllers/candidate.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { candidateSchema } from "../validators/candidate.validator";

const router = Router();

// Public candidate registration
router.post(
  "/",
  validateRequest({ body: candidateSchema }),
  createCandidateController
);

export default router;