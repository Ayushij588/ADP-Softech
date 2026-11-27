import mongoose, { Schema, Document } from "mongoose";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../constants/applicationStatus";

export type { ApplicationStatus } from "../constants/applicationStatus";

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
      enum: APPLICATION_STATUSES,
      default: "new_application",
      required: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications for the same candidate and job
applicationSchema.index(
  { candidate: 1, job: 1 },
  { unique: true }
);

export default mongoose.model<IApplication>("Application", applicationSchema);