import { z } from "zod";

// Create Job Validator
export const createJobSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),

  client: z.string().min(1, "Client ID is required"),

  publicJD: z.string().optional(),

  minExperience: z.number().min(0),

  maxExperience: z.number().min(0),

  mandatorySkills: z.array(z.string()).min(1, "At least one mandatory skill is required"),

  preferredSkills: z.array(z.string()).optional(),

  responsibilities: z.string().optional(),

  education: z.string().optional(),

  location: z.string().min(1, "Location is required"),

  workMode: z.enum(["remote", "hybrid", "onsite"]),

  workTimings: z.string().optional(),

  timeZone: z.string().optional(),

  engagementType: z.enum([
    "permanent",
    "contract",
    "contract_to_hire",
    "other",
  ]),

  budget: z.string().optional(),

  showBudgetPublicly: z.boolean().optional(),

  eligibility: z.string().optional(),

  positions: z.number().int().min(1),

  deadline: z.string().optional(),

  recruiterOwner: z.string().optional(),
});

// Update Job Validator
export const updateJobSchema = createJobSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required for update",
  }
);

// Job Status Validator
export const updateJobStatusSchema = z.object({
  status: z.enum(["draft", "active", "on_hold", "closed", "archived"]),
});

// Publish Job Validator
export const publishJobSchema = z.object({
  isPublished: z.boolean(),
});