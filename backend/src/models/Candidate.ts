
import mongoose, { Schema, Document } from "mongoose";

export interface ICandidate extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  currentLocation?: string;
  totalExperience?: number;
  relevantExperience?: number;
  primarySkills?: string[];
  currentNoticePeriod?: string;
}

const candidateSchema = new Schema<ICandidate>(
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
  },
  { timestamps: true }
);

export default mongoose.model<ICandidate>("Candidate", candidateSchema);
