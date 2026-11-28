import { HeroSection } from "@/components/public/HeroSection";
import { CompactStats } from "@/components/public/CompactStats";
import { AboutAndServicesSection } from "@/components/public/AboutAndServicesSection";
import { EmployerCTA } from "@/components/public/EmployerCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero Section with Four Overlapping Professional Portrait Cards */}
      <HeroSection />

      {/* 2. Compact Statistics Panel */}
      <CompactStats />

      {/* 3. About ADP Softech & Our Services (Three Main Cards) */}
      <AboutAndServicesSection />

      {/* 4. Employer Call to Action Banner */}
      <EmployerCTA />
    </div>
  );
}
