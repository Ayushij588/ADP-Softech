
import mongoose, { Schema, Document } from "mongoose";

// Client interface
export interface IClient extends Document {
  companyName: string;
  industry?: string;
  website?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  confidentiality: boolean;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

// Client schema
const clientSchema = new Schema<IClient>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    confidentiality: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Create Client model
const Client = mongoose.model<IClient>("Client", clientSchema);

export default Client;
