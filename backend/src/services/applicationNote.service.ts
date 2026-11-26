import ApplicationNote from "../models/ApplicationNote";
import Application from "../models/Application";

export const createApplicationNote = async (
  applicationId: string,
  recruiterId: string,
  note: string
) => {
  const application = await Application.findById(applicationId);

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
  applicationId: string
) => {
  const application = await Application.findById(applicationId);

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