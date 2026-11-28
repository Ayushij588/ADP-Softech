export type PublicJob = {
  id: string;
  jobId: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  skills: readonly string[];
  deadline: string;
  status: "Published" | "Closed";
  summary: string;
  description: string;
  responsibilities: readonly string[];
  requirements: readonly string[];
  skills: readonly string[];
  isPublished: boolean;
  isActive: boolean;
  postedDate: string;
};

export type RecruitmentService = {
  id: string;
  name: string;
  category: "IT & Technology" | "BPO & Operations";
  description: string;
  detail: string;
  features: readonly string[];
  highlighted?: boolean;
};

export const recruitmentServices: readonly RecruitmentService[] = [
  // Core IT & Technology Recruitment Services (from DOCX Section 2.3)
  {
    id: "it-recruitment",
    name: "IT Recruitment",
    category: "IT & Technology",
    description:
      "Connect your engineering teams with vetted software, cloud, data, DevOps, and digital technology specialists.",
    detail: "Full lifecycle sourcing, technical screening, and shortlisting for tech teams.",
    features: [
      "Full-stack and backend developers",
      "Cloud & DevOps infrastructure engineers",
      "Data architects, engineers & AI specialists",
      "Domain-specific technical evaluation",
    ],
    highlighted: true,
  },
  {
    id: "permanent-recruitment",
    name: "Permanent Recruitment",
    category: "IT & Technology",
    description:
      "Find dedicated professionals who align with your long-term roadmap, technical culture, and business vision.",
    detail: "Role-specific talent scouting, culture alignment, and retained search.",
    features: [
      "Rigorous background and career track assessment",
      "Cultural and values compatibility evaluation",
      "Competitive salary benchmarking & negotiation",
      "Executive and senior leadership placement",
    ],
  },
  {
    id: "contract-staffing",
    name: "Contract Staffing",
    category: "IT & Technology",
    description:
      "Build agile, project-based teams with qualified contract resources for fixed-term initiatives and peak workloads.",
    detail: "Responsive staffing support with rapid turnaround for changing project needs.",
    features: [
      "Immediate availability of qualified contractors",
      "Flexible engagement periods (3, 6, 12+ months)",
      "Payroll and compliance management support",
      "Option to convert to permanent employment",
    ],
  },
  {
    id: "offshore-staffing",
    name: "Offshore Staffing",
    category: "IT & Technology",
    description:
      "Extend your development capacity with high-performing offshore engineering talent aligned to your time zone.",
    detail: "Cross-border remote staffing connecting global businesses with talent hubs.",
    features: [
      "Dedicated offshore developers and squads",
      "Overlap with US, UK, Europe, UAE, and APAC hours",
      "Comprehensive infrastructure and security compliance",
      "Up to 60% operational cost optimization",
    ],
  },
  {
    id: "technical-recruitment",
    name: "Technical Recruitment",
    category: "IT & Technology",
    description:
      "Specialized hiring for complex technology stacks, cutting-edge architectures, AI/ML, and generative AI systems.",
    detail: "Deep technical skill verification and problem-solving capability checks.",
    features: [
      "Niche stack screening (AI/ML, Rust, Go, Kubernetes)",
      "Coding portfolio and system design audits",
      "Hands-on architectural interview preparation",
      "Rapid pipeline generation for scarce skills",
    ],
  },
  {
    id: "dedicated-development-teams",
    name: "Dedicated Development Teams",
    category: "IT & Technology",
    description:
      "Assemble end-to-end remote squads tailored to support your digital product roadmaps and strategic software projects.",
    detail: "Cohesive engineering units including architects, developers, QA, and project managers.",
    features: [
      "Custom-assembled squads matched to stack and velocity",
      "Seamless integration with client Jira/Slack/GitHub",
      "Transparent governance, sprints, and deliverable tracking",
      "Scalable team sizing with minimal ramp-up time",
    ],
  },
  {
    id: "talent-acquisition-support",
    name: "Talent Acquisition Support",
    category: "IT & Technology",
    description:
      "Extend your internal HR and recruiting capacity with on-demand talent sourcing, coordination, and pipelining.",
    detail: "Flexible embedded recruitment assistance for high-growth hiring periods.",
    features: [
      "Dedicated sourcing recruiters embedded in your team",
      "Candidate pipeline development and initial touchpoints",
      "Interview coordination and candidate engagement",
      "ATS administration and structured feedback collection",
    ],
  },

  // Additional Approved Business Vertical: BPO Recruitment & Staffing
  {
    id: "bpo-customer-support",
    name: "BPO & Customer Support Hiring",
    category: "BPO & Operations",
    description:
      "Recruit multilingual, customer-centric talent for voice, non-voice, email, and live-chat customer experience centers.",
    detail: "High-volume screening and voice evaluation for 24/7 omnichannel support operations.",
    features: [
      "Voice & accent neutrality assessment",
      "Chat, email & ticketing platform proficiency",
      "Tier-1 and Tier-2 customer service representatives",
      "Rotational shifts and round-the-clock availability",
    ],
  },
  {
    id: "bpo-technical-support",
    name: "BPO Technical Support & Helpdesk",
    category: "BPO & Operations",
    description:
      "Staff specialized IT helpdesk, application troubleshooting, and L1/L2 technical support desks for global enterprises.",
    detail: "Technical aptitude screening combined with high-touch user empathy.",
    features: [
      "Hardware, software, and SaaS application troubleshooting",
      "SLA management and escalation procedure adherence",
      "ITIL framework awareness and ticketing tools (Zendesk, Jira)",
      "Technical customer support team leads and trainers",
    ],
  },
  {
    id: "bpo-operations-international",
    name: "International Process & Operations Hiring",
    category: "BPO & Operations",
    description:
      "Build scalable operations teams for BFSI, healthcare processing, e-commerce cataloging, and international back-office workflows.",
    detail: "Process-driven hiring with compliance, data privacy, and SLA discipline.",
    features: [
      "Claims processing, KYC & verification specialists",
      "Data annotation, catalog management & content moderation",
      "Quality assurance and process compliance managers",
      "Scalable ramp-up for international seasonal surges",
    ],
  },
] as const;

export const openPositions: readonly PublicJob[] = [
  {
    id: "senior-software-engineer",
    jobId: "ADP-JD-1001",
    title: "Senior Software Engineer",
    department: "Technology",
    location: "Bengaluru, India",
    employmentType: "Full-time",
    workMode: "Hybrid",
    experience: "5-8 years",
    skills: ["React", "TypeScript", "Node.js"],
    deadline: "15 Dec 2026",
    status: "Published",
    summary:
      "Lead frontend architecture and scalable microservices for a high-traffic fintech platform.",
    description:
      "We are seeking an experienced Full-Stack Engineer with strong expertise in Next.js, React, Node.js, and cloud deployments. You will collaborate closely with product management and systems architects to deliver robust, high-performance customer-facing features. This listing represents an active client recruitment mandate managed by ADP Softech.",
    responsibilities: [
      "Architect and implement modern frontend interfaces using Next.js and TypeScript.",
      "Develop secure, RESTful and GraphQL backend microservices in Node.js.",
      "Conduct thorough code reviews and mentor junior engineering colleagues.",
      "Collaborate with DevOps teams on CI/CD pipelines and Kubernetes container deployments.",
      "Ensure high test coverage through unit and end-to-end automated testing.",
    ],
    requirements: [
      "5+ years of production experience in React, TypeScript, and Node.js.",
      "Strong understanding of state management, SSR/SSG patterns, and web performance optimization.",
      "Experience with relational (PostgreSQL) and NoSQL (MongoDB) databases.",
      "Solid foundation in software architecture and distributed systems.",
      "Bachelor's or Master's degree in Computer Science or equivalent practical experience.",
    ],
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
    isPublished: true,
    isActive: true,
    postedDate: "2026-11-20",
  },
  {
    id: "talent-acquisition-specialist",
    jobId: "ADP-JD-1002",
    title: "Talent Acquisition Specialist",
    department: "People & Culture",
    location: "Mumbai, India",
    employmentType: "Full-time",
    workMode: "On-site",
    experience: "3-6 years",
    skills: ["Recruitment", "Sourcing", "HR"],
    deadline: "12 Dec 2026",
    status: "Published",
    summary:
      "Lead international voice and non-voice operations delivering premium client SLAs.",
    description:
      "ADP Softech is recruiting an Operations Manager for an established global BPO services partner. You will lead team leaders and front-line agents handling high-complexity customer accounts for North American and European clients.",
    responsibilities: [
      "Direct daily operations of 150+ international voice and digital customer experience staff.",
      "Drive stringent SLA compliance including CSAT, FCR, AHT, and quality scorecards.",
      "Interface directly with overseas client stakeholders during weekly operational reviews.",
      "Oversee workforce planning, roster management, attrition reduction, and upskilling.",
      "Implement process improvement initiatives using Six Sigma or Lean methodologies.",
    ],
    requirements: [
      "6+ years of operational leadership in international BPO/ITeS environments.",
      "Proven experience managing large voice or omnichannel customer operations.",
      "Exceptional verbal and written communication with overseas stakeholder management.",
      "Deep understanding of contact center metrics, workforce management, and QA frameworks.",
      "Graduate or Postgraduate degree in Business, Management, or related field.",
    ],
    skills: ["Operations Management", "SLA Delivery", "BPO", "Workforce Management", "CSAT", "Team Leadership"],
    isPublished: true,
    isActive: true,
    postedDate: "2026-11-24",
  },
  {
    id: "business-development-manager",
    jobId: "ADP-JD-1003",
    title: "Business Development Manager",
    department: "Sales",
    location: "Pune, India",
    employmentType: "Full-time",
    workMode: "Hybrid",
    experience: "6-10 years",
    skills: ["Sales", "Partnerships", "SaaS"],
    deadline: "20 Dec 2026",
    status: "Published",
    summary:
      "Implement generative AI pipelines, embedding search, and fine-tuned LLM agents.",
    description:
      "Help a high-growth technology client develop production AI features. You will build retrieval-augmented generation (RAG) systems, prompt evaluation pipelines, and fine-tune models for enterprise domain tasks.",
    responsibilities: [
      "Develop and deploy RAG systems using vector databases and modern LLM APIs.",
      "Implement automated evaluation benchmarks for prompt accuracy and hallucination reduction.",
      "Optimize embedding models and vector indexing for low-latency similarity search.",
      "Integrate AI services securely with existing enterprise APIs and data repositories.",
      "Stay current with research in agentic workflows, function calling, and model distillation.",
    ],
    requirements: [
      "3+ years of programming in Python with PyTorch, LangChain, LlamaIndex, or Hugging Face.",
      "Hands-on experience deploying transformer models and LLM integrations in production.",
      "Understanding of vector stores (Pinecone, Qdrant, Milvus, pgvector).",
      "Solid knowledge of linear algebra, probability, and machine learning fundamentals.",
      "Experience with Docker and scalable cloud microservice deployment.",
    ],
    skills: ["Python", "Machine Learning", "LLMs", "RAG", "LangChain", "Vector DBs", "Docker"],
    isPublished: true,
    isActive: true,
    postedDate: "2026-11-25",
  },
] as const;

export function getAllPublishedJobs(): readonly PublicJob[] {
  return openPositions.filter((job) => job.isPublished && job.isActive);
}

export function getJobById(jobId: string): PublicJob | undefined {
  const normalized = jobId.trim().toLowerCase();
  return openPositions.find(
    (job) =>
      job.id.toLowerCase() === normalized ||
      job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized
  );
}

export function isValidJobId(jobId: string): boolean {
  return Boolean(getJobById(jobId));
}
