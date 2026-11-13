import type { Metadata } from "next";
import Link from "next/link";
import ConsultationProvider from "@/components/ConsultationProvider";
import StaticBackdrop from "@/components/StaticBackdrop";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import ConsultationCta from "@/components/ConsultationCta";
import { VisitorTracker } from "@/components/VisitorTracker";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Three ways into the work: operations automation for the back office, customer journey automation for marketing and sales, and lead capture for the 72 hours after a form fill.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Solutions — LiqenTech",
    description:
      "Operations automation, customer journey automation and lead capture — three ways into the work, all built on the systems you already run.",
    url: `${SITE_URL}/solutions`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solutions — LiqenTech",
    description:
      "Operations automation, customer journey automation and lead capture — three ways into the work, all built on the systems you already run.",
  },
};

const tracks = [
  {
    href: "/solutions/operations",
    title: "Operations automation",
    lead: "The back office: orders, invoices and the systems they run on.",
    desc: "Orders, invoices, master data, reports: the work that still moves by hand between systems that were never built to talk.",
    points: ["Nothing migrated, nothing replaced", "Interface-level automation where there is no API", "IT-approved guardrails and an audit log"],
    linkLabel: "Operations automation",
  },
  {
    href: "/solutions/customer-journey",
    title: "Customer journey automation",
    lead: "The front office: leads, campaigns and the handoff to sales.",
    desc: "From the first form fill to renewal, we build the always-on campaigns that move every lead forward — then stay to run them with you.",
    points: ["Behaviour-driven segments and scoring", "Multi-step journeys and CRM sync", "Self-hosted by default, no lock-in"],
    linkLabel: "Customer journey",
  },
  {
    href: "/solutions/lead-capture",
    title: "Lead capture & follow-up",
    lead: "The 72 hours after a form fill.",
    desc: "Capture, qualify, follow up and hand off — automated end to end, so nothing waits in an inbox and every stage has a number attached to it.",
    points: ["First reply under 60 seconds", "Every lead has an owner and a deadline", "Monthly numbers published, not claimed"],
    linkLabel: "Lead capture",
  },
];

export default function SolutionsPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <StaticBackdrop />
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-36 sm:px-6" data-track-section="solutions">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Solutions</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tighter text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Pick the bottleneck.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            Most of the lost hours sit in one of two places: the back office, or the journey from form fill to renewal.
            Start with the one that hurts.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {tracks.map((track, index) => (
            <Reveal key={track.href} delay={index * 0.06}>
              <article className="glass flex h-full flex-col rounded-3xl p-7">
                <span className="font-mono text-xs text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-[var(--ink)]">{track.title}</h2>
                <p className="mt-2 text-[15px] font-medium leading-snug text-[var(--ink-dim)]">{track.lead}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">{track.desc}</p>
                <ul className="mt-5 space-y-2">
                  {track.points.map((point) => (
                    <li key={point} className="flex gap-2 text-[13.5px] leading-snug text-[var(--ink-faint)]">
                      <span aria-hidden="true" className="mt-0.5 text-[var(--accent)]">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={track.href}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 transition hover:text-[var(--ink)]"
                  data-track-click={`solutions-${track.href.split("/").pop()}`}
                >
                  Learn more
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-[15px] leading-relaxed text-[var(--ink-faint)]">
            Have a system you cannot replace?{" "}
            <Link
              href="/integration"
              className="font-semibold text-[var(--accent)] underline underline-offset-4 transition hover:text-[var(--ink)]"
            >
              Integration &amp; RPA
            </Link>{" "}
            is the fourth way in.
          </p>
        </Reveal>

        <section className="mt-20" aria-labelledby="solutions-cta">
          <Reveal>
            <div className="glass rounded-3xl p-8 text-center sm:p-12">
              <h2 id="solutions-cta" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
                Not sure which one you need?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                Bring one process or one funnel. In thirty minutes we will point at the first place automation pays for
                itself — and say so plainly if it does not.
              </p>
              <div className="mt-8 flex justify-center">
                <ConsultationCta label="Book a 30-minute review" tracking="solutions-final-cta" />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </ConsultationProvider>
  );
}
