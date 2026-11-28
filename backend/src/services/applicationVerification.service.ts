import { createHmac, randomInt } from "node:crypto";
import nodemailer, { type Transporter } from "nodemailer";
import Application from "../models/Application";
import ApplicationVerification from "../models/ApplicationVerification";
import Candidate from "../models/Candidate";
import PendingCandidate from "../models/PendingCandidate";
import Job from "../models/Job";
import { env } from "../config/env";
import { APPLICATION_VERIFICATION_TTL_MS } from "../constants/applicationVerification";

const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFICATION_ATTEMPTS = 5;

const verificationCodeDigest = (
  candidateId: string,
  jobId: string,
  code: string
): string =>
  createHmac("sha256", env.JWT_SECRET)
    .update(`application-verification:v1:${candidateId}:${jobId}:${code}`)
    .digest("hex");

const createSmtpTransporter = (): Transporter => {
  const credentialsAreIncomplete =
    Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASSWORD);

  if (
    !env.SMTP_HOST ||
    !env.SMTP_PORT ||
    !env.SMTP_FROM ||
    credentialsAreIncomplete
  ) {
    throw Object.assign(
      new Error("Application verification email is unavailable"),
      { statusCode: 503 }
    );
  }

  const secure = env.SMTP_SECURE || env.SMTP_PORT === 465;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure,
    requireTLS: !secure,
    auth:
      env.SMTP_USER && env.SMTP_PASSWORD
        ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
        : undefined,
    tls: { minVersion: "TLSv1.2" },
  });
};

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

export const requestApplicationVerification = async (
  candidateId: string,
  jobId: string
): Promise<void> => {
  const transporter = createSmtpTransporter();

  if (
    !/^[a-f\d]{24}$/i.test(candidateId) ||
    !/^[a-f\d]{24}$/i.test(jobId)
  ) {
    return;
  }

  const existingCandidate = await Candidate.findById(candidateId).select(
    "email consent"
  );
  const pendingCandidate = existingCandidate
    ? null
    : await PendingCandidate.findById(candidateId).select("email consent");
  const candidate = existingCandidate ?? pendingCandidate;
  const job = await Job.findById(jobId).select("status isPublished");

  if (
    !candidate ||
    candidate.consent !== true ||
    !candidate.consentAt ||
    (pendingCandidate &&
      pendingCandidate.expiresAt.getTime() <= Date.now()) ||
    !job ||
    job.status !== "active" ||
    !job.isPublished
  ) {
    return;
  }

  const existingApplication = await Application.exists({
    candidate: candidate._id,
    job: job._id,
  });

  if (existingApplication) {
    return;
  }

  const now = new Date();
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const expiresAt = new Date(now.getTime() + APPLICATION_VERIFICATION_TTL_MS);
  const codeDigest = verificationCodeDigest(
    candidate._id.toString(),
    job._id.toString(),
    code
  );
  const cooldownCutoff = new Date(now.getTime() - RESEND_COOLDOWN_MS);

  let challenge = await ApplicationVerification.findOneAndUpdate(
    {
      candidate: candidate._id,
      lastSentAt: { $lte: cooldownCutoff },
    },
    {
      $set: {
        job: job._id,
        codeDigest,
        expiresAt,
        attempts: 0,
        lastSentAt: now,
        deliveryConfirmed: false,
      },
    },
    { new: true }
  );

  if (!challenge) {
    try {
      challenge = await ApplicationVerification.create({
        candidate: candidate._id,
        job: job._id,
        codeDigest,
        expiresAt,
        attempts: 0,
        lastSentAt: now,
        deliveryConfirmed: false,
      });
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        return;
      }

      throw error;
    }
  }

  if (pendingCandidate) {
    await PendingCandidate.updateOne(
      { _id: pendingCandidate._id },
      { $set: { expiresAt } }
    );
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: candidate.email,
      subject: "Your application verification code",
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    });

    await ApplicationVerification.updateOne(
      { _id: challenge._id, codeDigest },
      { $set: { deliveryConfirmed: true } }
    );
  } catch (error: unknown) {
    console.error("Application verification email delivery failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }
};

export const consumeApplicationVerification = async (
  candidateId: string,
  jobId: string,
  code: string
): Promise<void> => {
  const codeDigest = verificationCodeDigest(candidateId, jobId, code);
  const now = new Date();
  const consumedChallenge = await ApplicationVerification.findOneAndDelete({
    candidate: candidateId,
    job: jobId,
    codeDigest,
    expiresAt: { $gt: now },
    attempts: { $lt: MAX_VERIFICATION_ATTEMPTS },
    deliveryConfirmed: true,
  });

  if (consumedChallenge) {
    return;
  }

  await ApplicationVerification.updateOne(
    {
      candidate: candidateId,
      job: jobId,
      expiresAt: { $gt: now },
      attempts: { $lt: MAX_VERIFICATION_ATTEMPTS },
      deliveryConfirmed: true,
    },
    { $inc: { attempts: 1 } }
  );

  throw Object.assign(new Error("Unable to verify applicant email"), {
    statusCode: 401,
  });
};
