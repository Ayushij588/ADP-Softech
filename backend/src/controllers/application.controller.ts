
import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";
import type { ApplicationStatus } from "../constants/applicationStatus";
import type { AuthRequest } from "../middleware/auth.middleware";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from "../services/application.service";
import { requestApplicationVerification } from "../services/applicationVerification.service";

const forwardApplicationError = (
  error: unknown,
  next: NextFunction,
  statusCode: number,
  knownMessages: Set<string>,
  statusOverrides?: ReadonlyMap<string, number>
): void => {
  if (error instanceof Error && knownMessages.has(error.message)) {
    next(
      Object.assign(new Error(error.message), {
        statusCode: statusOverrides?.get(error.message) ?? statusCode,
      })
    );
    return;
  }

  next(error);
};

type PublicApplicationBody = {
  candidateId?: unknown;
  jobId?: unknown;
  verificationCode?: unknown;
};

const createApplicationErrors = new Set([
  "Invalid application submission",
  "Invalid candidate ID",
  "Invalid job ID",
  "Job not found",
  "This job is not accepting applications",
  "Candidate has already applied for this job",
  "Unable to verify applicant email",
]);
const applicationQueryErrors = new Set([
  "Invalid application status",
  "Invalid job ID",
]);
const applicationLookupErrors = new Set([
  "Invalid application ID",
  "Application not found",
]);
const applicationStatusErrors = new Set([
  "Invalid application status",
  "Invalid application ID",
  "Application not found",
  "Application is already in this status",
]);

export const createApplicationController = async (
  req: Request<unknown, unknown, PublicApplicationBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body ?? {};
    const { candidateId, jobId, verificationCode } = body;

    if (
      typeof candidateId !== "string" ||
      typeof jobId !== "string" ||
      typeof verificationCode !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Candidate ID, job ID, and verification code are required",
      });
      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(candidateId) ||
      !mongoose.Types.ObjectId.isValid(jobId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid candidate or job ID",
      });
      return;
    }

    const application = await createApplication({
      candidateId,
      jobId,
      verificationCode,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error: unknown) {
    forwardApplicationError(
      error,
      next,
      400,
      createApplicationErrors,
      new Map([["Unable to verify applicant email", 401]])
    );
  }
};

export const requestApplicationVerificationController = async (
  req: Request<unknown, unknown, PublicApplicationBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body = req.body ?? {};
  const { candidateId, jobId } = body;

  if (typeof candidateId !== "string" || typeof jobId !== "string") {
    res.status(400).json({
      success: false,
      message: "Candidate ID and job ID are required",
    });
    return;
  }

  if (
    !mongoose.Types.ObjectId.isValid(candidateId) ||
    !mongoose.Types.ObjectId.isValid(jobId)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid candidate or job ID",
    });
    return;
  }

  try {
    await requestApplicationVerification(candidateId, jobId);

    res.status(202).json({
      success: true,
      message:
        "Request received. If eligible, a verification code may be sent to the candidate's email. This response does not confirm eligibility.",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllApplicationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, jobId, search } = req.query;

    const applications = await getAllApplications({
      status: status as string,
      jobId: jobId as string,
      search: search as string,
    });

    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      total: applications.length,
      applications,
    });
  } catch (error: unknown) {
    forwardApplicationError(error, next, 400, applicationQueryErrors);
  }
};

export const getApplicationByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
      return;
    }

    const application = await getApplicationById(id);

    res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      application,
    });
  } catch (error: unknown) {
    forwardApplicationError(error, next, 404, applicationLookupErrors);
  }
};

export const updateApplicationStatusController = async (
  req: AuthRequest &
    Request<
      { id: string },
      unknown,
      { status?: ApplicationStatus; remarks?: string }
    >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const changedBy = req.user?.userId;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Application status is required",
      });
      return;
    }

    if (!changedBy) {
      res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
      return;
    }

    const application = await updateApplicationStatus(
      id,
      status,
      changedBy,
      remarks
    );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error: unknown) {
    forwardApplicationError(error, next, 400, applicationStatusErrors);
  }
};
