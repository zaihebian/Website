import type { Metadata } from "next";
import ConsultationProvider from "@/components/ConsultationProvider";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Systems from "@/components/Systems";
import WhyUs from "@/components/WhyUs";
import Work from "@/components/Work";
import IntegrationBand from "@/components/IntegrationBand";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import { VisitorTracker } from "@/components/VisitorTracker";

// The home page is the only route that inherits its metadata from the root
// layout, so it carries the canonical (and the language alternate) itself.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
};

export default function HomePage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <SiteNav />
      <main>
        <Hero />
        <Systems />
        <Statement />
        <WhyUs />
        <Work />
        <IntegrationBand />
        <Contact />
      </main>
      <SiteFooter />
    </ConsultationProvider>
  );
}
