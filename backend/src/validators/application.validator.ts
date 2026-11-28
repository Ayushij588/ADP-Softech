import { z } from "zod";
import { APPLICATION_STATUSES } from "../constants/applicationStatus";

export const applicationQuerySchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  jobId: z.string().optional(),
  search: z.string().optional(),
});
