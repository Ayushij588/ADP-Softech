import mongoose from "mongoose";
import ApplicationStatusHistory from "../models/ApplicationStatusHistory";
import type { IApplicationStatusHistory } from "../models/ApplicationStatusHistory";
import type { ApplicationStatus } from "../constants/applicationStatus";
import Application from "../models/Application";

// Save application status history
export const createStatusHistory = async (
  applicationId: string,
  previousStatus: ApplicationStatus | null,
  newStatus: ApplicationStatus,
  changedBy: string,
  remarks?: string,
  session?: mongoose.ClientSession
): Promise<IApplicationStatusHistory> => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const history = new ApplicationStatusHistory({
    application: applicationId,
    previousStatus,
    newStatus,
    changedBy,
    remarks,
  });

  await history.save(session ? { session } : undefined);

  return history;
};

// Get application status history
export const getStatusHistory = async (
  applicationId: string
): Promise<IApplicationStatusHistory[]> => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const applicationExists = await Application.findById(applicationId);

  if (!applicationExists) {
    throw new Error("Application not found");
  }

  const history = await ApplicationStatusHistory.find({
    application: applicationId,
  })
    .populate("changedBy", "name email")
    .sort({ createdAt: 1 });

  return history;
};