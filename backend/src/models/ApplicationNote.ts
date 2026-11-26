import mongoose, { Schema, Document, Types } from "mongoose";

export interface IApplicationNote extends Document {
  application: Types.ObjectId;
  recruiter: Types.ObjectId;
  note: string;
}

const applicationNoteSchema = new Schema<IApplicationNote>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplicationNote>(
  "ApplicationNote",
  applicationNoteSchema
);