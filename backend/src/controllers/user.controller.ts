
import mongoose from "mongoose";
import type { Request, Response } from "express";
import {
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  updateRecruiterStatus,
  resetRecruiterPassword,
} from "../services/user.service";
import {
  updateRecruiterSchema,
  updateRecruiterStatusSchema,
  resetRecruiterPasswordSchema,
} from "../validators/auth.validator";

const validateRecruiterId = (recruiterId: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
    res.status(400).json({
      success: false,
      message: "Invalid recruiter ID",
    });
    return false;
  }

  return true;
};

// Get all recruiters controller
export const getAllRecruitersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recruiters = await getAllRecruiters();

    res.status(200).json({
      success: true,
      message: "Recruiters fetched successfully",
      data: recruiters,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(500).json({
      success: false,
      message,
    });
  }
};
// Get recruiter by ID controller
export const getRecruiterByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recruiterId = String(req.params.id);
    if (!validateRecruiterId(recruiterId, res)) {
      return;
    }

    const recruiter = await getRecruiterById(recruiterId);

    res.status(200).json({
      success: true,
      message: "Recruiter fetched successfully",
      data: recruiter,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    const statusCode =
      message === "Invalid recruiter ID"
        ? 400
        : message === "Recruiter not found"
          ? 404
          : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Update recruiter details controller
export const updateRecruiterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = updateRecruiterSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const recruiterId = String(req.params.id);
    if (!validateRecruiterId(recruiterId, res)) {
      return;
    }

    const recruiter = await updateRecruiter(recruiterId, validation.data);

    res.status(200).json({
      success: true,
      message: "Recruiter updated successfully",
      data: recruiter,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    let statusCode = 500;

    if (message === "Invalid recruiter ID") {
      statusCode = 400;
    } else if (message === "Recruiter not found") {
      statusCode = 404;
    } else if (
      message === "Email is already registered" ||
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000)
    ) {
      statusCode = 409;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Change recruiter status controller
export const updateRecruiterStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = updateRecruiterStatusSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const recruiterId = String(req.params.id);
    if (!validateRecruiterId(recruiterId, res)) {
      return;
    }

    const recruiter = await updateRecruiterStatus(
      recruiterId,
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Recruiter status updated successfully",
      data: recruiter,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    let statusCode = 500;

    if (message === "Invalid recruiter ID") {
      statusCode = 400;
    } else if (message === "Recruiter not found") {
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
// Reset recruiter password controller
export const resetRecruiterPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = resetRecruiterPasswordSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const recruiterId = String(req.params.id);
    if (!validateRecruiterId(recruiterId, res)) {
      return;
    }

    const recruiter = await resetRecruiterPassword(
      recruiterId,
      validation.data.password
    );

    res.status(200).json({
      success: true,
      message: "Recruiter password reset successfully",
      data: recruiter,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    let statusCode = 500;

    if (message === "Invalid recruiter ID") {
      statusCode = 400;
    } else if (message === "Recruiter not found") {
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};