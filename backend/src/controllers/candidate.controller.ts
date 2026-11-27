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
  } catch (error: unknown) {
    const isDuplicateCandidate =
      (error instanceof Error &&
        error.message ===
          "Candidate already exists with this email or mobile number") ||
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000);

    res.status(isDuplicateCandidate ? 409 : 500).json({
      success: false,
      message: isDuplicateCandidate
        ? "Candidate already exists with this email or mobile number"
        : "Failed to create candidate",
    });
  }
};