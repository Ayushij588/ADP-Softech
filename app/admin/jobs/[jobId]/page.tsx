import { notFound } from "next/navigation";
import { JobDetailView } from "@/components/admin/job-detail-view";
import { jobManagementRecords } from "@/constants/admin-content";

export function generateStaticParams() {
  return jobManagementRecords.map((record) => ({ jobId: record.id }));
}

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = jobManagementRecords.find((record) => record.id === jobId);
  if (!job) notFound();

  return <JobDetailView initialJob={job} />;
}
