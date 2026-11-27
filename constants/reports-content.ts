import {
  applicationManagementRecords,
  jobManagementRecords,
} from "@/constants/admin-content";
import { atsReportRecords, type AtsMatchCategory } from "@/constants/ats-reports";

export type HiringReportRow = {
  id: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  client: string;
  department: string;
  recruiter: string;
  status: string;
  atsScore: number;
  matchCategory: AtsMatchCategory;
  applicationDate: string;
};

const currentApplications: HiringReportRow[] = applicationManagementRecords.map((application) => {
  const job = jobManagementRecords.find((record) => record.jobId === application.jobId);
  const atsReport = atsReportRecords.find((record) => record.id === application.id);
  if (!job || !atsReport) {
    throw new Error(`Missing sample reporting details for ${application.id}`);
  }

  return {
    id: application.id,
    candidateName: application.candidateName,
    jobId: application.jobId,
    jobTitle: application.jobTitle,
    client: job.clientName,
    department: job.category,
    recruiter: job.recruiterOwner,
    status: application.status,
    atsScore: Number.parseInt(application.atsScore, 10),
    matchCategory: atsReport.matchCategory,
    applicationDate: application.applicationDateIso,
  };
});

const historicalApplications: HiringReportRow[] = [
  {
    id: "REP-3108",
    candidateName: "Priya Nair",
    jobId: "ADP-JD-1040",
    jobTitle: "Talent Acquisition Specialist",
    client: "Meridian Systems",
    department: "People & Culture",
    recruiter: "Leah Morgan",
    status: "Hired / Joined",
    atsScore: 89,
    matchCategory: "Strong Match",
    applicationDate: "2026-11-08",
  },
  {
    id: "REP-3107",
    candidateName: "Dev Malhotra",
    jobId: "ADP-JD-1038",
    jobTitle: "Cloud Infrastructure Engineer",
    client: "Northstar Technologies",
    department: "Technology",
    recruiter: "Daniel Kim",
    status: "Hired / Joined",
    atsScore: 91,
    matchCategory: "Strong Match",
    applicationDate: "2026-10-16",
  },
  {
    id: "REP-3106",
    candidateName: "Ishita Sen",
    jobId: "ADP-JD-1041",
    jobTitle: "Product Designer",
    client: "BluePeak Labs",
    department: "Product",
    recruiter: "Daniel Kim",
    status: "Interview Scheduled",
    atsScore: 84,
    matchCategory: "Good Match",
    applicationDate: "2026-09-22",
  },
  {
    id: "REP-3105",
    candidateName: "Nikhil Verma",
    jobId: "ADP-JD-1042",
    jobTitle: "Senior Software Engineer",
    client: "Northstar Technologies",
    department: "Technology",
    recruiter: "Aisha Patel",
    status: "Rejected",
    atsScore: 64,
    matchCategory: "Moderate Match",
    applicationDate: "2026-08-18",
  },
  {
    id: "REP-3104",
    candidateName: "Meera Joshi",
    jobId: "ADP-JD-1037",
    jobTitle: "Finance Analyst",
    client: "Cedar Consulting",
    department: "Finance",
    recruiter: "Leah Morgan",
    status: "Shortlisted",
    atsScore: 79,
    matchCategory: "Good Match",
    applicationDate: "2026-07-14",
  },
  {
    id: "REP-3103",
    candidateName: "Rahul Desai",
    jobId: "ADP-JD-1039",
    jobTitle: "Business Development Manager",
    client: "Cedar Consulting",
    department: "Sales",
    recruiter: "Aisha Patel",
    status: "Hired / Joined",
    atsScore: 87,
    matchCategory: "Strong Match",
    applicationDate: "2026-06-09",
  },
];

export const hiringReportRecords: readonly HiringReportRow[] = [
  ...currentApplications,
  ...historicalApplications,
];
