import type { ReactNode } from "react";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navbar";

type PublicSiteLayoutProps = {
  children: ReactNode;
};

const publicLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/employers", label: "Employers" },
  { href: "/contact", label: "Contact" },
];

export function PublicSiteLayout({ children }: PublicSiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar links={publicLinks} />
      <div className="flex-1">{children}</div>
      <Footer
        links={[
          { href: "/privacy-policy", label: "Privacy policy" },
          { href: "/terms", label: "Terms" },
        ]}
      />
    </div>
  );
}
