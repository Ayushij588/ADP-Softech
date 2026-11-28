import { notFound } from "next/navigation";
import { AtsReportDetailView } from "@/components/admin/ats-report-detail-view";
import { atsReportRecords } from "@/constants/ats-reports";

export function generateStaticParams() {
  return atsReportRecords.map((report) => ({ applicationId: report.id }));
}

export default async function AtsDetailPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params;
  const report = atsReportRecords.find((record) => record.id === applicationId);
  if (!report) notFound();
  return <AtsReportDetailView report={report} />;
}
