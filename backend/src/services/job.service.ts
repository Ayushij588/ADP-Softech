
import Job from "../models/Job";
import Client from "../models/Client";
import User from "../models/User";

// Create Job
export const createJob = async (data: any) => {
  // Check if client exists
  const clientExists = await Client.findById(data.client);

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
  if (data.recruiterOwner) {
    const recruiterExists = await User.findById(data.recruiterOwner);

    if (!recruiterExists) {
      throw new Error("Recruiter not found");
    }
  }

  // Create Job
  const job = await Job.create({
    ...data,
    jobId,
  });

  return job;
};

// Get All Jobs
export const getAllJobs = async () => {
  return await Job.find()
    .populate("client", "companyName")
    .populate("recruiterOwner", "name email")
    .sort({ createdAt: -1 });
};

// Get Job By ID
export const getJobById = async (id: string) => {
  const job = await Job.findById(id)
    .populate("client", "companyName")
    .populate("recruiterOwner", "name email");

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Update Job
export const updateJob = async (id: string, data: any) => {
  const job = await Job.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Update Job Status
export const updateJobStatus = async (id: string, status: string) => {
  const job = await Job.findByIdAndUpdate(
    id,
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
  isPublished: boolean
) => {
  const job = await Job.findByIdAndUpdate(
    id,
    { isPublished },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};

// Delete Job
export const deleteJob = async (id: string) => {
  const job = await Job.findByIdAndDelete(id);

  if (!job) {
    throw new Error("Job not found");
  }

  return job;
};
