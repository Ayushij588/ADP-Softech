import mongoose, { Schema, Document } from "mongoose";

export interface IPendingCandidate extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  consent: boolean;
  consentAt: Date;
  currentLocation?: string;
  totalExperience?: number;
  relevantExperience?: number;
  primarySkills?: string[];
  currentNoticePeriod?: string;
  expiresAt: Date;
}

const pendingCandidateSchema = new Schema<IPendingCandidate>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value: boolean) => value === true,
        message: "Consent is required",
      },
    },
    consentAt: {
      type: Date,
      required: true,
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    totalExperience: {
      type: Number,
      min: 0,
    },
    relevantExperience: {
      type: Number,
      min: 0,
    },
    primarySkills: {
      type: [String],
      default: [],
    },
    currentNoticePeriod: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

pendingCandidateSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IPendingCandidate>(
  "PendingCandidate",
  pendingCandidateSchema
);
