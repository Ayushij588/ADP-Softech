import { Request, Response } from "express";
import { createCandidate } from "../services/candidate.service";

export const createCandidateController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const candidate = await createCandidate(req.body);

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