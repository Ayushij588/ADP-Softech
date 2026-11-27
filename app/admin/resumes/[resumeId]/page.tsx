import { notFound } from "next/navigation";
import { resumeManagementRecords } from "@/constants/admin-content";
import { ResumePreviewView } from "@/components/admin/resume-preview-view";

export function generateStaticParams() {
  return resumeManagementRecords.map((record) => ({ resumeId: record.id }));
}

export default async function ResumeDetailPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;
  const resume = resumeManagementRecords.find((record) => record.id === resumeId);
  if (!resume) notFound();
  return <ResumePreviewView resume={resume} />;
}
