import Candidate, { ICandidate } from "../models/Candidate";
import PendingCandidate, {
  IPendingCandidate,
} from "../models/PendingCandidate";
import { CandidateInput } from "../validators/candidate.validator";
import { APPLICATION_VERIFICATION_TTL_MS } from "../constants/applicationVerification";

const DUPLICATE_CANDIDATE_ERROR =
  "Candidate already exists with this email or mobile number";

export const createCandidate = async (
  candidateData: CandidateInput
): Promise<IPendingCandidate> => {
  const fullName =
    typeof candidateData.fullName === "string"
      ? candidateData.fullName.trim()
      : "";
  const email =
    typeof candidateData.email === "string"
      ? candidateData.email.trim().toLowerCase()
      : "";
  const mobileNumber =
    typeof candidateData.mobileNumber === "string"
      ? candidateData.mobileNumber.trim()
      : "";

  if (!fullName) {
    throw new Error("Full name is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!mobileNumber) {
    throw new Error("Mobile number is required");
  }

  if (candidateData.consent !== true) {
    throw new Error("Consent is required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address");
  }

  const normalizedCandidateData: CandidateInput = {
    ...candidateData,
    fullName,
    email,
    mobileNumber,
    currentLocation: candidateData.currentLocation?.trim(),
    currentNoticePeriod: candidateData.currentNoticePeriod?.trim(),
    primarySkills: candidateData.primarySkills?.map((skill) => skill.trim()),
  };

  const existingCandidate = await Candidate.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  const existingIdentityMatches =
    typeof existingCandidate?.email === "string" &&
    typeof existingCandidate.mobileNumber === "string" &&
    existingCandidate.email.trim().toLowerCase() === email &&
    existingCandidate.mobileNumber.trim() === mobileNumber;

  if (
    existingCandidate &&
    (!existingIdentityMatches ||
      (existingCandidate.consent === true && Boolean(existingCandidate.consentAt)))
  ) {
    throw new Error(DUPLICATE_CANDIDATE_ERROR);
  }

  return PendingCandidate.create({
    ...normalizedCandidateData,
    consentAt: new Date(),
    expiresAt: new Date(Date.now() + APPLICATION_VERIFICATION_TTL_MS),
  });
};

export const finalizeCandidateIntake = async (
  pendingCandidate: IPendingCandidate
): Promise<ICandidate> => {
  const email = pendingCandidate.email.trim().toLowerCase();
  const mobileNumber = pendingCandidate.mobileNumber.trim();
  const existingCandidate = await Candidate.findOne({
    $or: [{ email }, { mobileNumber }],
  });

  if (existingCandidate) {
    if (
      typeof existingCandidate.email !== "string" ||
      typeof existingCandidate.mobileNumber !== "string" ||
      existingCandidate.email.trim().toLowerCase() !== email ||
      existingCandidate.mobileNumber.trim() !== mobileNumber
    ) {
      throw new Error(DUPLICATE_CANDIDATE_ERROR);
    }

    existingCandidate.consent = true;
    existingCandidate.consentAt = pendingCandidate.consentAt;
    return existingCandidate.save();
  }

  try {
    return await Candidate.create({
      _id: pendingCandidate._id,
      fullName: pendingCandidate.fullName.trim(),
      email,
      mobileNumber,
      consent: true,
      consentAt: pendingCandidate.consentAt,
      currentLocation: pendingCandidate.currentLocation?.trim(),
      totalExperience: pendingCandidate.totalExperience,
      relevantExperience: pendingCandidate.relevantExperience,
      primarySkills: pendingCandidate.primarySkills?.map((skill) =>
        skill.trim()
      ),
      currentNoticePeriod: pendingCandidate.currentNoticePeriod?.trim(),
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new Error(DUPLICATE_CANDIDATE_ERROR);
    }

    throw error;
  }
};