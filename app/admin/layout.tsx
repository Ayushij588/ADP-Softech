import type { ReactNode } from "react";
import { AdminPanelLayout } from "@/components/layouts/admin-panel-layout";
import { ToastProvider } from "@/components/ui/toast";
import type { NavigationLink } from "@/components/ui/navigation-link";

const navigation: NavigationLink[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/resumes", label: "Resumes" },
  { href: "/admin/ats", label: "ATS" },
  { href: "/admin/reports", label: "Reports" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminPanelLayout navigation={navigation} panelName="Recruitment Admin">
        {children}
      </AdminPanelLayout>
    </ToastProvider>
  );
}
