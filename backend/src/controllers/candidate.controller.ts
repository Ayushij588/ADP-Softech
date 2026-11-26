import { Request, Response } from "express";
import { createCandidate } from "../services/candidate.service";
import { candidateSchema } from "../validators/candidate.validator";

export const createCandidateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = candidateSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const candidate = await createCandidate(validation.data);

    res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create candidate",
    });
  }
};