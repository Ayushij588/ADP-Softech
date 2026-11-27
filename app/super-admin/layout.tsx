import type { ReactNode } from "react";
import { AdminPanelLayout } from "@/components/layouts/admin-panel-layout";
import { ToastProvider } from "@/components/ui/toast";
import type { NavigationLink } from "@/components/ui/navigation-link";

const navigation: NavigationLink[] = [
  { href: "/super-admin/dashboard", label: "Dashboard" },
  { href: "/super-admin/users", label: "Users" },
  { href: "/super-admin/roles", label: "Roles" },
  { href: "/super-admin/settings", label: "Settings" },
  { href: "/super-admin/website-content", label: "Website content" },
  { href: "/super-admin/ats-settings", label: "ATS settings" },
  { href: "/super-admin/audit-logs", label: "Audit logs" },
];

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminPanelLayout navigation={navigation} panelName="Super Admin">
        {children}
      </AdminPanelLayout>
    </ToastProvider>
  );
}
