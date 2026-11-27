import { z } from "zod";

export const candidateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  mobileNumber: z
    .string()
    .trim()
    .min(10, "Mobile number must contain at least 10 digits"),

  consent: z.boolean().refine((value) => value, "Consent is required"),

  currentLocation: z
    .string()
    .trim()
    .optional(),

  totalExperience: z
    .number()
    .min(0, "Total experience cannot be negative")
    .optional(),

  relevantExperience: z
    .number()
    .min(0, "Relevant experience cannot be negative")
    .optional(),

  primarySkills: z
    .array(z.string().trim())
    .optional(),

  currentNoticePeriod: z
    .string()
    .trim()
    .optional(),
});

export type CandidateInput = z.infer<typeof candidateSchema>;