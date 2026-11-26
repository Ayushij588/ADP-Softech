import type { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import type { NavigationLink } from "@/components/ui/navigation-link";
import { TopNavbar } from "@/components/ui/top-navbar";

type AdminPanelLayoutProps = {
  children: ReactNode;
  navigation: readonly NavigationLink[];
  panelName: string;
};

export function AdminPanelLayout({
  children,
  navigation,
  panelName,
}: AdminPanelLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar links={navigation} panelName={panelName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar panelName={panelName} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
