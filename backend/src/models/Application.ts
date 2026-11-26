
import mongoose, { Schema, Document } from "mongoose";

export type ApplicationStatus =
  | "new_application"
  | "resume_under_review"
  | "shortlisted"
  | "technical_screening"
  | "interview_scheduled"
  | "selected"
  | "rejected"
  | "on_hold"
  | "submitted_to_client"
  | "client_approved"
  | "client_rejected"
  | "hired";

export interface IApplication extends Document {
  applicationId: string;
  candidate: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  appliedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    applicationId: {
      type: String,
      unique: true,
      required: true,
    },

    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "new_application",
        "resume_under_review",
        "shortlisted",
        "technical_screening",
        "interview_scheduled",
        "selected",
        "rejected",
        "on_hold",
        "submitted_to_client",
        "client_approved",
        "client_rejected",
        "hired",
      ],
      default: "new_application",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index(
  { candidate: 1, job: 1 },
  { unique: true }
);

export default mongoose.model<IApplication>(
  "Application",
  applicationSchema
);
