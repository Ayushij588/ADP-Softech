import { z } from "zod";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Date is invalid");

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "ID must be a valid ObjectId");

export const dashboardQuerySchema = z
  .object({
    startDate: dateOnlySchema.optional(),
    endDate: dateOnlySchema.optional(),
    recruiterId: objectIdSchema.optional(),
    clientId: objectIdSchema.optional(),
    jobId: objectIdSchema.optional(),
  })
  .superRefine((filters, context) => {
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }
  });

export type DashboardFilters = z.infer<typeof dashboardQuerySchema>;
