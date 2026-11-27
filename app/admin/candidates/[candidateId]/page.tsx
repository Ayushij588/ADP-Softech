import { notFound } from "next/navigation";
import { candidateManagementRecords } from "@/constants/admin-content";
import { CandidateDetailView } from "@/components/admin/candidate-detail-view";

export function generateStaticParams() {
  return candidateManagementRecords.map((record) => ({ candidateId: record.id }));
}

export default async function CandidateDetailPage({ params }: { params: Promise<{ candidateId: string }> }) {
  const { candidateId } = await params;
  const candidate = candidateManagementRecords.find((record) => record.id === candidateId);
  if (!candidate) notFound();
  return <CandidateDetailView candidate={candidate} />;
}
