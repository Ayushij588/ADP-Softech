import { ManagementRecordsView } from "@/components/admin/management-records-view";
import {
  candidateManagementColumns,
  candidateManagementRecords,
} from "@/constants/admin-content";

export default function AdminCandidatesPage() {
  return (
    <ManagementRecordsView
      columns={candidateManagementColumns}
      description="Browse candidate profiles and sample recruitment statuses."
      eyebrow="Recruitment operations"
      records={candidateManagementRecords}
      searchLabel="Search candidates"
      title="Candidates Management"
    />
  );
}
