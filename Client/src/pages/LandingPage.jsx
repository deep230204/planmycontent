import Navbar from "../components/Branding/common/Navbar";
import HeroSection from "../components/Branding/landing/HeroSection";
import FeaturesSection from "../components/Branding/landing/FeaturesSection";
import DashboardPreview from "../components/Branding/landing/DashboardPreview";
import Footer from "../components/Branding/common/Footer";

function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <Footer />
    </div>
  );
}

export default LandingPage;
