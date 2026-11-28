import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { PlatformSettingsForm } from "@/components/super-admin/platform-settings-form";

export default function SuperAdminSettingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review organization-wide settings and sample platform preferences."
        title="Platform Settings"
      />
      <PlatformSettingsForm />
    </main>
  );
}
