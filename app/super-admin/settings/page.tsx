import { SettingsGroup } from "@/components/super-admin/settings-group";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

const settingsGroups = [
  {
    title: "Platform profile",
    description: "Basic organization and regional preferences.",
    settings: [
      { label: "Platform name", value: "ADP Softech" },
      { label: "Default time zone", value: "Asia/Kolkata (IST)" },
      { label: "Default language", value: "English (India)" },
    ],
  },
  {
    title: "Security",
    description: "Sample access and session policies.",
    settings: [
      { label: "Multi-factor authentication", value: "Required for admins" },
      { label: "Session timeout", value: "30 minutes" },
      { label: "Password policy", value: "Strong · 12 characters" },
    ],
  },
  {
    title: "Notifications",
    description: "Example platform notification preferences.",
    settings: [
      { label: "Weekly activity summary", value: "Enabled" },
      { label: "Critical system alerts", value: "Enabled" },
      { label: "Recruitment digest", value: "Weekly · Monday" },
    ],
  },
  {
    title: "Support details",
    description: "Sample contact information for platform support.",
    settings: [
      { label: "Support email", value: "support@adpsoftech.example" },
      { label: "Support hours", value: "Monday–Friday · 9 AM–6 PM IST" },
    ],
  },
] as const;

export default function SuperAdminSettingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review organization-wide settings and sample platform preferences."
        title="Platform Settings"
      />
      <div className="mt-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <StatusBadge label="Preview only" tone="info" />
        <p className="text-sm leading-6 text-blue-900">
          Values on this page are illustrative. Settings cannot be changed or
          saved from this demo.
        </p>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {settingsGroups.map((group) => (
          <SettingsGroup
            description={group.description}
            key={group.title}
            settings={group.settings}
            title={group.title}
          />
        ))}
      </div>
    </main>
  );
}
