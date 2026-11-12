import ConsultationProvider from "@/components/ConsultationProvider";
import BackgroundScene from "@/components/BackgroundScene";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Systems from "@/components/Systems";
import WhyUs from "@/components/WhyUs";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import { VisitorTracker } from "@/components/VisitorTracker";

export default function HomePage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <BackgroundScene />
      <SiteNav />
      <main>
        <Hero />
        <Systems />
        <Statement />
        <WhyUs />
        <Contact />
      </main>
      <SiteFooter />
    </ConsultationProvider>
  );
}
