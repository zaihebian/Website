import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Slim cross-link band under Selected work that funnels home-page visitors into the
 * Integration & RPA page. One link, so the whole strip is keyboard- and tap-friendly.
 */
export default function IntegrationBand() {
  return (
    <section className="relative px-4 sm:px-6" data-track-section="integration-band">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Link
            href="/solutions/integration"
            data-track-click="home-integration-banner"
            className="glass group -mt-12 flex flex-col items-start justify-between gap-2 rounded-3xl px-5 py-4 transition hover:border-[rgba(13,110,140,0.35)] sm:-mt-16 sm:flex-row sm:items-center sm:gap-3 sm:px-8 sm:py-5"
          >
            <p className="text-[15px] font-medium leading-snug text-[var(--ink)] sm:text-base">
              Have a system you can&apos;t replace?
              <span className="mt-0.5 block font-normal leading-snug text-[var(--ink-dim)] sm:mt-0 sm:ml-2 sm:inline">
                We connect WhatsApp, Teams and web forms to it — without a migration.
              </span>
            </p>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 group-hover:text-[var(--ink)]">
              Integration &amp; RPA
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
