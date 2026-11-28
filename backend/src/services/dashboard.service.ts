import mongoose, {
  type FilterQuery,
  type PipelineStage,
  type Types,
} from "mongoose";
import Application, { type IApplication } from "../models/Application";
import Candidate from "../models/Candidate";
import Job, { type IJob } from "../models/Job";
import type { ApplicationAccessContext } from "./applicationAccess.service";
import { getAccessibleJobIds } from "./applicationAccess.service";
import type { DashboardFilters } from "../validators/dashboard.validator";

interface JobScopeAggregation {
  scopedJobs: Array<{ _id: Types.ObjectId }>;
  activeJDs: Array<{ count: number }>;
}

interface DashboardSummary {
  newApplications: number;
  shortlisted: number;
  interviewScheduled: number;
  submittedToClient: number;
  selected: number;
  rejected: number;
  onHold: number;
}

interface ApplicationsByJob {
  jobId: string;
  jobTitle: string;
  applicationCount: number;
}

interface ApplicationDashboardAggregation {
  summary: DashboardSummary[];
  candidateCount: Array<{ count: number }>;
  applicationsByJD: ApplicationsByJob[];
}

export interface DashboardData extends DashboardSummary {
  activeJDs: number;
  totalCandidates: number;
  applicationsByJD: ApplicationsByJob[];
}

const emptySummary: DashboardSummary = {
  newApplications: 0,
  shortlisted: 0,
  interviewScheduled: 0,
  submittedToClient: 0,
  selected: 0,
  rejected: 0,
  onHold: 0,
};

const getJobMatch = (
  accessibleJobIds: Types.ObjectId[] | null,
  filters: DashboardFilters
): FilterQuery<IJob> => {
  const conditions: FilterQuery<IJob>[] = [];

  if (accessibleJobIds !== null) {
    conditions.push({ _id: { $in: accessibleJobIds } });
  }
  if (filters.recruiterId) {
    conditions.push({
      recruiterOwner: new mongoose.Types.ObjectId(filters.recruiterId),
    });
  }
  if (filters.clientId) {
    conditions.push({ client: new mongoose.Types.ObjectId(filters.clientId) });
  }
  if (filters.jobId) {
    conditions.push({ _id: new mongoose.Types.ObjectId(filters.jobId) });
  }

  if (conditions.length === 0) {
    return {};
  }

  return conditions.length === 1 ? conditions[0] : { $and: conditions };
};

export const getDashboardData = async (
  filters: DashboardFilters,
  access: ApplicationAccessContext
): Promise<DashboardData> => {
  if (
    access.role === "recruiter" &&
    filters.recruiterId &&
    filters.recruiterId.toLowerCase() !== access.userId.toLowerCase()
  ) {
    throw Object.assign(
      new Error("You do not have permission to view this recruiter dashboard"),
      { statusCode: 403 }
    );
  }

  const accessibleJobIds = await getAccessibleJobIds(access);
  const jobMatch = getJobMatch(accessibleJobIds, filters);
  const jobPipeline: PipelineStage[] = [
    { $match: jobMatch },
    {
      $facet: {
        scopedJobs: [{ $project: { _id: 1 } }],
        activeJDs: [
          { $match: { status: "active" } },
          { $count: "count" },
        ],
      },
    },
  ];
  const [jobAggregation] =
    await Job.aggregate<JobScopeAggregation>(jobPipeline);
  const scopedJobIds = jobAggregation?.scopedJobs.map((job) => job._id) ?? [];

  const applicationMatch: FilterQuery<IApplication> = {
    job: { $in: scopedJobIds },
  };
  const appliedAt: { $gte?: Date; $lt?: Date } = {};
  if (filters.startDate) {
    appliedAt.$gte = new Date(`${filters.startDate}T00:00:00.000Z`);
  }
  if (filters.endDate) {
    appliedAt.$lt = new Date(
      new Date(`${filters.endDate}T00:00:00.000Z`).getTime() +
        24 * 60 * 60 * 1000
    );
  }
  if (Object.keys(appliedAt).length > 0) {
    applicationMatch.appliedAt = appliedAt;
  }

  const applicationPipeline: PipelineStage[] = [
    { $match: applicationMatch },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              newApplications: { $sum: 1 },
              shortlisted: {
                $sum: {
                  $cond: [{ $eq: ["$status", "shortlisted"] }, 1, 0],
                },
              },
              interviewScheduled: {
                $sum: {
                  $cond: [{ $eq: ["$status", "interview_scheduled"] }, 1, 0],
                },
              },
              submittedToClient: {
                $sum: {
                  $cond: [{ $eq: ["$status", "submitted_to_client"] }, 1, 0],
                },
              },
              selected: {
                $sum: {
                  $cond: [{ $eq: ["$status", "selected"] }, 1, 0],
                },
              },
              rejected: {
                $sum: {
                  $cond: [{ $eq: ["$status", "rejected"] }, 1, 0],
                },
              },
              onHold: {
                $sum: {
                  $cond: [{ $eq: ["$status", "on_hold"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              newApplications: 1,
              shortlisted: 1,
              interviewScheduled: 1,
              submittedToClient: 1,
              selected: 1,
              rejected: 1,
              onHold: 1,
            },
          },
        ],
        candidateCount: [
          { $group: { _id: "$candidate" } },
          {
            $lookup: {
              from: Candidate.collection.name,
              localField: "_id",
              foreignField: "_id",
              as: "candidate",
            },
          },
          { $unwind: "$candidate" },
          { $count: "count" },
        ],
        applicationsByJD: [
          { $group: { _id: "$job", applicationCount: { $sum: 1 } } },
          {
            $lookup: {
              from: Job.collection.name,
              localField: "_id",
              foreignField: "_id",
              as: "job",
            },
          },
          { $unwind: "$job" },
          {
            $project: {
              _id: 0,
              jobId: "$job.jobId",
              jobTitle: "$job.jobTitle",
              applicationCount: 1,
            },
          },
          { $sort: { jobId: 1 } },
        ],
      },
    },
  ];
  const [applicationAggregation] =
    await Application.aggregate<ApplicationDashboardAggregation>(
      applicationPipeline
    );
  const summary = applicationAggregation?.summary[0] ?? emptySummary;
  const isUnfilteredSuperAdmin =
    access.role === "super_admin" &&
    !filters.startDate &&
    !filters.endDate &&
    !filters.recruiterId &&
    !filters.clientId &&
    !filters.jobId;
  const allCandidateCounts = isUnfilteredSuperAdmin
    ? await Candidate.aggregate<{ count: number }>([{ $count: "count" }])
    : [];
  const totalCandidates = isUnfilteredSuperAdmin
    ? allCandidateCounts[0]?.count ?? 0
    : applicationAggregation?.candidateCount[0]?.count ?? 0;

  return {
    activeJDs: jobAggregation?.activeJDs[0]?.count ?? 0,
    ...summary,
    totalCandidates,
    applicationsByJD: applicationAggregation?.applicationsByJD ?? [],
  };
};
