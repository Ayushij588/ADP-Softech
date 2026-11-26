
import { z } from "zod";

// Register validation
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),

  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// Login validation
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

// TypeScript types
export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

// Recruiter creation validation
export const createRecruiterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export type CreateRecruiterInput = z.infer<typeof createRecruiterSchema>;

// Recruiter profile update validation
export const updateRecruiterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email")
      .toLowerCase()
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one field (name or email) is required",
  });

export type UpdateRecruiterInput = z.infer<typeof updateRecruiterSchema>;

// Recruiter status update validation
export const updateRecruiterStatusSchema = z.object({
  status: z.enum(["active", "inactive"], {
    message: "Status must be either active or inactive",
  }),
});

export type UpdateRecruiterStatusInput = z.infer<
  typeof updateRecruiterStatusSchema
>;
