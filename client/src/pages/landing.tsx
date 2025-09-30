import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import CTASection from "@/components/cta-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar variant="landing" />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
