import mongoose, { Schema, Document, Types } from "mongoose";

// Job Status
export type JobStatus = "draft" | "active" | "on_hold" | "closed" | "archived";

// Work Mode
export type WorkMode = "remote" | "hybrid" | "onsite";

// Employment Type
export type EmploymentType =
  | "permanent"
  | "contract"
  | "contract_to_hire"
  | "other";

// Job Interface
export interface IJob extends Document {
  jobId: string;
  jobTitle: string;
  client: Types.ObjectId;
  originalJDFile?: string;
  publicJD?: string;
  minExperience: number;
  maxExperience: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  responsibilities?: string;
  education?: string;
  location: string;
  workMode: WorkMode;
  workTimings?: string;
  timeZone?: string;
  engagementType: EmploymentType;
  budget?: string;
  showBudgetPublicly: boolean;
  eligibility?: string;
  positions: number;
  deadline?: Date;
  recruiterOwner?: Types.ObjectId;
  status: JobStatus;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Job Schema
const jobSchema = new Schema<IJob>(
  {
    jobId: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    originalJDFile: {
      type: String,
    },

    publicJD: {
      type: String,
      trim: true,
    },

    minExperience: {
      type: Number,
      required: true,
      min: 0,
    },

    maxExperience: {
      type: Number,
      required: true,
      min: 0,
    },

    mandatorySkills: {
      type: [String],
      required: true,
    },

    preferredSkills: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: String,
      trim: true,
    },

    education: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      required: true,
    },

    workTimings: {
      type: String,
    },

    timeZone: {
      type: String,
    },

    engagementType: {
      type: String,
      enum: ["permanent", "contract", "contract_to_hire", "other"],
      required: true,
    },

    budget: {
      type: String,
    },

    showBudgetPublicly: {
      type: Boolean,
      default: false,
    },

    eligibility: {
      type: String,
    },

    positions: {
      type: Number,
      required: true,
      min: 1,
    },

    deadline: {
      type: Date,
    },

    recruiterOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["draft", "active", "on_hold", "closed", "archived"],
      default: "draft",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Job Model
const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;