export type PublicJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  summary: string;
  description: string;
  responsibilities: readonly string[];
  requirements: readonly string[];
};

export const recruitmentServices = [
  {
    name: "IT Recruitment",
    description:
      "Connect your technology teams with skilled professionals across software, infrastructure, data, and digital roles.",
    detail: "Technology talent sourcing and recruitment",
  },
  {
    name: "Permanent Recruitment",
    description:
      "Find experienced professionals who can make a lasting contribution to your team.",
    detail: "Role-specific sourcing, assessment, and shortlisting",
  },
  {
    name: "Contract Staffing",
    description:
      "Build flexible project teams with skilled contract professionals.",
    detail: "Responsive support for changing workforce needs",
  },
  {
    name: "Offshore Staffing",
    description:
      "Build distributed teams with talent aligned to your delivery needs and ways of working.",
    detail: "Offshore talent sourcing and team coordination",
  },
  {
    name: "Dedicated Development Teams",
    description:
      "Bring together dedicated development professionals to support your product and project roadmap.",
    detail: "Dedicated engineering team recruitment",
  },
  {
    name: "Talent Acquisition Support",
    description:
      "Extend your hiring capacity with practical support across sourcing, coordination, and candidate engagement.",
    detail: "Flexible support for internal hiring teams",
  },
] as const;

export const openPositions: readonly PublicJob[] = [
  {
    id: "senior-software-engineer",
    title: "Senior Software Engineer",
    department: "Technology",
    location: "Bengaluru, India",
    employmentType: "Full-time",
    workMode: "Hybrid",
    summary:
      "Help a product engineering team build reliable digital experiences at scale.",
    description:
      "Our client is looking for a thoughtful engineer to collaborate across product, design, and technology. This sample listing represents the kind of specialist opportunities supported by ADP Softech.",
    responsibilities: [
      "Design and deliver maintainable software with a cross-functional team.",
      "Review code and share engineering practices with colleagues.",
      "Contribute to technical planning and ongoing product improvement.",
    ],
    requirements: [
      "Professional experience building production software.",
      "Strong communication and collaborative problem-solving skills.",
      "A quality-focused approach to testing and delivery.",
    ],
  },
  {
    id: "talent-acquisition-specialist",
    title: "Talent Acquisition Specialist",
    department: "People & Culture",
    location: "Mumbai, India",
    employmentType: "Contract",
    workMode: "On-site",
    summary:
      "Create a thoughtful candidate experience while supporting a growing team.",
    description:
      "Support end-to-end hiring for a growing organization on a contract assignment. You will work closely with hiring teams to understand role needs, engage talent, and keep candidates informed throughout the process.",
    responsibilities: [
      "Coordinate recruitment activities with hiring managers.",
      "Build candidate pipelines and maintain clear communication.",
      "Support interviews, feedback, and hiring documentation.",
    ],
    requirements: [
      "Experience supporting recruitment or talent acquisition.",
      "Organized, people-first communication style.",
      "Comfort working with multiple roles and stakeholders.",
    ],
  },
  {
    id: "business-development-manager",
    title: "Business Development Manager",
    department: "Sales",
    location: "Pune, India",
    employmentType: "Full-time",
    workMode: "Hybrid",
    summary:
      "Build trusted client relationships and identify opportunities for growth.",
    description:
      "A growing professional services team is seeking a relationship-focused business development manager to understand client priorities and develop long-term partnerships.",
    responsibilities: [
      "Develop and maintain relationships with prospective clients.",
      "Understand business needs and coordinate suitable proposals.",
      "Work with internal teams to support a consistent client experience.",
    ],
    requirements: [
      "Experience in business development or client partnerships.",
      "Clear presentation, listening, and negotiation skills.",
      "A practical, customer-focused approach to growth.",
    ],
  },
] as const;
