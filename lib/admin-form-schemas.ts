import { z } from "zod";

export const jobEmploymentTypes = [
  "Permanent",
  "Contract",
  "Contract-to-hire",
  "Dedicated team",
] as const;
export const jobWorkModes = ["Remote", "Hybrid", "On-site"] as const;
export const jobStatuses = [
  "Draft",
  "Internal Review",
  "Approved",
  "Active",
  "Published",
  "On Hold",
  "Closed",
  "Archived",
] as const;
export const jobPublications = ["Published", "Unpublished"] as const;
export const userRoles = [
  "Super Admin",
  "Recruitment Manager",
  "Recruitment Admin",
  "Content Editor",
  "Auditor",
] as const;
export const userStatuses = [
  "Active",
  "Invited",
  "Suspended",
  "Deactivated",
] as const;
export const contentStatuses = ["Published", "Draft"] as const;

export const jobFormSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required."),
  title: z
    .string()
    .trim()
    .min(3, "Enter a job title of at least 3 characters.")
    .max(100, "Job title must be 100 characters or fewer."),
  category: z
    .string()
    .trim()
    .min(2, "Enter a department.")
    .max(80, "Department must be 80 characters or fewer."),
  clientName: z.string().trim().min(2, "Enter a client name."),
  originalJdFile: z.string().trim(),
  publicDescription: z
    .string()
    .trim()
    .min(10, "Enter the candidate-facing public JD summary."),
  location: z
    .string()
    .trim()
    .min(2, "Enter a location.")
    .max(100, "Location must be 100 characters or fewer."),
  workMode: z.enum(jobWorkModes, { error: "Select a work mode." }),
  workTimings: z
    .string()
    .trim()
    .min(2, "Enter work timings and time zone."),
  detail: z.enum(jobEmploymentTypes, {
    error: "Select an employment type.",
  }),
  experienceRequired: z.string().trim().min(1, "Enter required experience."),
  mandatorySkills: z.string().trim().min(2, "Enter mandatory skills."),
  preferredSkills: z.string().trim(),
  responsibilities: z.string().trim().min(10, "Enter role responsibilities."),
  education: z.string().trim().min(2, "Enter education requirements."),
  certifications: z.string().trim(),
  eligibility: z.string().trim(),
  numberOfPositions: z
    .number({ error: "Enter the number of positions." })
    .int()
    .min(1)
    .max(1000),
  budget: z.string().trim().min(1, "Enter the approved budget or rate."),
  deadline: z.string().min(1, "Select an application deadline."),
  recruiterOwner: z.string().trim().min(2, "Select a recruiter owner."),
  status: z.enum(jobStatuses, {
    error: "Select a job status.",
  }),
  publication: z.enum(jobPublications, {
    error: "Select a publication state.",
  }),
});

export const userCreationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a name of at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),
  role: z.enum(userRoles, {
    error: "Select a role.",
  }),
  assignedTeam: z
    .string()
    .trim()
    .min(2, "Enter an assigned team or scope.")
    .max(80, "Team name must be 80 characters or fewer."),
  status: z.enum(userStatuses, {
    error: "Select an account status.",
  }),
});

export const roleCreationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Role name must be at least 3 characters.")
    .max(60, "Role name must be 60 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(10, "Enter a description of at least 10 characters.")
    .max(240, "Description must be 240 characters or fewer."),
  permissions: z
    .array(z.string())
    .min(1, "Select at least one permission."),
});

export const websiteContentSchema = z.object({
  section: z
    .string()
    .trim()
    .min(2, "Enter a section name.")
    .max(80, "Section name must be 80 characters or fewer."),
  path: z
    .string()
    .trim()
    .min(1, "Enter a page path.")
    .max(120, "Page path must be 120 characters or fewer.")
    .refine((path) => path.startsWith("/") && !/\s/.test(path), {
      message: "Use a path beginning with / and no spaces.",
    }),
  metaTitle: z
    .string()
    .trim()
    .max(120, "SEO title must be 120 characters or fewer."),
  metaDescription: z
    .string()
    .trim()
    .max(240, "SEO description must be 240 characters or fewer."),
  content: z
    .string()
    .trim()
    .min(20, "Content must be at least 20 characters.")
    .max(5000, "Content must be 5,000 characters or fewer."),
  status: z.enum(contentStatuses, {
    error: "Select a publishing status.",
  }),
});

export const atsSettingsSchema = z
  .object({
    technicalSkillsWeight: z
      .number({ error: "Enter a technical skills weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    relevantExperienceWeight: z
      .number({ error: "Enter a relevant experience weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    requiredTechnologiesWeight: z
      .number({ error: "Enter a required technologies weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    responsibilitiesWeight: z
      .number({ error: "Enter a responsibilities weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    educationWeight: z
      .number({ error: "Enter an education weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    otherRequirementsWeight: z
      .number({ error: "Enter an other JD requirements weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    strongMatchMin: z.number({ error: "Enter Strong Match threshold." }).int().min(50).max(100),
    goodMatchMin: z.number({ error: "Enter Good Match threshold." }).int().min(20).max(99),
    moderateMatchMin: z.number({ error: "Enter Moderate Match threshold." }).int().min(0).max(95),
    minimumReviewScore: z
      .number({ error: "Enter a minimum review score." })
      .int("Use a whole number.")
      .min(0, "Score cannot be less than 0%.")
      .max(100, "Score cannot exceed 100%."),
    manualFallbackOnFailure: z.boolean(),
  })
  .superRefine((values, context) => {
    const total =
      values.technicalSkillsWeight +
      values.relevantExperienceWeight +
      values.requiredTechnologiesWeight +
      values.responsibilitiesWeight +
      values.educationWeight +
      values.otherRequirementsWeight;

    if (total !== 100) {
      context.addIssue({
        code: "custom",
        message: `All six scoring weights must add up to 100% (currently ${total}%).`,
        path: ["technicalSkillsWeight"],
      });
    }
    if (!(values.strongMatchMin > values.goodMatchMin && values.goodMatchMin > values.moderateMatchMin)) {
      context.addIssue({
        code: "custom",
        message: "Thresholds must satisfy Strong > Good > Moderate.",
        path: ["strongMatchMin"],
      });
    }
  });

export const platformSettingsSchema = z.object({
  platformName: z.string().trim().min(2, "Enter the platform name.").max(80),
  timeZone: z.string().trim().min(2, "Select a time zone."),
  language: z.string().trim().min(2, "Select a default language."),
  mfaRequired: z.boolean(),
  sessionTimeoutMinutes: z.number({ error: "Enter timeout in minutes." }).int().min(5).max(480),
  passwordPolicy: z.string().trim().min(2),
  jobIdPrefix: z.string().trim().min(2, "Enter a Job ID prefix.").max(16),
  applicationIdFormat: z.string().trim().min(5, "Enter an Application ID pattern.").max(40),
  maxResumeSizeMb: z.number({ error: "Enter max file size in MB." }).int().min(1).max(50),
  allowedResumeFormats: z.string().trim().min(3, "Enter allowed formats."),
  supportEmail: z.string().trim().email("Enter a valid support email."),
  retentionPolicy: z.string().trim().min(2),
  backupSchedule: z.string().trim().min(2),
  weeklySummary: z.boolean(),
  criticalAlerts: z.boolean(),
  candidateAckEmail: z.boolean(),
  recruiterAlertEmail: z.boolean(),
  atsFailureAlert: z.boolean(),
  deadlineReminderAlert: z.boolean(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
export type UserCreationValues = z.infer<typeof userCreationSchema>;
export type RoleCreationValues = z.infer<typeof roleCreationSchema>;
export type WebsiteContentValues = z.infer<typeof websiteContentSchema>;
export type AtsSettingsValues = z.infer<typeof atsSettingsSchema>;
export type PlatformSettingsValues = z.infer<typeof platformSettingsSchema>;
