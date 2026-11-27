import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { getDashboardData } from "../services/dashboard.service";
import type { DashboardFilters } from "../validators/dashboard.validator";

const queryString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const getDashboardController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
    return;
  }

  const filters: DashboardFilters = {
    startDate: queryString(req.query.startDate),
    endDate: queryString(req.query.endDate),
    recruiterId: queryString(req.query.recruiterId),
    clientId: queryString(req.query.clientId),
    jobId: queryString(req.query.jobId),
  };

  try {
    const dashboard = await getDashboardData(filters, req.user);
    res.status(200).json({
      success: true,
      message: "Dashboard metrics fetched successfully",
      dashboard,
    });
  } catch (error: unknown) {
    next(error);
  }
};
