
import mongoose from "mongoose";
import Application, {
  type IApplication,
} from "../models/Application";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../constants/applicationStatus";
import Candidate from "../models/Candidate";
import Job from "../models/Job";
import { generateApplicationId } from "../utils/applicationId";
import { createStatusHistory } from "./applicationStatusHistory.service";
import { consumeApplicationVerification } from "./applicationVerification.service";
export interface CreateApplicationInput {
  candidateId: string;
  jobId: string;
  verificationCode: string;
}

export const createApplication = async (
  applicationData: CreateApplicationInput
): Promise<IApplication> => {
  if (
    !applicationData ||
    typeof applicationData.candidateId !== "string" ||
    typeof applicationData.jobId !== "string" ||
    typeof applicationData.verificationCode !== "string"
  ) {
    throw new Error("Invalid application submission");
  }

  if (!mongoose.Types.ObjectId.isValid(applicationData.candidateId)) {
    throw new Error("Invalid candidate ID");
  }

  if (!mongoose.Types.ObjectId.isValid(applicationData.jobId)) {
    throw new Error("Invalid job ID");
  }

  // Check job
  const job = await Job.findById(applicationData.jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  // Check whether job is active and public
  if (job.status !== "active" || !job.isPublished) {
    throw new Error("This job is not accepting applications");
  }

  // Check candidate only after job validation to avoid exposing candidate existence.
  const candidate = await Candidate.findById(applicationData.candidateId);

  if (!candidate) {
    throw Object.assign(new Error("Unable to verify applicant email"), {
      statusCode: 401,
    });
  }

  if (!/^\d{6}$/.test(applicationData.verificationCode)) {
    throw Object.assign(new Error("Unable to verify applicant email"), {
      statusCode: 401,
    });
  }

  await consumeApplicationVerification(
    candidate._id.toString(),
    job._id.toString(),
    applicationData.verificationCode
  );

  // Check duplicate application
  const existingApplication = await Application.findOne({
    candidate: candidate._id,
    job: job._id,
  });

  if (existingApplication) {
    throw new Error("Candidate has already applied for this job");
  }

  // Generate unique application ID
  const applicationId = await generateApplicationId();

  // Create application
  let application: IApplication;
  try {
    application = await Application.create({
      applicationId,
      candidate: candidate._id,
      job: job._id,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new Error("Candidate has already applied for this job");
    }

    throw error;
  }

  return application;
};

export const getAllApplications = async (filters?: {
  status?: string;
  jobId?: string;
  search?: string;
}) => {
  const query: any = {};

  // Filter by application status
  if (filters?.status !== undefined) {
    if (!APPLICATION_STATUSES.some((status) => status === filters.status)) {
      throw new Error("Invalid application status");
    }

    query.status = filters.status;
  }

  // Filter by job ID
  if (filters?.jobId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(filters.jobId)) {
      throw new Error("Invalid job ID");
    }

    query.job = filters.jobId;
  }

  // Search candidate by name or email
  if (filters?.search) {
    const search = filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const candidates = await Candidate.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const candidateIds = candidates.map((candidate) => candidate._id);

    query.candidate = { $in: candidateIds };
  }

  const applications = await Application.find(query)
    .populate("candidate")
    .populate("job")
    .sort({ createdAt: -1 });

  return applications;
};

export const getApplicationById = async (applicationId: string) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const application = await Application.findById(applicationId)
    .populate("candidate")
    .populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  changedBy: string,
  remarks?: string
) => {
  if (
    !APPLICATION_STATUSES.some(
      (applicationStatus) => applicationStatus === status
    )
  ) {
    throw new Error("Invalid application status");
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const session = await mongoose.startSession();

  try {
    let updatedApplication: IApplication | null = null;

    await session.withTransaction(async () => {
      const existingApplication = await Application.findById(applicationId)
        .session(session);

      if (!existingApplication) {
        throw new Error("Application not found");
      }

      const previousStatus = existingApplication.status;

      if (previousStatus === status) {
        throw new Error("Application is already in this status");
      }

      updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true, runValidators: true, session }
      )
        .populate("candidate")
        .populate("job")
        .session(session);

      if (!updatedApplication) {
        throw new Error("Application not found");
      }

      await createStatusHistory(
        applicationId,
        previousStatus,
        status,
        changedBy,
        remarks,
        session
      );
    });

    if (!updatedApplication) {
      throw new Error("Application not found");
    }

    return updatedApplication;
  } finally {
    await session.endSession();
  }
};
