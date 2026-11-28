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

export type JobVersionRecord = {
  version: string;
  updatedAt: string;
  updatedBy: string;
  summary: string;
};

export type JobManagementRecord = AdminManagementRecord & {
  jobId: string;
  clientName: string;
  originalJdFile: string;
  publicDescription: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  workTimings: string;
  experienceRequired: string;
  mandatorySkills: string[];
  preferredSkills: string[];
  responsibilities: string;
  education: string;
  certifications: string[];
  eligibility: string;
  numberOfPositions: number;
  budget: string;
  deadline: string;
  recruiterOwner: string;
  publication: "Published" | "Unpublished";
  currentVersion: string;
  versions: JobVersionRecord[];
};

export const jobManagementRecords: readonly JobManagementRecord[] = [
  {
    id: "JOB-1042",
    jobId: "ADP-JD-1042",
    title: "Senior Software Engineer",
    clientName: "Northstar Technologies",
    originalJdFile: "Northstar-Senior-Software-Engineer-Confidential-v3.pdf",
    publicDescription:
      "Join a product engineering team building scalable web applications using React, TypeScript, and Node.js in a collaborative hybrid model.",
    detail: "Permanent",
    category: "Technology",
    location: "Bengaluru",
    workMode: "Hybrid",
    workTimings: "10:00 AM – 7:00 PM IST (2h UK overlap)",
    experienceRequired: "5-8 years",
    mandatorySkills: ["React", "TypeScript", "Node.js"],
    preferredSkills: ["AWS", "GraphQL"],
    responsibilities: "Design and deliver scalable product features, review technical proposals and mentor engineers across the team.",
    education: "Bachelor's degree in Computer Science or equivalent experience.",
    certifications: ["AWS Certified Developer (preferred)"],
    eligibility: "Based in or willing to commute to Bengaluru; notice period up to 60 days.",
    numberOfPositions: 2,
    budget: "INR 28-36 LPA",
    deadline: "2026-12-18",
    recruiterOwner: "Aisha Patel",
    status: "Published",
    publication: "Published",
    currentVersion: "v3",
    versions: [
      { version: "v3", updatedAt: "25 Nov 2026", updatedBy: "Aisha Patel", summary: "Updated GraphQL to preferred skill and extended deadline to 18 Dec 2026." },
      { version: "v2", updatedAt: "18 Nov 2026", updatedBy: "Aisha Patel", summary: "Approved public JD summary after hiring manager review." },
      { version: "v1", updatedAt: "12 Nov 2026", updatedBy: "Daniel Kim", summary: "Initial JD created from uploaded client requirement." },
    ],
    date: "25 Nov 2026",
    metric: "18 applicants",
    score: "—",
  },
  {
    id: "JOB-1041",
    jobId: "ADP-JD-1041",
    title: "Product Designer",
    clientName: "BluePeak Labs",
    originalJdFile: "BluePeak-Product-Designer-JD-v2.docx",
    publicDescription:
      "Lead product discovery, user flows, and accessible design systems alongside cross-functional product and engineering squads.",
    detail: "Permanent",
    category: "Product",
    location: "Mumbai",
    workMode: "Hybrid",
    workTimings: "9:30 AM – 6:30 PM IST",
    experienceRequired: "4-7 years",
    mandatorySkills: ["Product design", "Figma", "UX research"],
    preferredSkills: ["Design systems", "Prototyping"],
    responsibilities: "Lead product discovery, create user flows and prototypes, and partner with engineering on accessible product experiences.",
    education: "Degree or equivalent experience in design, HCI or a related discipline.",
    certifications: [],
    eligibility: "Portfolio with B2B SaaS case studies required.",
    numberOfPositions: 1,
    budget: "INR 22-30 LPA",
    deadline: "2026-12-12",
    recruiterOwner: "Daniel Kim",
    status: "Published",
    publication: "Published",
    currentVersion: "v2",
    versions: [
      { version: "v2", updatedAt: "24 Nov 2026", updatedBy: "Daniel Kim", summary: "Clarified UX research as mandatory criterion." },
      { version: "v1", updatedAt: "15 Nov 2026", updatedBy: "Daniel Kim", summary: "Created JD from BluePeak intake notes." },
    ],
    date: "24 Nov 2026",
    metric: "12 applicants",
    score: "—",
  },
  {
    id: "JOB-1040",
    jobId: "ADP-JD-1040",
    title: "Talent Acquisition Specialist",
    clientName: "Meridian Systems",
    originalJdFile: "Meridian-TA-Specialist-Contract.pdf",
    publicDescription:
      "Partner with hiring leads to coordinate technical recruitment pipelines, structured screening, and candidate communications.",
    detail: "Contract",
    category: "People & Culture",
    location: "Mumbai",
    workMode: "On-site",
    workTimings: "9:00 AM – 6:00 PM IST",
    experienceRequired: "3-6 years",
    mandatorySkills: ["Recruitment", "Sourcing", "ATS"],
    preferredSkills: ["Technology hiring", "Stakeholder management"],
    responsibilities: "Coordinate hiring activity, build candidate pipelines and maintain timely communication with candidates and hiring managers.",
    education: "Bachelor's degree or equivalent recruitment experience.",
    certifications: [],
    eligibility: "Immediate to 30-day availability for 6-month renewable contract.",
    numberOfPositions: 1,
    budget: "INR 1.2-1.6 L/month",
    deadline: "2026-12-20",
    recruiterOwner: "Leah Morgan",
    status: "Active",
    publication: "Published",
    currentVersion: "v1",
    versions: [
      { version: "v1", updatedAt: "22 Nov 2026", updatedBy: "Leah Morgan", summary: "Initial approved contract JD published." },
    ],
    date: "22 Nov 2026",
    metric: "9 applicants",
    score: "—",
  },
  {
    id: "JOB-1039",
    jobId: "ADP-JD-1039",
    title: "Business Development Manager",
    clientName: "Cedar Consulting",
    originalJdFile: "Cedar-BDM-SaaS-Draft.docx",
    publicDescription:
      "Build enterprise partnerships and qualify B2B consulting and SaaS growth opportunities across international accounts.",
    detail: "Permanent",
    category: "Sales",
    location: "Pune",
    workMode: "Remote",
    workTimings: "1:00 PM – 10:00 PM IST (UK/US overlap)",
    experienceRequired: "6-10 years",
    mandatorySkills: ["B2B sales", "Partnerships", "Negotiation"],
    preferredSkills: ["SaaS", "International markets"],
    responsibilities: "Develop client relationships, qualify opportunities and coordinate proposals with delivery teams.",
    education: "Bachelor's degree in Business, Marketing or equivalent experience.",
    certifications: [],
    eligibility: "Experience selling IT services or B2B SaaS to UK/North America clients.",
    numberOfPositions: 1,
    budget: "INR 24-32 LPA",
    deadline: "2027-01-08",
    recruiterOwner: "Aisha Patel",
    status: "Internal Review",
    publication: "Unpublished",
    currentVersion: "v1",
    versions: [
      { version: "v1", updatedAt: "21 Nov 2026", updatedBy: "Aisha Patel", summary: "Drafted from Cedar Consulting intake; awaiting commercial sign-off." },
    ],
    date: "21 Nov 2026",
    metric: "1 applicant",
    score: "—",
  },
  {
    id: "JOB-1038",
    jobId: "ADP-JD-1038",
    title: "Cloud Infrastructure Engineer",
    clientName: "Northstar Technologies",
    originalJdFile: "Northstar-Cloud-Infra-Contract.pdf",
    publicDescription:
      "Operate and automate resilient AWS and Kubernetes infrastructure with Terraform and observability tooling.",
    detail: "Contract",
    category: "Technology",
    location: "Hyderabad",
    workMode: "Remote",
    workTimings: "12:00 PM – 9:00 PM IST",
    experienceRequired: "5-9 years",
    mandatorySkills: ["AWS", "Kubernetes", "Terraform"],
    preferredSkills: ["Observability", "Python"],
    responsibilities: "Build and operate cloud infrastructure, improve reliability and contribute to incident response practices.",
    education: "Bachelor's degree in Computer Science or equivalent experience.",
    certifications: ["AWS Solutions Architect (preferred)"],
    eligibility: "Remote across India; on-call rotation support required.",
    numberOfPositions: 3,
    budget: "INR 1.8-2.4 L/month",
    deadline: "2026-12-05",
    recruiterOwner: "Daniel Kim",
    status: "On Hold",
    publication: "Unpublished",
    currentVersion: "v2",
    versions: [
      { version: "v2", updatedAt: "19 Nov 2026", updatedBy: "Daniel Kim", summary: "Placed on hold pending Q1 headcount confirmation." },
      { version: "v1", updatedAt: "10 Nov 2026", updatedBy: "Daniel Kim", summary: "Published initial offshore contract requirement." },
    ],
    date: "19 Nov 2026",
    metric: "26 applicants",
    score: "—",
  },
  {
    id: "JOB-1037",
    jobId: "ADP-JD-1037",
    title: "Finance Analyst",
    clientName: "Cedar Consulting",
    originalJdFile: "Cedar-Finance-Analyst-2026.pdf",
    publicDescription:
      "Support financial forecasting, variance analysis, and annual budgeting cycles in an on-site finance team.",
    detail: "Permanent",
    category: "Finance",
    location: "Bengaluru",
    workMode: "On-site",
    workTimings: "9:30 AM – 6:30 PM IST",
    experienceRequired: "3-5 years",
    mandatorySkills: ["Financial analysis", "Excel", "Forecasting"],
    preferredSkills: ["Power BI", "ERP"],
    responsibilities: "Prepare forecasts and reports, analyze business performance and support budgeting cycles.",
    education: "Bachelor's degree in Finance, Accounting or a related field.",
    certifications: ["CFA Level I (preferred)"],
    eligibility: "On-site in Bengaluru; immediate joiners preferred.",
    numberOfPositions: 1,
    budget: "INR 14-20 LPA",
    deadline: "2026-11-15",
    recruiterOwner: "Leah Morgan",
    status: "Closed",
    publication: "Unpublished",
    currentVersion: "v1",
    versions: [
      { version: "v1", updatedAt: "16 Nov 2026", updatedBy: "Leah Morgan", summary: "Position closed after final selection." },
    ],
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

export type ClientSubmissionEntry = {
  id: string;
  client: string;
  jdVersion: string;
  resumeVersion: string;
  submittedDate: string;
  recruiter: string;
  feedbackStatus: "Submitted to Client" | "Client Approved" | "Client Rejected" | "Pending Feedback";
  notes: string;
};

export type InterviewRecord = {
  id: string;
  stage: string;
  scheduledFor: string;
  participants: string;
  outcome: "Scheduled" | "Completed" | "Passed" | "On Hold";
  feedback: string;
};

export type ApplicationManagementRecord = {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobRecordId: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  jdVersion: string;
  resumeId: string;
  resumeVersion: string;
  recruiterOwner: string;
  status: string;
  atsScore: string;
  submissionDate: string;
  applicationDateIso: string;
  clientSubmissions?: ClientSubmissionEntry[];
  interviews?: InterviewRecord[];
};

export const applicationManagementRecords: readonly ApplicationManagementRecord[] = [
  {
    id: "APP-2088",
    candidateId: "CAN-5012",
    candidateName: "Aarav Mehta",
    candidateEmail: "aarav.mehta@example.com",
    jobRecordId: "JOB-1042",
    jobId: "ADP-JD-1042",
    jobTitle: "Senior Software Engineer",
    clientName: "Northstar Technologies",
    jdVersion: "v3",
    resumeId: "RES-7018",
    resumeVersion: "v2",
    recruiterOwner: "Aisha Patel",
    status: "Submitted to Client",
    atsScore: "94%",
    submissionDate: "25 Nov 2026",
    applicationDateIso: "2026-11-25",
    clientSubmissions: [
      {
        id: "SUB-401",
        client: "Northstar Technologies",
        jdVersion: "v3",
        resumeVersion: "v2",
        submittedDate: "26 Nov 2026",
        recruiter: "Aisha Patel",
        feedbackStatus: "Submitted to Client",
        notes: "Shared shortlisted profile and technical screening notes with engineering lead.",
      },
    ],
    interviews: [
      {
        id: "INT-901",
        stage: "Technical Screening",
        scheduledFor: "26 Nov 2026 · 03:00 PM IST",
        participants: "Aisha Patel, Staff Engineer",
        outcome: "Passed",
        feedback: "Strong React architecture and TypeScript depth; ready for client round.",
      },
    ],
  },
  {
    id: "APP-2087",
    candidateId: "CAN-5011",
    candidateName: "Mira Shah",
    candidateEmail: "mira.shah@example.com",
    jobRecordId: "JOB-1041",
    jobId: "ADP-JD-1041",
    jobTitle: "Product Designer",
    clientName: "BluePeak Labs",
    jdVersion: "v2",
    resumeId: "RES-7017",
    resumeVersion: "v1",
    recruiterOwner: "Daniel Kim",
    status: "Interview Scheduled",
    atsScore: "88%",
    submissionDate: "25 Nov 2026",
    applicationDateIso: "2026-11-25",
    interviews: [
      {
        id: "INT-902",
        stage: "Portfolio Walkthrough",
        scheduledFor: "28 Nov 2026 · 02:30 PM IST",
        participants: "Daniel Kim, Design Lead",
        outcome: "Scheduled",
        feedback: "Portfolio link verified; focus on accessibility and design system governance.",
      },
    ],
  },
  {
    id: "APP-2086",
    candidateId: "CAN-5010",
    candidateName: "Rohan Iyer",
    candidateEmail: "rohan.iyer@example.com",
    jobRecordId: "JOB-1042",
    jobId: "ADP-JD-1042",
    jobTitle: "Senior Software Engineer",
    clientName: "Northstar Technologies",
    jdVersion: "v3",
    resumeId: "RES-7016",
    resumeVersion: "v2",
    recruiterOwner: "Aisha Patel",
    status: "Resume Under Review",
    atsScore: "81%",
    submissionDate: "24 Nov 2026",
    applicationDateIso: "2026-11-24",
  },
  {
    id: "APP-2085",
    candidateId: "CAN-5009",
    candidateName: "Ananya Rao",
    candidateEmail: "ananya.rao@example.com",
    jobRecordId: "JOB-1040",
    jobId: "ADP-JD-1040",
    jobTitle: "Talent Acquisition Specialist",
    clientName: "Meridian Systems",
    jdVersion: "v1",
    resumeId: "RES-7015",
    resumeVersion: "v1",
    recruiterOwner: "Leah Morgan",
    status: "New Application",
    atsScore: "76%",
    submissionDate: "24 Nov 2026",
    applicationDateIso: "2026-11-24",
  },
  {
    id: "APP-2084",
    candidateId: "CAN-5008",
    candidateName: "Kabir Nair",
    candidateEmail: "kabir.nair@example.com",
    jobRecordId: "JOB-1039",
    jobId: "ADP-JD-1039",
    jobTitle: "Business Development Manager",
    clientName: "Cedar Consulting",
    jdVersion: "v1",
    resumeId: "RES-7014",
    resumeVersion: "v1",
    recruiterOwner: "Aisha Patel",
    status: "Technical Screening",
    atsScore: "72%",
    submissionDate: "23 Nov 2026",
    applicationDateIso: "2026-11-23",
  },
  {
    id: "APP-2083",
    candidateId: "CAN-5007",
    candidateName: "Diya Kapoor",
    candidateEmail: "diya.kapoor@example.com",
    jobRecordId: "JOB-1041",
    jobId: "ADP-JD-1041",
    jobTitle: "Product Designer",
    clientName: "BluePeak Labs",
    jdVersion: "v2",
    resumeId: "RES-7013",
    resumeVersion: "v1",
    recruiterOwner: "Daniel Kim",
    status: "Rejected",
    atsScore: "48%",
    submissionDate: "22 Nov 2026",
    applicationDateIso: "2026-11-22",
  },
  {
    id: "APP-2082",
    candidateId: "CAN-5012",
    candidateName: "Aarav Mehta",
    candidateEmail: "aarav.mehta@example.com",
    jobRecordId: "JOB-1041",
    jobId: "ADP-JD-1041",
    jobTitle: "Product Designer",
    clientName: "BluePeak Labs",
    jdVersion: "v2",
    resumeId: "RES-7018",
    resumeVersion: "v1",
    recruiterOwner: "Daniel Kim",
    status: "On Hold",
    atsScore: "67%",
    submissionDate: "20 Nov 2026",
    applicationDateIso: "2026-11-20",
  },
  {
    id: "APP-2081",
    candidateId: "CAN-5010",
    candidateName: "Rohan Iyer",
    candidateEmail: "rohan.iyer@example.com",
    jobRecordId: "JOB-1038",
    jobId: "ADP-JD-1038",
    jobTitle: "Cloud Infrastructure Engineer",
    clientName: "Northstar Technologies",
    jdVersion: "v2",
    resumeId: "RES-7016",
    resumeVersion: "v1",
    recruiterOwner: "Daniel Kim",
    status: "Shortlisted",
    atsScore: "91%",
    submissionDate: "19 Nov 2026",
    applicationDateIso: "2026-11-19",
  },
];

export type CandidateManagementRecord = AdminManagementRecord & {
  phoneNumber: string;
  noticePeriod: string;
  experienceYears: number;
  primarySkills: string[];
  totalApplications: number;
  resumeFile: string;
  resumeUpdated: string;
  lastAppliedDate: string;
  atsScore: number;
  atsInsight: string;
  duplicateWarning?: string;
};

export const candidateManagementRecords: readonly CandidateManagementRecord[] = [
  {
    id: "CAN-5012",
    title: "Aarav Mehta",
    detail: "aarav.mehta@example.com",
    phoneNumber: "+91 98765 43210",
    category: "React, TypeScript, Node.js",
    primarySkills: ["React", "TypeScript", "Node.js", "AWS"],
    location: "Bengaluru",
    status: "Shortlisted",
    date: "Updated today",
    lastAppliedDate: "2026-11-25",
    metric: "7 years",
    experienceYears: 7,
    noticePeriod: "30 days",
    totalApplications: 2,
    resumeFile: "aarav-mehta-resume.pdf",
    resumeUpdated: "25 Nov 2026",
    atsScore: 94,
    atsInsight: "Strong alignment across required frontend skills and product engineering experience.",
    score: "—",
  },
  {
    id: "CAN-5011",
    title: "Mira Shah",
    detail: "mira.shah@example.com",
    phoneNumber: "+91 98201 76543",
    category: "Product design, Figma, UX",
    primarySkills: ["Product design", "Figma", "UX research", "Design systems"],
    location: "Mumbai",
    status: "Interview Scheduled",
    date: "Updated today",
    lastAppliedDate: "2026-11-25",
    metric: "5 years",
    experienceYears: 5,
    noticePeriod: "Immediate",
    totalApplications: 1,
    resumeFile: "mira-shah-profile.docx",
    resumeUpdated: "25 Nov 2026",
    atsScore: 88,
    atsInsight: "Strong product design portfolio and relevant UX research experience.",
    score: "—",
  },
  {
    id: "CAN-5010",
    title: "Rohan Iyer",
    detail: "rohan.iyer@example.com",
    phoneNumber: "+91 98450 23456",
    category: "Cloud, AWS, Kubernetes",
    primarySkills: ["AWS", "Kubernetes", "Terraform", "Python"],
    location: "Chennai",
    status: "Technical Screening",
    date: "Updated yesterday",
    lastAppliedDate: "2026-11-24",
    metric: "9 years",
    experienceYears: 9,
    noticePeriod: "60 days",
    totalApplications: 2,
    resumeFile: "rohan-iyer-resume.pdf",
    resumeUpdated: "24 Nov 2026",
    atsScore: 91,
    atsInsight: "Relevant cloud platform experience; validate architecture depth in screening.",
    score: "—",
  },
  {
    id: "CAN-5009",
    title: "Ananya Rao",
    detail: "ananya.rao@example.com",
    phoneNumber: "+91 98190 45678",
    category: "Recruitment, sourcing, HR",
    primarySkills: ["Talent acquisition", "Sourcing", "ATS", "Candidate experience"],
    location: "Mumbai",
    status: "Resume Under Review",
    date: "Updated 2 days ago",
    lastAppliedDate: "2026-11-24",
    metric: "6 years",
    experienceYears: 6,
    noticePeriod: "30 days",
    totalApplications: 1,
    resumeFile: "ananya-rao-cv.pdf",
    resumeUpdated: "24 Nov 2026",
    atsScore: 76,
    atsInsight: "Relevant recruitment experience; some role-specific technology hiring evidence is limited.",
    duplicateWarning: "Similar phone number suffix detected in legacy archive (verify before merging).",
    score: "—",
  },
  {
    id: "CAN-5008",
    title: "Kabir Nair",
    detail: "kabir.nair@example.com",
    phoneNumber: "+91 98900 12345",
    category: "Sales, partnerships, SaaS",
    primarySkills: ["B2B sales", "Partnerships", "SaaS", "Negotiation"],
    location: "Pune",
    status: "Available",
    date: "Updated 3 days ago",
    lastAppliedDate: "2026-11-23",
    metric: "8 years",
    experienceYears: 8,
    noticePeriod: "45 days",
    totalApplications: 1,
    resumeFile: "kabir-nair-resume.docx",
    resumeUpdated: "23 Nov 2026",
    atsScore: 72,
    atsInsight: "Good client partnership background; international SaaS exposure needs confirmation.",
    score: "—",
  },
  {
    id: "CAN-5007",
    title: "Diya Kapoor",
    detail: "diya.kapoor@example.com",
    phoneNumber: "+91 97654 32019",
    category: "UI design, visual communication",
    primarySkills: ["Visual communication", "Brand identity"],
    location: "Delhi NCR",
    status: "Rejected",
    date: "Updated 4 days ago",
    lastAppliedDate: "2026-11-22",
    metric: "2 years",
    experienceYears: 2,
    noticePeriod: "15 days",
    totalApplications: 1,
    resumeFile: "diya-kapoor-scan.pdf",
    resumeUpdated: "22 Nov 2026",
    atsScore: 48,
    atsInsight: "Resume uploaded as image-based PDF; manual review required for complete verification.",
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

export type ResumeVersionRecord = {
  version: string;
  fileName: string;
  uploadDate: string;
  atsScore: number;
};

export type ResumeManagementRecord = AdminManagementRecord & {
  candidateId: string;
  candidateEmail: string;
  skills: string[];
  experienceYears: number;
  version: string;
  uploadDateIso: string;
  atsScore: number;
  parseErrorReason?: string;
  parsedSummary: {
    summary: string;
    education: string;
    certifications: string[];
  };
  versions: ResumeVersionRecord[];
};

export const resumeManagementRecords: readonly ResumeManagementRecord[] = [
  {
    id: "RES-7018",
    candidateId: "CAN-5012",
    candidateEmail: "aarav.mehta@example.com",
    title: "Aarav Mehta",
    detail: "aarav-mehta-resume.pdf",
    category: "Senior Software Engineer",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    experienceYears: 7,
    version: "v2",
    uploadDateIso: "2026-11-25",
    atsScore: 94,
    parsedSummary: {
      summary: "7 years building production React/TypeScript web platforms and Node.js APIs across B2B SaaS teams.",
      education: "B.Tech in Computer Science · NIT Surathkal",
      certifications: ["AWS Certified Developer – Associate"],
    },
    versions: [
      { version: "v2", fileName: "aarav-mehta-resume.pdf", uploadDate: "25 Nov 2026", atsScore: 94 },
      { version: "v1", fileName: "aarav-mehta-resume-v1.pdf", uploadDate: "20 Nov 2026", atsScore: 89 },
    ],
    location: "Bengaluru",
    status: "Reviewed",
    date: "25 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7017",
    candidateId: "CAN-5011",
    candidateEmail: "mira.shah@example.com",
    title: "Mira Shah",
    detail: "mira-shah-profile.docx",
    category: "Product Designer",
    skills: ["Product design", "Figma", "UX research", "Design systems"],
    experienceYears: 5,
    version: "v1",
    uploadDateIso: "2026-11-25",
    atsScore: 88,
    parsedSummary: {
      summary: "5 years leading end-to-end UX research, Figma component libraries, and accessible enterprise workflows.",
      education: "M.Des in Interaction Design · IDC IIT Bombay",
      certifications: ["NN/g UX Certification"],
    },
    versions: [
      { version: "v1", fileName: "mira-shah-profile.docx", uploadDate: "25 Nov 2026", atsScore: 88 },
    ],
    location: "Mumbai",
    status: "Reviewed",
    date: "25 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7016",
    candidateId: "CAN-5010",
    candidateEmail: "rohan.iyer@example.com",
    title: "Rohan Iyer",
    detail: "rohan-iyer-resume.pdf",
    category: "Senior Software Engineer",
    skills: ["AWS", "Kubernetes", "Terraform", "Python"],
    experienceYears: 9,
    version: "v2",
    uploadDateIso: "2026-11-24",
    atsScore: 81,
    parsedSummary: {
      summary: "9 years spanning cloud infrastructure, Kubernetes orchestration, Terraform automation, and backend services.",
      education: "B.E. in Information Technology · Anna University",
      certifications: ["AWS Solutions Architect – Professional"],
    },
    versions: [
      { version: "v2", fileName: "rohan-iyer-resume.pdf", uploadDate: "24 Nov 2026", atsScore: 81 },
      { version: "v1", fileName: "rohan-iyer-resume-v1.pdf", uploadDate: "18 Nov 2026", atsScore: 78 },
    ],
    location: "Chennai",
    status: "ATS Pending",
    parseErrorReason: "Re-uploaded resume v2 is queued for updated ATS comparison against JD v3.",
    date: "24 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7015",
    candidateId: "CAN-5009",
    candidateEmail: "ananya.rao@example.com",
    title: "Ananya Rao",
    detail: "ananya-rao-cv.pdf",
    category: "Talent Acquisition Specialist",
    skills: ["Talent acquisition", "Sourcing", "ATS", "Candidate experience"],
    experienceYears: 6,
    version: "v1",
    uploadDateIso: "2026-11-24",
    atsScore: 76,
    parsedSummary: {
      summary: "6 years managing end-to-end hiring cycles, ATS administration, and stakeholder reporting.",
      education: "MBA in Human Resources · NMIMS Mumbai",
      certifications: ["SHRM-CP"],
    },
    versions: [
      { version: "v1", fileName: "ananya-rao-cv.pdf", uploadDate: "24 Nov 2026", atsScore: 76 },
    ],
    location: "Mumbai",
    status: "Needs Review",
    date: "24 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7014",
    candidateId: "CAN-5008",
    candidateEmail: "kabir.nair@example.com",
    title: "Kabir Nair",
    detail: "kabir-nair-resume.docx",
    category: "Business Development Manager",
    skills: ["B2B sales", "Partnerships", "SaaS", "Negotiation"],
    experienceYears: 8,
    version: "v1",
    uploadDateIso: "2026-11-23",
    atsScore: 72,
    parsedSummary: {
      summary: "8 years driving enterprise B2B sales, partner ecosystems, and SaaS contract negotiations.",
      education: "BBA · Symbiosis International University",
      certifications: [],
    },
    versions: [
      { version: "v1", fileName: "kabir-nair-resume.docx", uploadDate: "23 Nov 2026", atsScore: 72 },
    ],
    location: "Pune",
    status: "Reviewed",
    date: "23 Nov 2026",
    metric: "—",
    score: "—",
  },
  {
    id: "RES-7013",
    candidateId: "CAN-5007",
    candidateEmail: "diya.kapoor@example.com",
    title: "Diya Kapoor",
    detail: "diya-kapoor-scan.pdf",
    category: "Product Designer",
    skills: ["Visual communication", "Brand identity"],
    experienceYears: 2,
    version: "v1",
    uploadDateIso: "2026-11-22",
    atsScore: 48,
    parseErrorReason: "Low text coverage (scanned PDF image detected). Manual review required.",
    parsedSummary: {
      summary: "Partial text extracted from scanned document. Review original file directly.",
      education: "Not automatically extracted",
      certifications: [],
    },
    versions: [
      { version: "v1", fileName: "diya-kapoor-scan.pdf", uploadDate: "22 Nov 2026", atsScore: 48 },
    ],
    location: "Delhi NCR",
    status: "ATS Failed",
    date: "22 Nov 2026",
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
  { label: "Moderate match · 50–69%", percentage: 29, color: "bg-amber-500" },
  { label: "Low match · Below 50%", percentage: 15, color: "bg-slate-400" },
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
