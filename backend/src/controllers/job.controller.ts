
import mongoose from "mongoose";
import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  updateJobPublication,
  deleteJob,
  type JobAccessContext,
} from "../services/job.service";
import {
  createJobSchema,
  publishJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from "../validators/job.validator";

const notFoundMessages = new Set([
  "Job not found",
  "Client not found",
  "Recruiter not found",
]);
const invalidInputMessages = new Set([
  "Job title is required",
  "Location is required",
  "Minimum experience must be a non-negative number",
  "Maximum experience must be a non-negative number",
  "Positions must be a positive integer",
  "At least one mandatory skill is required",
  "Invalid work mode",
  "Invalid engagement type",
  "Client ID is required",
  "Invalid client ID",
  "Invalid job ID",
]);

const forwardJobError = (next: NextFunction, error: unknown): void => {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error.name === "CastError" || error.name === "ValidationError")
  ) {
    next(error);
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    next(error);
    return;
  }

  const statusCode =
    error instanceof Error && notFoundMessages.has(error.message)
      ? 404
      : error instanceof Error && invalidInputMessages.has(error.message)
        ? 400
        : undefined;

  if (statusCode !== undefined && error instanceof Error) {
    next(Object.assign(new Error(error.message), { statusCode }));
    return;
  }

  next(error);
};

const validateJobId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid job ID",
    });
    return false;
  }

  return true;
};

const getJobAccessContext = (
  req: AuthRequest,
  res: Response
): JobAccessContext | undefined => {
  const user = req.user;

  if (!user || typeof user.userId !== "string" || !user.userId.trim()) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
    return undefined;
  }

  return {
    userId: user.userId,
    role: user.role,
  };
};

// Create Job
export const createJobController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const validation = createJobSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid job data",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(validation.data.client)) {
      res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
      return;
    }

    const job = await createJob(validation.data, access);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};

// Get All Jobs
export const getAllJobsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const jobs = await getAllJobs(access);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      total: jobs.length,
      jobs,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};

// Get Job By ID
export const getJobByIdController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const id = String(req.params.id);
    if (!validateJobId(id, res)) {
      return;
    }

    const job = await getJobById(id, access);

    res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      job,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};

// Update Job
export const updateJobController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const id = String(req.params.id);
    if (!validateJobId(id, res)) {
      return;
    }

    const validation = updateJobSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid job data",
      });
      return;
    }

    if (
      validation.data.client !== undefined &&
      !mongoose.Types.ObjectId.isValid(validation.data.client)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
      return;
    }

    const job = await updateJob(id, validation.data, access);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};

// Update Job Status
export const updateJobStatusController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const id = String(req.params.id);
    if (!validateJobId(id, res)) {
      return;
    }

    const validation = updateJobStatusSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid job status",
      });
      return;
    }

    const job = await updateJobStatus(id, validation.data.status, access);

    res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      job,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};

// Publish / Unpublish Job
export const updateJobPublicationController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const id = String(req.params.id);
    if (!validateJobId(id, res)) {
      return;
    }

    const validation = publishJobSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message:
          validation.error.issues[0]?.message ?? "Invalid publication status",
      });
      return;
    }

    const job = await updateJobPublication(
      id,
      validation.data.isPublished,
      access
    );

    res.status(200).json({
      success: true,
      message: `Job ${
        validation.data.isPublished ? "published" : "unpublished"
      } successfully`,
      job,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};

// Delete Job
export const deleteJobController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const access = getJobAccessContext(req, res);
  if (!access) {
    return;
  }

  try {
    const id = String(req.params.id);
    if (!validateJobId(id, res)) {
      return;
    }

    const job = await deleteJob(id, access);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      job,
    });
  } catch (error: unknown) {
    forwardJobError(next, error);
  }
};
