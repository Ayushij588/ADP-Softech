import { z } from "zod";

// Create Client Validator
export const createClientSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().optional(),
  website: z.string().optional(),
  contactPerson: z.string().min(2, "Contact person is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  confidentiality: z.boolean().optional(),
});

// Update Client Validator
export const updateClientSchema = z.object({
  companyName: z.string().min(2).optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  contactPerson: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  confidentiality: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required for update",
  }
);

// Client Status Validator
export const updateClientStatusSchema = z.object({
  status: z.enum(["active", "inactive"]),
});