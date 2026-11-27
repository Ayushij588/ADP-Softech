import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ADP Softech | IT Recruitment & Offshore Staffing",
    template: "%s | ADP Softech",
  },
  description:
    "End-to-end IT recruitment and offshore staffing solutions that help you hire skilled talent, build high-performing teams, and scale faster.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
