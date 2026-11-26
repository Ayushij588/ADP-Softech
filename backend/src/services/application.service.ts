
import Application, { IApplication } from "../models/Application";
import Candidate from "../models/Candidate";
import Job from "../models/Job";
import { generateApplicationId } from "../utils/applicationId";

export interface CreateApplicationInput {
  candidateId: string;
  jobId: string;
}

export const createApplication = async (
  applicationData: CreateApplicationInput
): Promise<IApplication> => {
  // Check candidate
  const candidate = await Candidate.findById(applicationData.candidateId);

  if (!candidate) {
    throw new Error("Candidate not found");
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
  const application = await Application.create({
    applicationId,
    candidate: candidate._id,
    job: job._id,
  });

  return application;
};

export const getAllApplications = async (filters?: {
  status?: string;
  jobId?: string;
  search?: string;
}) => {
  const query: any = {};

  // Filter by application status
  if (filters?.status) {
    query.status = filters.status;
  }

  // Filter by job ID
  if (filters?.jobId) {
    query.job = filters.jobId;
  }

  // Search candidate by name or email
  if (filters?.search) {
    const candidates = await Candidate.find({
      $or: [
        { fullName: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
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

export const getApplicationById = async (id: string) => {
  const application = await Application.findById(id)
    .populate("candidate")
    .populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};

export const updateApplicationStatus = async (
  id: string,
  status: string
) => {
  const application = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
    .populate("candidate")
    .populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};