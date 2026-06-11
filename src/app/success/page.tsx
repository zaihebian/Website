import Link from "next/link";
import ConsultationProvider from "@/components/ConsultationProvider";
import FluidScene from "@/components/FluidScene";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function SuccessPage() {
  return (
    <ConsultationProvider>
      <FluidScene />
      <SiteNav />
      <main className="flex min-h-[100dvh] items-center justify-center px-4 pt-16 sm:px-6">
        <div className="glass w-full max-w-xl rounded-3xl p-8 text-center sm:p-12">
          <h1 className="text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-4xl">Thank you</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--ink-dim)]">
            Your enquiry has been submitted. We will get back to you within one business day.
          </p>
          <div className="mt-10">
            <Link href="/" className="btn-primary">
              Return to home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </ConsultationProvider>
  );
}
