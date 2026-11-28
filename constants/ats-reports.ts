import {
  applicationManagementRecords,
  type ApplicationManagementRecord,
} from "@/constants/admin-content";

export type AtsMatchCategory =
  | "Strong Match"
  | "Good Match"
  | "Moderate Match"
  | "Low Match";

export type AtsReportRecord = ApplicationManagementRecord & {
  analysisId: string;
  matchCategory: AtsMatchCategory;
  analysisDate: string;
  analysisDateLabel: string;
  scoringModelVersion: string;
  analysisStatus: "Completed" | "Pending" | "Failed";
  failureReason?: string;
  coverageStatus: "High Coverage" | "Moderate Coverage" | "Low Coverage";
  coveragePercent: number;
  categoryBreakdown: {
    name: string;
    weight: number;
    score: number;
    evidence: string;
  }[];
  matchedSkills: { skill: string; evidence: string }[];
  partiallyMatchedSkills: { skill: string; explanation: string }[];
  missingSkills: string[];
  mandatoryCriteria: {
    criterion: string;
    result: "Met" | "Not Met" | "Unclear";
    note: string;
  }[];
  experienceComparison: {
    jdRequirement: string;
    resumeEvidence: string;
    status: "Aligned" | "Uncertain" | "Gap";
  };
  educationComparison: {
    jdRequirement: string;
    resumeEvidence: string;
    status: "Aligned" | "Partial" | "Gap";
  };
  inconsistencies: string[];
  screeningQuestions: string[];
  recommendation: string;
  recruiterNote: string;
};

type AtsReportDetails = Omit<AtsReportRecord, keyof ApplicationManagementRecord>;

const reportDetails: Record<string, AtsReportDetails> = {
  "APP-2088": {
    analysisId: "ATS-3308",
    matchCategory: "Strong Match",
    analysisDate: "2026-11-26",
    analysisDateLabel: "26 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Completed",
    coverageStatus: "High Coverage",
    coveragePercent: 96,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 96, evidence: "React, TypeScript, and Node.js appear across 3 recent production roles." },
      { name: "Relevant Experience", weight: 20, score: 92, evidence: "7 years of documented full-stack engineering aligns with the 5–8 year range." },
      { name: "Required Technologies", weight: 15, score: 94, evidence: "Modern React hooks, Next.js/TypeScript, and REST/Node services are evidenced." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 93, evidence: "Mentoring and technical design reviews documented in lead engineer role." },
      { name: "Education / Certifications", weight: 5, score: 95, evidence: "B.Tech in Computer Science and AWS Developer certification listed." },
      { name: "Other JD Requirements", weight: 10, score: 90, evidence: "Based in Bengaluru; 30-day notice fits hybrid UK-overlap expectations." },
    ],
    matchedSkills: [
      { skill: "React", evidence: "Led migration of enterprise customer portal to React 18 & TypeScript (2023–2026)." },
      { skill: "TypeScript", evidence: "Enforced strict TypeScript design-system contracts across 4 frontend squads." },
      { skill: "Node.js", evidence: "Built BFF aggregation APIs in Node.js handling 12k RPM." },
      { skill: "AWS", evidence: "Deployed ECS/S3 workloads with AWS Developer certification." },
    ],
    partiallyMatchedSkills: [
      { skill: "GraphQL", explanation: "Mentioned once in skills list without dedicated project evidence." },
    ],
    missingSkills: [],
    mandatoryCriteria: [
      { criterion: "5–8 years of experience", result: "Met", note: "Sample profile indicates 7 years." },
      { criterion: "React and TypeScript production experience", result: "Met", note: "Both evidenced across recent project roles." },
      { criterion: "Node.js backend collaboration", result: "Met", note: "Node.js service ownership documented." },
    ],
    experienceComparison: {
      jdRequirement: "5–8 years in frontend/full-stack product engineering",
      resumeEvidence: "7 years continuous engineering history (2019–2026)",
      status: "Aligned",
    },
    educationComparison: {
      jdRequirement: "Bachelor's degree in Computer Science or equivalent",
      resumeEvidence: "B.Tech Computer Science + AWS Developer (preferred)",
      status: "Aligned",
    },
    inconsistencies: [],
    screeningQuestions: [
      "Can you walk through your hands-on GraphQL schema or resolver experience beyond REST APIs?",
      "What mentoring or architecture review practices did you lead in your most recent team?",
    ],
    recommendation: "Prioritize for client submission and validate GraphQL exposure during screening.",
    recruiterNote: "Confirm the candidate's ownership of production React features and GraphQL exposure.",
  },
  "APP-2087": {
    analysisId: "ATS-3307",
    matchCategory: "Strong Match",
    analysisDate: "2026-11-26",
    analysisDateLabel: "26 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Completed",
    coverageStatus: "High Coverage",
    coveragePercent: 92,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 93, evidence: "Product design, Figma, and UX research evidenced across B2B SaaS projects." },
      { name: "Relevant Experience", weight: 20, score: 90, evidence: "5 years falls squarely inside the 4–7 year target window." },
      { name: "Required Technologies", weight: 15, score: 91, evidence: "Figma component tokens and design system documentation clearly cited." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 86, evidence: "Discovery workshops and engineering handoff described; accessibility depth to confirm." },
      { name: "Education / Certifications", weight: 5, score: 94, evidence: "M.Des in Interaction Design and NN/g UX certification listed." },
      { name: "Other JD Requirements", weight: 10, score: 85, evidence: "Located in Mumbai; immediate notice matches hybrid schedule." },
    ],
    matchedSkills: [
      { skill: "Product design", evidence: "Owned end-to-end SaaS workflow redesigns across 3 product releases." },
      { skill: "Figma", evidence: "Maintained multi-brand Figma token library for 20+ engineers." },
      { skill: "UX research", evidence: "Conducted 30+ usability interviews and synthesis sessions." },
      { skill: "Design systems", evidence: "Built WCAG-aligned component specs in Figma." },
    ],
    partiallyMatchedSkills: [
      { skill: "Interactive prototyping", explanation: "Static clickable flows cited; micro-interaction prototyping depth unclear." },
    ],
    missingSkills: [],
    mandatoryCriteria: [
      { criterion: "4–7 years of experience", result: "Met", note: "Sample profile indicates 5 years." },
      { criterion: "Product design portfolio", result: "Unclear", note: "Portfolio URL needs direct recruiter verification during walkthrough." },
      { criterion: "UX research experience", result: "Met", note: "Usability research studies documented." },
    ],
    experienceComparison: {
      jdRequirement: "4–7 years in product design",
      resumeEvidence: "5 years across enterprise B2B SaaS products",
      status: "Aligned",
    },
    educationComparison: {
      jdRequirement: "Degree or equivalent in design or HCI",
      resumeEvidence: "M.Des Interaction Design · IDC IIT Bombay",
      status: "Aligned",
    },
    inconsistencies: ["Portfolio link was submitted separately; ensure case studies match B2B SaaS scope."],
    screeningQuestions: [
      "Walk through one accessibility challenge you resolved in a production design system.",
      "How do you measure the impact of UX research studies after engineering release?",
    ],
    recommendation: "Proceed to portfolio walkthrough and confirm accessibility ownership.",
    recruiterNote: "Review portfolio for accessibility work and end-to-end design ownership.",
  },
  "APP-2086": {
    analysisId: "ATS-3306",
    matchCategory: "Good Match",
    analysisDate: "2026-11-25",
    analysisDateLabel: "25 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Pending",
    failureReason: "Resume v2 uploaded on 24 Nov 2026 is queued for re-analysis against JD v3.",
    coverageStatus: "Moderate Coverage",
    coveragePercent: 84,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 77, evidence: "Strong Node.js and cloud platform skills; React depth appears limited to internal tools." },
      { name: "Relevant Experience", weight: 20, score: 88, evidence: "9 years total experience exceeds the 5–8 year target slightly." },
      { name: "Required Technologies", weight: 15, score: 79, evidence: "TypeScript and AWS evidenced; GraphQL not listed." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 83, evidence: "Strong backend delivery and incident leadership." },
      { name: "Education / Certifications", weight: 5, score: 90, evidence: "B.E. IT + AWS Solutions Architect certification." },
      { name: "Other JD Requirements", weight: 10, score: 74, evidence: "Currently in Chennai with 60-day notice; Bengaluru hybrid relocation unconfirmed." },
    ],
    matchedSkills: [
      { skill: "TypeScript", evidence: "Used TypeScript for Node.js microservices and CLI tooling." },
      { skill: "Node.js", evidence: "Built distributed API services in Node.js." },
      { skill: "AWS", evidence: "Operated EKS, RDS, and CI/CD pipelines on AWS." },
    ],
    partiallyMatchedSkills: [
      { skill: "React", explanation: "Internal admin UI maintenance mentioned; no large-scale consumer React evidence." },
    ],
    missingSkills: ["GraphQL (preferred)"],
    mandatoryCriteria: [
      { criterion: "5–8 years of experience", result: "Met", note: "9 years documented; confirm level alignment." },
      { criterion: "React and TypeScript", result: "Unclear", note: "TypeScript confirmed; React production depth needs recruiter check." },
      { criterion: "Node.js experience", result: "Met", note: "Well documented across recent roles." },
    ],
    experienceComparison: {
      jdRequirement: "5–8 years product engineering",
      resumeEvidence: "9 years backend & cloud engineering (some overlap in dates 2020–2021)",
      status: "Uncertain",
    },
    educationComparison: {
      jdRequirement: "Bachelor's in Computer Science or equivalent",
      resumeEvidence: "B.E. Information Technology",
      status: "Aligned",
    },
    inconsistencies: ["Notice period is 60 days and candidate is currently based in Chennai rather than Bengaluru."],
    screeningQuestions: [
      "What percentage of your recent work involved frontend React architecture vs. cloud/backend services?",
      "Are you open to relocating to Bengaluru for a hybrid work schedule?",
    ],
    recommendation: "Recruiter review recommended; confirm React depth and Bengaluru relocation.",
    recruiterNote: "Explore recent frontend project work and confirm expectations for role level.",
  },
  "APP-2085": {
    analysisId: "ATS-3305",
    matchCategory: "Good Match",
    analysisDate: "2026-11-25",
    analysisDateLabel: "25 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Completed",
    coverageStatus: "High Coverage",
    coveragePercent: 90,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 85, evidence: "Talent acquisition, sourcing, and ATS operations documented." },
      { name: "Relevant Experience", weight: 20, score: 84, evidence: "6 years aligns with 3–6 year contract specialist range." },
      { name: "Required Technologies", weight: 15, score: 78, evidence: "ATS workflow management present; technical sourcing depth needs confirmation." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 74, evidence: "Hiring coordination evidenced; stakeholder escalation examples limited." },
      { name: "Education / Certifications", weight: 5, score: 88, evidence: "MBA in HR and SHRM-CP listed." },
      { name: "Other JD Requirements", weight: 10, score: 72, evidence: "Mumbai on-site compatible; 30-day notice for contract assignment." },
    ],
    matchedSkills: [
      { skill: "Recruitment", evidence: "Managed end-to-end hiring cycles across corporate functions." },
      { skill: "Sourcing", evidence: "LinkedIn Recruiter and boolean sourcing campaigns." },
      { skill: "ATS", evidence: "Maintained structured pipelines and reporting dashboards." },
    ],
    partiallyMatchedSkills: [
      { skill: "Technology hiring", explanation: "General corporate hiring evidenced; engineering-specific sourcing examples limited." },
    ],
    missingSkills: [],
    mandatoryCriteria: [
      { criterion: "3–6 years of recruitment experience", result: "Met", note: "Sample profile indicates 6 years." },
      { criterion: "Sourcing and ATS experience", result: "Met", note: "Both documented in work history." },
      { criterion: "On-site Mumbai contract availability", result: "Unclear", note: "Confirm willingness for 6-month contract terms." },
    ],
    experienceComparison: {
      jdRequirement: "3–6 years talent acquisition",
      resumeEvidence: "6 years across agency and in-house HR roles",
      status: "Aligned",
    },
    educationComparison: {
      jdRequirement: "Bachelor's degree or equivalent",
      resumeEvidence: "MBA Human Resources · SHRM-CP",
      status: "Aligned",
    },
    inconsistencies: ["Confirm whether candidate is open to fixed-term contract engagement rather than permanent."],
    screeningQuestions: [
      "Which technical or specialized IT roles have you independently sourced and closed?",
      "Are you comfortable with an on-site contract assignment in Mumbai?",
    ],
    recommendation: "Continue recruiter screening with focus on technology hiring and contract terms.",
    recruiterNote: "Ask for examples of technical roles filled and stakeholder partnership.",
  },
  "APP-2084": {
    analysisId: "ATS-3304",
    matchCategory: "Good Match",
    analysisDate: "2026-11-24",
    analysisDateLabel: "24 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Completed",
    coverageStatus: "High Coverage",
    coveragePercent: 89,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 82, evidence: "B2B sales, partnerships, and enterprise negotiation documented." },
      { name: "Relevant Experience", weight: 20, score: 84, evidence: "8 years aligns well with 6–10 year expectation." },
      { name: "Required Technologies", weight: 15, score: 75, evidence: "SaaS CRM and pipeline tools evidenced." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 79, evidence: "Client expansion and proposal ownership documented." },
      { name: "Education / Certifications", weight: 5, score: 85, evidence: "BBA degree listed." },
      { name: "Other JD Requirements", weight: 10, score: 70, evidence: "Remote Pune; UK/US evening shift overlap to be confirmed." },
    ],
    matchedSkills: [
      { skill: "B2B sales", evidence: "Closed mid-market and enterprise annual contracts." },
      { skill: "Partnerships", evidence: "Managed channel partner accounts across India." },
      { skill: "Negotiation", evidence: "Led commercial renewals and MSA negotiations." },
    ],
    partiallyMatchedSkills: [
      { skill: "International markets", explanation: "Mostly domestic India B2B accounts; limited UK/US direct closing." },
    ],
    missingSkills: ["UK/US shift timing confirmation"],
    mandatoryCriteria: [
      { criterion: "6–10 years of experience", result: "Met", note: "8 years documented." },
      { criterion: "B2B sales and partnerships", result: "Met", note: "Both evidenced in role summaries." },
      { criterion: "UK/US overlap shift", result: "Unclear", note: "Not explicitly stated in resume." },
    ],
    experienceComparison: {
      jdRequirement: "6–10 years B2B sales",
      resumeEvidence: "8 years in SaaS and consulting sales",
      status: "Aligned",
    },
    educationComparison: {
      jdRequirement: "Bachelor's degree in Business or equivalent",
      resumeEvidence: "BBA · Symbiosis",
      status: "Aligned",
    },
    inconsistencies: ["Domestic vs international territory mix needs verbal clarification."],
    screeningQuestions: [
      "What share of your closed revenue came from UK or North American clients?",
      "Are you comfortable working 1:00 PM – 10:00 PM IST for international overlap?",
    ],
    recommendation: "Advance to recruiter call to verify international quota and shift timing.",
    recruiterNote: "Validate quota ownership, deal size and international account exposure.",
  },
  "APP-2083": {
    analysisId: "ATS-3303",
    matchCategory: "Low Match",
    analysisDate: "2026-11-23",
    analysisDateLabel: "23 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Failed",
    failureReason: "Resume file appears to be an image-based PDF (low extractable text). Manual review required.",
    coverageStatus: "Low Coverage",
    coveragePercent: 31,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 42, evidence: "Only visual design keywords detected from sparse header text." },
      { name: "Relevant Experience", weight: 20, score: 45, evidence: "2 years detected vs 4–7 years required." },
      { name: "Required Technologies", weight: 15, score: 40, evidence: "Figma and prototyping tools not extracted." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 48, evidence: "Insufficient parsed text to verify product discovery." },
      { name: "Education / Certifications", weight: 5, score: 60, evidence: "Education section could not be reliably extracted." },
      { name: "Other JD Requirements", weight: 10, score: 55, evidence: "Located in Delhi NCR vs Mumbai hybrid role." },
    ],
    matchedSkills: [
      { skill: "Visual communication", evidence: "Detected in resume title header." },
    ],
    partiallyMatchedSkills: [
      { skill: "Product design", explanation: "Visual/brand design listed; end-to-end UX product design unclear due to scan quality." },
    ],
    missingSkills: ["Figma", "UX research", "4–7 years experience", "Mumbai hybrid availability"],
    mandatoryCriteria: [
      { criterion: "4–7 years of experience", result: "Not Met", note: "Profile shows ~2 years experience." },
      { criterion: "Product design portfolio", result: "Unclear", note: "No portfolio URL extracted from scanned PDF." },
      { criterion: "UX research experience", result: "Not Met", note: "No UX research evidence found." },
    ],
    experienceComparison: {
      jdRequirement: "4–7 years product design",
      resumeEvidence: "2 years visual/brand design (low text coverage)",
      status: "Gap",
    },
    educationComparison: {
      jdRequirement: "Degree in design, HCI, or related field",
      resumeEvidence: "Not extracted from scanned PDF",
      status: "Gap",
    },
    inconsistencies: [
      "Low text coverage (31%): scanned PDF prevented full automated parsing.",
      "Candidate location (Delhi NCR) differs from Mumbai hybrid requirement.",
    ],
    screeningQuestions: [
      "Can you share a text-selectable resume and portfolio link for manual review?",
    ],
    recommendation: "ATS Failed / Low Coverage — manually inspect original PDF before making any decision.",
    recruiterNote: "Request portfolio and text-readable resume before further consideration.",
  },
  "APP-2082": {
    analysisId: "ATS-3302",
    matchCategory: "Moderate Match",
    analysisDate: "2026-11-22",
    analysisDateLabel: "22 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Completed",
    coverageStatus: "High Coverage",
    coveragePercent: 93,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 58, evidence: "Candidate is primarily software engineering focused rather than UX/UI design." },
      { name: "Relevant Experience", weight: 20, score: 72, evidence: "7 years tech experience, though not in dedicated product design." },
      { name: "Required Technologies", weight: 15, score: 52, evidence: "No Figma or UX research tools evidenced." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 68, evidence: "Collaborated closely with designers on component libraries." },
      { name: "Education / Certifications", weight: 5, score: 75, evidence: "B.Tech CS (engineering rather than design/HCI)." },
      { name: "Other JD Requirements", weight: 10, score: 70, evidence: "Bengaluru based; role requires Mumbai hybrid." },
    ],
    matchedSkills: [
      { skill: "Design systems collaboration", evidence: "Implemented React design-system components alongside designers." },
    ],
    partiallyMatchedSkills: [
      { skill: "Product collaboration", explanation: "Engineering partner to UX team rather than primary product designer." },
    ],
    missingSkills: ["Figma", "UX research", "Product design portfolio"],
    mandatoryCriteria: [
      { criterion: "4–7 years of design experience", result: "Not Met", note: "Experience is software engineering, not product design." },
      { criterion: "Product design portfolio", result: "Not Met", note: "No design portfolio linked." },
      { criterion: "UX research experience", result: "Not Met", note: "Not evidenced in resume." },
    ],
    experienceComparison: {
      jdRequirement: "4–7 years dedicated product design",
      resumeEvidence: "7 years software engineering (applied to adjacent design role)",
      status: "Gap",
    },
    educationComparison: {
      jdRequirement: "Design, HCI, or related discipline",
      resumeEvidence: "B.Tech Computer Science",
      status: "Partial",
    },
    inconsistencies: ["Candidate applied to both Senior Software Engineer (94%) and Product Designer (67%)."],
    screeningQuestions: [
      "Confirm candidate intended to apply for Product Designer rather than Senior Software Engineer.",
    ],
    recommendation: "Hold for Product Designer; prioritize candidate under Senior Software Engineer (APP-2088).",
    recruiterNote: "Check if application to Product Designer was accidental.",
  },
  "APP-2081": {
    analysisId: "ATS-3301",
    matchCategory: "Strong Match",
    analysisDate: "2026-11-21",
    analysisDateLabel: "21 Nov 2026",
    scoringModelVersion: "ATS-Model v1.4",
    analysisStatus: "Completed",
    coverageStatus: "High Coverage",
    coveragePercent: 95,
    categoryBreakdown: [
      { name: "Technical Skills", weight: 35, score: 96, evidence: "AWS, Kubernetes, and Terraform deeply evidenced across 3 infrastructure roles." },
      { name: "Relevant Experience", weight: 20, score: 93, evidence: "9 years matches the 5–9 year requirement." },
      { name: "Required Technologies", weight: 15, score: 92, evidence: "EKS, Terraform modules, and Python automation scripts documented." },
      { name: "Responsibilities / Project Experience", weight: 15, score: 90, evidence: "Led production reliability and incident response playbooks." },
      { name: "Education / Certifications", weight: 5, score: 96, evidence: "B.E. IT and AWS Solutions Architect – Professional." },
      { name: "Other JD Requirements", weight: 10, score: 84, evidence: "Remote India compatible; 60-day notice period." },
    ],
    matchedSkills: [
      { skill: "AWS", evidence: "Architected multi-region VPC, EKS, and IAM workloads." },
      { skill: "Kubernetes", evidence: "Managed 40+ production Kubernetes clusters." },
      { skill: "Terraform", evidence: "Authored reusable Terraform IaC modules across environments." },
      { skill: "Python", evidence: "Automated cloud compliance checks using Python." },
    ],
    partiallyMatchedSkills: [
      { skill: "Observability tooling", explanation: "CloudWatch cited; confirm Prometheus/Grafana/Datadog depth." },
    ],
    missingSkills: [],
    mandatoryCriteria: [
      { criterion: "5–9 years of experience", result: "Met", note: "Sample profile indicates 9 years." },
      { criterion: "AWS and Kubernetes", result: "Met", note: "Both strongly evidenced." },
      { criterion: "Terraform", result: "Met", note: "Production IaC experience documented." },
    ],
    experienceComparison: {
      jdRequirement: "5–9 years cloud infrastructure",
      resumeEvidence: "9 years continuous infrastructure/DevOps experience",
      status: "Aligned",
    },
    educationComparison: {
      jdRequirement: "Bachelor's CS or equivalent + AWS cert (preferred)",
      resumeEvidence: "B.E. IT + AWS Solutions Architect Professional",
      status: "Aligned",
    },
    inconsistencies: [],
    screeningQuestions: [
      "Which observability stack (Datadog, Grafana, OpenTelemetry) have you operated in production?",
      "Is your 60-day notice period negotiable for a contract engagement?",
    ],
    recommendation: "Strong Match — ready when Cloud Infrastructure Engineer (JOB-1038) resumes from On Hold.",
    recruiterNote: "Discuss infrastructure scale, incident response and notice period flexibility.",
  },
};

export const atsReportRecords: readonly AtsReportRecord[] = applicationManagementRecords.map(
  (application) => {
    const details = reportDetails[application.id];
    if (!details) {
      throw new Error(`Missing sample ATS report details for ${application.id}`);
    }
    return { ...application, ...details };
  },
);
