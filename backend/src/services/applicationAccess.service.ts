import type { ClientSession, FilterQuery } from "mongoose";
import type { Types } from "mongoose";
import type { IApplication } from "../models/Application";
import Job from "../models/Job";
import type { UserRole } from "../models/User";

export interface ApplicationAccessContext {
  userId: string;
  role: UserRole;
}

export const getAccessibleJobIds = async (
  access: ApplicationAccessContext,
  session?: ClientSession
): Promise<Types.ObjectId[] | null> => {
  if (access.role === "super_admin") {
    return null;
  }

  const jobsQuery = Job.find({ recruiterOwner: access.userId }).select("_id");
  if (session) {
    jobsQuery.session(session);
  }

  const jobs = await jobsQuery;
  return jobs.map((job) => job._id);
};

export const getApplicationAccessFilter = async (
  access: ApplicationAccessContext,
  session?: ClientSession
): Promise<FilterQuery<IApplication>> => {
  const jobIds = await getAccessibleJobIds(access, session);
  return jobIds === null ? {} : { job: { $in: jobIds } };
};
