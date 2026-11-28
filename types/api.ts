export type BackendUserRole = "super_admin" | "recruiter";
export type BackendUserStatus = "active" | "inactive";

export type ApiUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: BackendUserRole;
  status: BackendUserStatus;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  token: string;
  user: ApiUser;
};

export type ApiClient = {
  _id: string;
  companyName: string;
  industry?: string;
  website?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};

export type BackendJobStatus =
  | "draft"
  | "active"
  | "on_hold"
  | "closed"
  | "archived";

export type BackendWorkMode = "remote" | "hybrid" | "onsite";

export type BackendEngagementType =
  | "permanent"
  | "contract"
  | "contract_to_hire"
  | "other";

export type ApiJob = {
  _id: string;
  jobId: string;
  jobTitle: string;
  client: string | ApiClient;
  originalJDFile?: string;
  publicJD?: string;
  minExperience: number;
  maxExperience: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  responsibilities?: string;
  education?: string;
  location: string;
  workMode: BackendWorkMode;
  workTimings?: string;
  timeZone?: string;
  engagementType: BackendEngagementType;
  budget?: string;
  showBudgetPublicly: boolean;
  eligibility?: string;
  positions: number;
  deadline?: string;
  recruiterOwner?: string | ApiUser;
  status: BackendJobStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateJobPayload = {
  jobTitle: string;
  client: string;
  publicJD?: string;
  minExperience: number;
  maxExperience: number;
  mandatorySkills: string[];
  preferredSkills?: string[];
  responsibilities?: string;
  education?: string;
  location: string;
  workMode: BackendWorkMode;
  workTimings?: string;
  timeZone?: string;
  engagementType: BackendEngagementType;
  budget?: string;
  showBudgetPublicly?: boolean;
  eligibility?: string;
  positions: number;
  deadline?: string;
  recruiterOwner?: string;
};

export type BackendApplicationStatus =
  | "new_application"
  | "resume_under_review"
  | "shortlisted"
  | "technical_screening"
  | "interview_scheduled"
  | "selected"
  | "rejected"
  | "on_hold"
  | "submitted_to_client"
  | "client_approved"
  | "client_rejected"
  | "hired";

export type ApiCandidateRef = {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  location?: string;
  totalExperience?: number;
  primarySkills?: string[];
};

export type ApiApplication = {
  _id: string;
  applicationId: string;
  candidate: string | ApiCandidateRef;
  job: string | ApiJob;
  status: BackendApplicationStatus;
  atsScore?: number;
  resumeVersion?: string;
  jdVersion?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiApplicationNote = {
  _id: string;
  application: string;
  author?: string | ApiUser;
  note: string;
  createdAt: string;
};

export type ApiApplicationStatusHistory = {
  _id: string;
  application: string;
  previousStatus?: BackendApplicationStatus;
  newStatus: BackendApplicationStatus;
  changedBy?: string | ApiUser;
  remarks?: string;
  changedAt?: string;
  createdAt?: string;
};

export type ApiDashboardData = {
  activeJDs: number;
  newApplications: number;
  shortlisted: number;
  interviewScheduled: number;
  submittedToClient: number;
  selected: number;
  rejected: number;
  onHold: number;
  totalCandidates: number;
  applicationsByJD: Array<{
    jobId: string;
    jobTitle: string;
    applicationCount: number;
  }>;
};

export type DashboardFilters = {
  startDate?: string;
  endDate?: string;
  recruiterId?: string;
  clientId?: string;
  jobId?: string;
};
