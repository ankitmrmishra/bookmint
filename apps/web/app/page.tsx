// import { HeroSection } from "@/components/sections/hero-section";
// import { FeaturesSection } from "@/components/sections/features-section";
// import { EventsSection } from "@/components/sections/events-section";
// import { HowItWorksSection } from "@/components/sections/how-it-works-section";
// import { TestimonialsSection } from "@/components/sections/testimonials-section";
// import { CTASection } from "@/components/sections/cta-section";
import Hero from "./(landingpage)/components/Hero";
import { HowItWorksSection } from "./(landingpage)/components/how-it-works";
import { Navbar } from "./(landingpage)/navbar/page";
// import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen  no-scrollbar">
      <div className="w-[1px] absolute min-h-screen border-r-2 border-dashed border-border -top-10 left-52 hidden md:block" />
      <div className="w-[1px] absolute min-h-screen border-r-2 border-dashed border-border -top-10 right-52 hidden md:block" />
      <Navbar />

      <Hero />
      {/* <HowItWorksSection /> */}
      {/* <main>
        <HeroSection />
        <FeaturesSection />
        <EventsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer /> */}
    </div>
  );
}
