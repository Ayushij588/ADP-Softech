import mongoose from "mongoose";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { getStatusHistory } from "../services/applicationStatusHistory.service";

// Get application status history
export const getStatusHistoryController = async (
  req: AuthRequest & Request<{ applicationId: string }>,
  res: Response
): Promise<void> => {
  try {
    const access = req.user;
    if (!access) {
      res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
      return;
    }

    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
      return;
    }

    const history = await getStatusHistory(applicationId, access);

    res.status(200).json({
      success: true,
      message: "Application status history fetched successfully",
      total: history.length,
      history,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch application status history";

    res.status(message === "Application not found" ? 404 : 500).json({
      success: false,
      message,
    });
  }
};