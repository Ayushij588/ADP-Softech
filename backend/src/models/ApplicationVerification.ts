import mongoose, { Schema, Document } from "mongoose";

export interface IApplicationVerification extends Document {
  candidate: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  codeDigest: string;
  expiresAt: Date;
  attempts: number;
  lastSentAt: Date;
  deliveryConfirmed: boolean;
}

const applicationVerificationSchema =
  new Schema<IApplicationVerification>(
    {
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
      codeDigest: {
        type: String,
        required: true,
        select: false,
      },
      expiresAt: {
        type: Date,
        required: true,
        expires: 0,
      },
      attempts: {
        type: Number,
        required: true,
        default: 0,
      },
      lastSentAt: {
        type: Date,
        required: true,
      },
      deliveryConfirmed: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    { timestamps: true }
  );

applicationVerificationSchema.index({ candidate: 1 }, { unique: true });

export default mongoose.model<IApplicationVerification>(
  "ApplicationVerification",
  applicationVerificationSchema
);
