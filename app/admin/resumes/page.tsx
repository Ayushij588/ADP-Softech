import { ManagementRecordsView } from "@/components/admin/management-records-view";
import {
  resumeManagementColumns,
  resumeManagementRecords,
} from "@/constants/admin-content";

export default function AdminResumesPage() {
  return (
    <ManagementRecordsView
      columns={resumeManagementColumns}
      description="Review sample resume files and their recruitment status."
      eyebrow="Recruitment operations"
      records={resumeManagementRecords}
      searchLabel="Search resumes"
      title="Resume Management"
    />
  );
}
