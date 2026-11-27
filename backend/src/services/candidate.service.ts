import Candidate, { ICandidate } from "../models/Candidate";
import { CandidateInput } from "../validators/candidate.validator";

export const createCandidate = async (
  candidateData: CandidateInput
): Promise<ICandidate> => {
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
    $or: [
      { email },
      { mobileNumber },
    ],
  });

  if (existingCandidate) {
    throw new Error("Candidate already exists with this email or mobile number");
  }

  try {
    return await Candidate.create(normalizedCandidateData);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new Error("Candidate already exists with this email or mobile number");
    }

    throw error;
  }
};