import { notFound } from "next/navigation";
import { applicationManagementRecords } from "@/constants/admin-content";
import { ApplicationDetailView } from "@/components/admin/application-detail-view";

export function generateStaticParams() {
  return applicationManagementRecords.map((application) => ({ applicationId: application.id }));
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params;
  const application = applicationManagementRecords.find((item) => item.id === applicationId);
  if (!application) notFound();
  return <ApplicationDetailView application={application} />;
}
