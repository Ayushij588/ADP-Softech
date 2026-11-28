import mongoose, { Schema, type Document } from "mongoose";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../constants/applicationStatus";

export interface IApplicationStatusHistory extends Document {
  application: mongoose.Types.ObjectId;
  previousStatus: ApplicationStatus | null;
  newStatus: ApplicationStatus;
  changedBy: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
}

const applicationStatusHistorySchema = new Schema<IApplicationStatusHistory>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    previousStatus: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: null,
    },

    newStatus: {
      type: String,
      enum: APPLICATION_STATUSES,
      required: true,
    },

    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationStatusHistory = mongoose.model<IApplicationStatusHistory>(
  "ApplicationStatusHistory",
  applicationStatusHistorySchema
);

export default ApplicationStatusHistory;