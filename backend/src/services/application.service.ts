
import mongoose, { type FilterQuery } from "mongoose";
import Application, {
  type IApplication,
} from "../models/Application";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../constants/applicationStatus";
import Candidate from "../models/Candidate";
import PendingCandidate from "../models/PendingCandidate";
import Job from "../models/Job";
import { generateApplicationId } from "../utils/applicationId";
import { finalizeCandidateIntake } from "./candidate.service";
import { createStatusHistory } from "./applicationStatusHistory.service";
import { consumeApplicationVerification } from "./applicationVerification.service";
import {
  getApplicationAccessFilter,
  type ApplicationAccessContext,
} from "./applicationAccess.service";
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
  const existingCandidate = await Candidate.findById(applicationData.candidateId);
  const pendingCandidate = existingCandidate
    ? null
    : await PendingCandidate.findById(applicationData.candidateId);
  const applicant = pendingCandidate ?? existingCandidate;

  if (!applicant) {
    throw Object.assign(new Error("Unable to verify applicant email"), {
      statusCode: 401,
    });
  }

  if (
    pendingCandidate &&
    pendingCandidate.expiresAt.getTime() <= Date.now()
  ) {
    throw Object.assign(new Error("Unable to verify applicant email"), {
      statusCode: 401,
    });
  }

  if (applicant.consent !== true || !applicant.consentAt) {
    throw new Error("Consent is required");
  }

  if (!/^\d{6}$/.test(applicationData.verificationCode)) {
    throw Object.assign(new Error("Unable to verify applicant email"), {
      statusCode: 401,
    });
  }

  await consumeApplicationVerification(
    applicant._id.toString(),
    job._id.toString(),
    applicationData.verificationCode
  );

  const candidate = pendingCandidate
    ? await finalizeCandidateIntake(pendingCandidate)
    : existingCandidate;

  if (!candidate) {
    throw Object.assign(new Error("Unable to verify applicant email"), {
      statusCode: 401,
    });
  }

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

export const getAllApplications = async (
  filters: {
    status?: string;
    jobId?: string;
    search?: string;
  },
  access: ApplicationAccessContext
) => {
  const conditions: FilterQuery<IApplication>[] = [];

  // Filter by application status
  if (filters?.status !== undefined) {
    if (!APPLICATION_STATUSES.some((status) => status === filters.status)) {
      throw new Error("Invalid application status");
    }

    conditions.push({ status: filters.status });
  }

  // Filter by job ID
  if (filters?.jobId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(filters.jobId)) {
      throw new Error("Invalid job ID");
    }

    conditions.push({ job: filters.jobId });
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

    conditions.push({ candidate: { $in: candidateIds } });
  }

  const accessFilter = await getApplicationAccessFilter(access);
  if (Object.keys(accessFilter).length > 0) {
    conditions.push(accessFilter);
  }

  const query: FilterQuery<IApplication> =
    conditions.length === 0
      ? {}
      : conditions.length === 1
        ? conditions[0]
        : { $and: conditions };

  const applications = await Application.find(query)
    .populate("candidate")
    .populate("job")
    .sort({ createdAt: -1 });

  return applications;
};

export const getApplicationById = async (
  applicationId: string,
  access: ApplicationAccessContext
) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const accessFilter = await getApplicationAccessFilter(access);
  const application = await Application.findOne({
    _id: applicationId,
    ...accessFilter,
  })
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
  access: ApplicationAccessContext,
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
      const accessFilter = await getApplicationAccessFilter(access, session);
      const scopedFilter = { _id: applicationId, ...accessFilter };
      const existingApplication = await Application.findOne(scopedFilter)
        .session(session);

      if (!existingApplication) {
        throw new Error("Application not found");
      }

      const previousStatus = existingApplication.status;

      if (previousStatus === status) {
        throw new Error("Application is already in this status");
      }

      updatedApplication = await Application.findOneAndUpdate(
        scopedFilter,
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
