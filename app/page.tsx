import Hero from "./components/Hero";
import StorySection from "./components/StorySection";
import ServicesSection from "./components/ServicesSection";
import PortfolioPreview from "./components/PortfolioPreview";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <ServicesSection />
      <PortfolioPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
