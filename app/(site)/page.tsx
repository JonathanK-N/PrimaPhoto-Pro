import Hero from "@/app/components/Hero";
import StorySection from "@/app/components/StorySection";
import ServicesSection from "@/app/components/ServicesSection";
import PortfolioPreview from "@/app/components/PortfolioPreview";
import Testimonials from "@/app/components/Testimonials";
import CTASection from "@/app/components/CTASection";
import { getSettings } from "@/app/lib/settings";
import { getFeaturedPhotos, getApprovedTestimonials, getActiveHeroImage } from "@/app/lib/data";

export default async function Home() {
  const [settings, featuredPhotos, testimonials, heroImage] = await Promise.all([
    getSettings(),
    getFeaturedPhotos(),
    getApprovedTestimonials(),
    getActiveHeroImage(),
  ]);

  return (
    <>
      <Hero
        kicker={settings["hero.kicker"]}
        title={settings["hero.title"]}
        subtitle={settings["hero.subtitle"]}
        backgroundImage={heroImage?.url}
      />
      <StorySection />
      <ServicesSection />
      <PortfolioPreview images={featuredPhotos} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
    </>
  );
}
