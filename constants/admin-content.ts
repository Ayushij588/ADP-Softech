export type AdminManagementRecord = {
  id: string;
  title: string;
  detail: string;
  category: string;
  location: string;
  status: string;
  date: string;
  metric: string;
  score: string;
};

export type AdminRecordColumn = {
  key: keyof AdminManagementRecord;
  header: string;
  kind?: "status";
};

export const jobManagementRecords: readonly AdminManagementRecord[] = [
  {
    id: "JOB-1042",
    title: "Senior Software Engineer",
    detail: "Permanent",
    category: "Technology",
    location: "Bengaluru",
    status: "Published",
    date: "25 Nov 2026",
    metric: "18 applicants",
    score: "—",
  },
  {
    id: "JOB-1041",
    title: "Product Designer",
    detail: "Permanent",
    category: "Product",
    location: "Mumbai",
    status: "Published",
    date: "24 Nov 2026",
    metric: "12 applicants",
    score: "—",
  },
  {
    id: "JOB-1040",
    title: "Talent Acquisition Specialist",
    detail: "Contract",
    category: "People & Culture",
    location: "Mumbai",
    status: "Published",
    date: "22 Nov 2026",
    metric: "9 applicants",
    score: "—",
  },
  {
    id: "JOB-1039",
    title: "Business Development Manager",
    detail: "Permanent",
    category: "Sales",
    location: "Pune",
    status: "Draft",
    date: "21 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "JOB-1038",
    title: "Cloud Infrastructure Engineer",
    detail: "Contract",
    category: "Technology",
    location: "Hyderabad",
    status: "On hold",
    date: "19 Nov 2026",
    metric: "26 applicants",
    score: "—",
  },
  {
    id: "JOB-1037",
    title: "Finance Analyst",
    detail: "Permanent",
    category: "Finance",
    location: "Bengaluru",
    status: "Closed",
    date: "16 Nov 2026",
    metric: "31 applicants",
    score: "—",
  },
];

export const jobManagementColumns: readonly AdminRecordColumn[] = [
  { key: "id", header: "Job ID" },
  { key: "title", header: "Job title" },
  { key: "category", header: "Department" },
  { key: "location", header: "Location" },
  { key: "detail", header: "Type" },
  { key: "status", header: "Status", kind: "status" },
  { key: "metric", header: "Applications" },
];

export type ApplicationManagementRecord = {
  id: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  status: string;
  atsScore: string;
  submissionDate: string;
};

export const applicationManagementRecords: readonly ApplicationManagementRecord[] =
  [
    {
      id: "APP-2088",
      candidateName: "Aarav Mehta",
      jobId: "JOB-1042",
      jobTitle: "Senior Software Engineer",
      status: "Shortlisted",
      atsScore: "94%",
      submissionDate: "25 Nov 2026",
    },
    {
      id: "APP-2087",
      candidateName: "Mira Shah",
      jobId: "JOB-1041",
      jobTitle: "Product Designer",
      status: "Interview scheduled",
      atsScore: "88%",
      submissionDate: "25 Nov 2026",
    },
    {
      id: "APP-2086",
      candidateName: "Rohan Iyer",
      jobId: "JOB-1042",
      jobTitle: "Senior Software Engineer",
      status: "In review",
      atsScore: "81%",
      submissionDate: "24 Nov 2026",
    },
    {
      id: "APP-2085",
      candidateName: "Ananya Rao",
      jobId: "JOB-1040",
      jobTitle: "Talent Acquisition Specialist",
      status: "New",
      atsScore: "76%",
      submissionDate: "24 Nov 2026",
    },
    {
      id: "APP-2084",
      candidateName: "Kabir Nair",
      jobId: "JOB-1039",
      jobTitle: "Business Development Manager",
      status: "In review",
      atsScore: "72%",
      submissionDate: "23 Nov 2026",
    },
    {
      id: "APP-2083",
      candidateName: "Diya Kapoor",
      jobId: "JOB-1041",
      jobTitle: "Product Designer",
      status: "Rejected",
      atsScore: "48%",
      submissionDate: "22 Nov 2026",
    },
  ];

export const candidateManagementRecords: readonly AdminManagementRecord[] = [
  {
    id: "CAN-5012",
    title: "Aarav Mehta",
    detail: "aarav.mehta@example.com",
    category: "React, TypeScript, Node.js",
    location: "Bengaluru",
    status: "Shortlisted",
    date: "Updated today",
    metric: "7 years",
    score: "—",
  },
  {
    id: "CAN-5011",
    title: "Mira Shah",
    detail: "mira.shah@example.com",
    category: "Product design, Figma, UX",
    location: "Mumbai",
    status: "Interview scheduled",
    date: "Updated today",
    metric: "5 years",
    score: "—",
  },
  {
    id: "CAN-5010",
    title: "Rohan Iyer",
    detail: "rohan.iyer@example.com",
    category: "Cloud, AWS, Kubernetes",
    location: "Chennai",
    status: "Available",
    date: "Updated yesterday",
    metric: "9 years",
    score: "—",
  },
  {
    id: "CAN-5009",
    title: "Ananya Rao",
    detail: "ananya.rao@example.com",
    category: "Recruitment, sourcing, HR",
    location: "Mumbai",
    status: "In review",
    date: "Updated 2 days ago",
    metric: "6 years",
    score: "—",
  },
  {
    id: "CAN-5008",
    title: "Kabir Nair",
    detail: "kabir.nair@example.com",
    category: "Sales, partnerships, SaaS",
    location: "Pune",
    status: "Available",
    date: "Updated 3 days ago",
    metric: "8 years",
    score: "—",
  },
];

export const candidateManagementColumns: readonly AdminRecordColumn[] = [
  { key: "id", header: "Candidate ID" },
  { key: "title", header: "Candidate" },
  { key: "detail", header: "Email" },
  { key: "category", header: "Primary skills" },
  { key: "location", header: "Location" },
  { key: "metric", header: "Experience" },
  { key: "status", header: "Status", kind: "status" },
];

export const resumeManagementRecords: readonly AdminManagementRecord[] = [
  {
    id: "RES-7018",
    title: "Aarav Mehta",
    detail: "aarav-mehta-resume.pdf",
    category: "Senior Software Engineer",
    location: "Bengaluru",
    status: "Shortlisted",
    date: "25 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7017",
    title: "Mira Shah",
    detail: "mira-shah-profile.docx",
    category: "Product Designer",
    location: "Mumbai",
    status: "Reviewed",
    date: "25 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7016",
    title: "Rohan Iyer",
    detail: "rohan-iyer-resume.pdf",
    category: "Senior Software Engineer",
    location: "Chennai",
    status: "Needs review",
    date: "24 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7015",
    title: "Ananya Rao",
    detail: "ananya-rao-cv.pdf",
    category: "Talent Acquisition Specialist",
    location: "Mumbai",
    status: "Needs review",
    date: "24 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7014",
    title: "Kabir Nair",
    detail: "kabir-nair-resume.docx",
    category: "Business Development Manager",
    location: "Pune",
    status: "Reviewed",
    date: "23 Nov 2026",
    metric: "—",
    score: "—",
  },
];

export const resumeManagementColumns: readonly AdminRecordColumn[] = [
  { key: "id", header: "Resume ID" },
  { key: "title", header: "Candidate" },
  { key: "detail", header: "File" },
  { key: "category", header: "Related role" },
  { key: "date", header: "Received" },
  { key: "status", header: "Review status", kind: "status" },
];

export const atsMatchDistribution = [
  { label: "Strong match · 85–100%", percentage: 22, color: "bg-emerald-500" },
  { label: "Good match · 70–84%", percentage: 34, color: "bg-blue-600" },
  { label: "Potential match · 50–69%", percentage: 29, color: "bg-amber-500" },
  { label: "Below 50%", percentage: 15, color: "bg-slate-400" },
] as const;

export const departmentReportRows = [
  {
    department: "Technology",
    openRoles: 14,
    applicationsReviewed: 72,
    shortlisted: 21,
    hires: 8,
  },
  {
    department: "Product",
    openRoles: 8,
    applicationsReviewed: 48,
    shortlisted: 16,
    hires: 5,
  },
  {
    department: "People & Culture",
    openRoles: 5,
    applicationsReviewed: 36,
    shortlisted: 12,
    hires: 4,
  },
  {
    department: "Sales",
    openRoles: 6,
    applicationsReviewed: 41,
    shortlisted: 11,
    hires: 3,
  },
] as const;

