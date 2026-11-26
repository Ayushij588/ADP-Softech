export const superAdminMetrics = [
  {
    title: "Total Recruiters",
    value: "18",
    description: "Recruitment team accounts",
  },
  {
    title: "Active Jobs",
    value: "24",
    description: "Open roles across the platform",
  },
  {
    title: "Total Applications",
    value: "138",
    description: "Received in the last 7 days",
  },
  {
    title: "Total Candidates",
    value: "1,284",
    description: "Candidate records in this sample",
  },
  {
    title: "ATS Analyses",
    value: "962",
    description: "Sample profile match evaluations",
  },
  {
    title: "System Activity",
    value: "1,482",
    description: "Platform events in the last 7 days",
  },
] as const;

export const recentPlatformActivity = [
  {
    id: "ACT-5408",
    actor: "Leah Morgan",
    action: "Updated recruiter role",
    target: "Recruiter access",
    time: "Today · 10:42 AM",
    status: "Completed",
  },
  {
    id: "ACT-5407",
    actor: "Daniel Kim",
    action: "Published a job",
    target: "JOB-1042",
    time: "Today · 10:18 AM",
    status: "Completed",
  },
  {
    id: "ACT-5406",
    actor: "Aisha Patel",
    action: "Reviewed an application",
    target: "APP-2088",
    time: "Today · 09:56 AM",
    status: "Completed",
  },
  {
    id: "ACT-5405",
    actor: "System",
    action: "Refreshed ATS insights",
    target: "Match analysis",
    time: "Today · 09:30 AM",
    status: "Automated",
  },
  {
    id: "ACT-5404",
    actor: "Marcos Lee",
    action: "Updated a content section",
    target: "Services page",
    time: "Yesterday · 04:12 PM",
    status: "Completed",
  },
] as const;

export const superAdminUsers = [
  {
    id: "USR-1001",
    name: "Leah Morgan",
    email: "leah.morgan@adpsoftech.example",
    role: "Super Admin",
    status: "Active",
    lastActive: "Today · 10:42 AM",
  },
  {
    id: "USR-1002",
    name: "Daniel Kim",
    email: "daniel.kim@adpsoftech.example",
    role: "Recruitment Admin",
    status: "Active",
    lastActive: "Today · 10:18 AM",
  },
  {
    id: "USR-1003",
    name: "Aisha Patel",
    email: "aisha.patel@adpsoftech.example",
    role: "Recruitment Admin",
    status: "Active",
    lastActive: "Today · 09:56 AM",
  },
  {
    id: "USR-1004",
    name: "Marcos Lee",
    email: "marcos.lee@adpsoftech.example",
    role: "Content Editor",
    status: "Invited",
    lastActive: "Invitation pending",
  },
  {
    id: "USR-1005",
    name: "Priya Nair",
    email: "priya.nair@adpsoftech.example",
    role: "Auditor",
    status: "Suspended",
    lastActive: "18 Nov 2026",
  },
] as const;

export const platformRoles = [
  {
    id: "ROLE-01",
    name: "Super Admin",
    users: "2 users",
    scope: "Full platform administration",
    permissions: "Users, roles, settings, audit logs",
    status: "Active",
  },
  {
    id: "ROLE-02",
    name: "Recruitment Admin",
    users: "12 users",
    scope: "Recruitment operations",
    permissions: "Jobs, applications, candidates, reports",
    status: "Active",
  },
  {
    id: "ROLE-03",
    name: "Content Editor",
    users: "3 users",
    scope: "Public website content",
    permissions: "Website content view and edit",
    status: "Active",
  },
  {
    id: "ROLE-04",
    name: "Auditor",
    users: "1 user",
    scope: "Read-only platform review",
    permissions: "Reports and audit logs",
    status: "Active",
  },
] as const;

export const websiteContentSections = [
  {
    id: "WEB-01",
    section: "Home page",
    path: "/",
    status: "Published",
    lastUpdated: "24 Nov 2026",
    updatedBy: "Marcos Lee",
  },
  {
    id: "WEB-02",
    section: "About us",
    path: "/about",
    status: "Published",
    lastUpdated: "20 Nov 2026",
    updatedBy: "Leah Morgan",
  },
  {
    id: "WEB-03",
    section: "Services",
    path: "/services",
    status: "Published",
    lastUpdated: "18 Nov 2026",
    updatedBy: "Marcos Lee",
  },
  {
    id: "WEB-04",
    section: "Careers",
    path: "/careers",
    status: "Draft",
    lastUpdated: "17 Nov 2026",
    updatedBy: "Daniel Kim",
  },
  {
    id: "WEB-05",
    section: "Contact page",
    path: "/contact",
    status: "Published",
    lastUpdated: "14 Nov 2026",
    updatedBy: "Marcos Lee",
  },
] as const;

export const atsScoreWeights = [
  { label: "Skills alignment", percentage: 40, color: "bg-blue-600" },
  { label: "Relevant experience", percentage: 30, color: "bg-indigo-500" },
  { label: "Location suitability", percentage: 15, color: "bg-emerald-500" },
  { label: "Availability", percentage: 15, color: "bg-amber-500" },
] as const;

export const atsMatchBands = [
  {
    label: "Strong match",
    range: "85–100%",
    description: "Prioritize for recruiter review",
  },
  {
    label: "Good match",
    range: "70–84%",
    description: "Review alongside active applicants",
  },
  {
    label: "Potential match",
    range: "50–69%",
    description: "Consider for adjacent opportunities",
  },
  {
    label: "Below threshold",
    range: "Below 50%",
    description: "Keep available for future review",
  },
] as const;

export const platformAuditLogs = [
  {
    id: "LOG-8801",
    timestamp: "25 Nov 2026 · 10:42 AM",
    actor: "Leah Morgan",
    action: "Role updated",
    resource: "Recruitment Admin access",
    source: "10.24.8.15",
  },
  {
    id: "LOG-8800",
    timestamp: "25 Nov 2026 · 10:18 AM",
    actor: "Daniel Kim",
    action: "Job published",
    resource: "JOB-1042",
    source: "10.24.8.22",
  },
  {
    id: "LOG-8799",
    timestamp: "25 Nov 2026 · 09:56 AM",
    actor: "Aisha Patel",
    action: "Application reviewed",
    resource: "APP-2088",
    source: "10.24.8.31",
  },
  {
    id: "LOG-8798",
    timestamp: "25 Nov 2026 · 09:30 AM",
    actor: "System",
    action: "ATS analysis completed",
    resource: "Match analysis batch",
    source: "Automated",
  },
  {
    id: "LOG-8797",
    timestamp: "24 Nov 2026 · 04:12 PM",
    actor: "Marcos Lee",
    action: "Website section updated",
    resource: "Services page",
    source: "10.24.8.27",
  },
  {
    id: "LOG-8796",
    timestamp: "24 Nov 2026 · 02:05 PM",
    actor: "Leah Morgan",
    action: "Settings reviewed",
    resource: "Platform security",
    source: "10.24.8.15",
  },
] as const;
