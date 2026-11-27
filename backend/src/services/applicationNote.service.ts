import mongoose from "mongoose";
import ApplicationNote from "../models/ApplicationNote";
import Application from "../models/Application";
import {
  getApplicationAccessFilter,
  type ApplicationAccessContext,
} from "./applicationAccess.service";

export const createApplicationNote = async (
  applicationId: string,
  recruiterId: string,
  note: string,
  access: ApplicationAccessContext
) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  if (typeof note !== "string" || !note.trim()) {
    throw new Error("Note content is required");
  }

  const accessFilter = await getApplicationAccessFilter(access);
  const application = await Application.findOne({
    _id: applicationId,
    ...accessFilter,
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const applicationNote = await ApplicationNote.create({
    application: application._id,
    recruiter: recruiterId,
    note,
  });

  return applicationNote;
};

export const getApplicationNotes = async (
  applicationId: string,
  access: ApplicationAccessContext
) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new Error("Invalid application ID");
  }

  const accessFilter = await getApplicationAccessFilter(access);
  const application = await Application.findOne({
    _id: applicationId,
    ...accessFilter,
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const notes = await ApplicationNote.find({
    application: applicationId,
  })
    .populate("recruiter", "name email")
    .sort({ createdAt: -1 });

  return notes;
};