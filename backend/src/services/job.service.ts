
import mongoose, { type FilterQuery } from "mongoose";
import Job, { type IJob } from "../models/Job";
import Client from "../models/Client";
import User, { type UserRole } from "../models/User";

export interface JobAccessContext {
  userId: string;
  role: UserRole;
}

const jobAccessFilter = (
  access: JobAccessContext,
  id?: string
): FilterQuery<IJob> => {
  const filter: FilterQuery<IJob> = {};

  if (id) {
    filter._id = id;
  }

  if (access.role !== "super_admin") {
    filter.recruiterOwner = access.userId;
  }

  return filter;
};

const validateJobId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid job ID");
  }
};

const validateJobData = (data: any, partial = false) => {
  const validatedData = { ...data };
  const requiredStringFields = [
    ["jobTitle", "Job title"],
    ["location", "Location"],
  ] as const;

  for (const [field, label] of requiredStringFields) {
    if (partial && data[field] === undefined) {
      continue;
    }

    if (typeof data[field] !== "string" || !data[field].trim()) {
      throw new Error(`${label} is required`);
    }

    validatedData[field] = data[field].trim();
  }

  for (const [field, label] of [
    ["minExperience", "Minimum experience"],
    ["maxExperience", "Maximum experience"],
  ] as const) {
    if (partial && data[field] === undefined) {
      continue;
    }

    if (
      typeof data[field] !== "number" ||
      !Number.isFinite(data[field]) ||
      data[field] < 0
    ) {
      throw new Error(`${label} must be a non-negative number`);
    }
  }

  if (!partial || data.positions !== undefined) {
    if (
      !Number.isInteger(data.positions) ||
      data.positions < 1
    ) {
      throw new Error("Positions must be a positive integer");
    }
  }

  if (!partial || data.mandatorySkills !== undefined) {
    if (
      !Array.isArray(data.mandatorySkills) ||
      data.mandatorySkills.length === 0 ||
      data.mandatorySkills.some(
        (skill: unknown) => typeof skill !== "string" || !skill.trim()
      )
    ) {
      throw new Error("At least one mandatory skill is required");
    }

    validatedData.mandatorySkills = data.mandatorySkills.map(
      (skill: string) => skill.trim()
    );
  }

  if (
    (!partial || data.workMode !== undefined) &&
    !["remote", "hybrid", "onsite"].includes(data.workMode)
  ) {
    throw new Error("Invalid work mode");
  }

  if (
    (!partial || data.engagementType !== undefined) &&
    !["permanent", "contract", "contract_to_hire", "other"].includes(
      data.engagementType
    )
  ) {
    throw new Error("Invalid engagement type");
  }

  if (data.budget !== undefined) {
    if (typeof data.budget !== "string") {
      throw new Error("Budget must be a string");
    }

    validatedData.budget = data.budget.trim();
  }

  return validatedData;
};

// Create Job
export const createJob = async (
  data: any,
  access: JobAccessContext
) => {
  const validatedData = validateJobData(data);

  if (access.role === "recruiter") {
    validatedData.recruiterOwner = access.userId;
  }

  if (!validatedData.client) {
    throw new Error("Client ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(validatedData.client)) {
    throw new Error("Invalid client ID");
  }

  // Check if client exists
  const clientExists = await Client.findById(validatedData.client);

  if (!clientExists) {
    throw new Error("Client not found");
  }

  // Generate Job ID
  const lastJob = await Job.findOne().sort({ createdAt: -1 });

  let nextNumber = 1001;

  if (lastJob?.jobId) {
    const lastNumber = parseInt(lastJob.jobId.split("-").pop() || "1000");
    nextNumber = lastNumber + 1;
  }

  const jobId = `ADP-JD-${nextNumber}`;

  // Check recruiter if assigned
  if (validatedData.recruiterOwner) {
    const recruiterExists = await User.findById(validatedData.recruiterOwner);

    if (!recruiterExists) {
      throw new Error("Recruiter not found");
    }
  }

  // Create Job
  const job = await Job.create({
    ...validatedData,
    jobId,
  });

  return job;
};

// Get All Jobs
export const getAllJobs = async (access: JobAccessContext) => {
  return await Job.find(jobAccessFilter(access))
    .populate("client", "companyName")
    .populate("recruiterOwner", "name email")
    .sort({ createdAt: -1 });
};

// Get Job By ID
export const getJobById = async (
  id: string,
  access: JobAccessContext
) => {
  validateJobId(id);

  const job = await Job.findOne(jobAccessFilter(access, id))
    .populate("client", "companyName")
    .populate("recruiterOwner", "name email");

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Update Job
export const updateJob = async (
  id: string,
  data: any,
  access: JobAccessContext
) => {
  validateJobId(id);
  const validatedData = validateJobData(data, true);

  if (access.role === "recruiter") {
    delete validatedData.recruiterOwner;
  }

  if (validatedData.client !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(validatedData.client)) {
      throw new Error("Invalid client ID");
    }

    const clientExists = await Client.findById(validatedData.client);
    if (!clientExists) {
      throw new Error("Client not found");
    }
  }

  const job = await Job.findOneAndUpdate(
    jobAccessFilter(access, id),
    validatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Update Job Status
export const updateJobStatus = async (
  id: string,
  status: string,
  access: JobAccessContext
) => {
  validateJobId(id);

  const job = await Job.findOneAndUpdate(
    jobAccessFilter(access, id),
    { status },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Publish / Unpublish Job
export const updateJobPublication = async (
  id: string,
  isPublished: boolean,
  access: JobAccessContext
) => {
  validateJobId(id);

  const job = await Job.findOneAndUpdate(
    jobAccessFilter(access, id),
    { isPublished },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Delete Job
export const deleteJob = async (
  id: string,
  access: JobAccessContext
) => {
  validateJobId(id);

  const job = await Job.findOneAndDelete(jobAccessFilter(access, id));

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};
