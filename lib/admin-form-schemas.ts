import { z } from "zod";

export const jobEmploymentTypes = ["Permanent", "Contract"] as const;
export const jobStatuses = ["Published", "Draft", "On hold", "Closed"] as const;
export const userRoles = [
  "Super Admin",
  "Recruitment Admin",
  "Content Editor",
  "Auditor",
] as const;
export const contentStatuses = ["Published", "Draft"] as const;

export const jobFormSchema = z.object({
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
  location: z
    .string()
    .trim()
    .min(2, "Enter a location.")
    .max(100, "Location must be 100 characters or fewer."),
  detail: z.enum(jobEmploymentTypes, {
    error: "Select an employment type.",
  }),
  status: z.enum(jobStatuses, {
    error: "Select a job status.",
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
    .min(1, "Select at least one permission group."),
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
    skillsWeight: z
      .number({ error: "Enter a skills weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    experienceWeight: z
      .number({ error: "Enter an experience weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    locationWeight: z
      .number({ error: "Enter a location weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    availabilityWeight: z
      .number({ error: "Enter an availability weight." })
      .int("Use a whole number.")
      .min(0, "Weight cannot be less than 0%.")
      .max(100, "Weight cannot exceed 100%."),
    minimumReviewScore: z
      .number({ error: "Enter a minimum review score." })
      .int("Use a whole number.")
      .min(0, "Score cannot be less than 0%.")
      .max(100, "Score cannot exceed 100%."),
  })
  .superRefine((values, context) => {
    const total =
      values.skillsWeight +
      values.experienceWeight +
      values.locationWeight +
      values.availabilityWeight;

    if (total !== 100) {
      context.addIssue({
        code: "custom",
        message: "All four scoring weights must add up to 100%.",
        path: ["skillsWeight"],
      });
    }
  });

export type JobFormValues = z.infer<typeof jobFormSchema>;
export type UserCreationValues = z.infer<typeof userCreationSchema>;
export type RoleCreationValues = z.infer<typeof roleCreationSchema>;
export type WebsiteContentValues = z.infer<typeof websiteContentSchema>;
export type AtsSettingsValues = z.infer<typeof atsSettingsSchema>;
