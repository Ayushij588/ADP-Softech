export const APPLICATION_STATUSES = [
  "new_application",
  "resume_under_review",
  "shortlisted",
  "technical_screening",
  "interview_scheduled",
  "selected",
  "rejected",
  "on_hold",
  "submitted_to_client",
  "client_approved",
  "client_rejected",
  "hired",
] as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUSES)[number];