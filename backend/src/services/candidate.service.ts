import Candidate, { ICandidate } from "../models/Candidate";
import { CandidateInput } from "../validators/candidate.validator";

export const createCandidate = async (
  candidateData: CandidateInput
): Promise<ICandidate> => {
  const existingCandidate = await Candidate.findOne({
    $or: [
      { email: candidateData.email },
      { mobileNumber: candidateData.mobileNumber },
    ],
  });

  if (existingCandidate) {
    throw new Error("Candidate already exists with this email or mobile number");
  }

  const candidate = await Candidate.create(candidateData);
  return candidate;
};