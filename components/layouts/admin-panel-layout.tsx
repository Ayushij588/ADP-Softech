"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login" || pathname === "/super-admin/login";

  if (isLoginRoute) {
    return <div className="admin-theme min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="admin-theme min-h-screen bg-white lg:flex">
      <Sidebar
        brandHref={panelName === "Super Admin" ? "/super-admin/dashboard" : "/admin/dashboard"}
        links={navigation}
        panelName={panelName}
      />
      {/* Main content — full width on mobile, fills remaining width on lg+ */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <TopNavbar panelName={panelName} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
