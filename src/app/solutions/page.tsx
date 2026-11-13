import type { Metadata } from "next";
import Link from "next/link";
import ConsultationProvider from "@/components/ConsultationProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import ConsultationCta from "@/components/ConsultationCta";
import { VisitorTracker } from "@/components/VisitorTracker";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Five ways into the work: operations automation for the back office, customer journey automation, lead capture for the 72 hours after a form fill, a private knowledge hub, and integration for the systems you cannot replace.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Solutions — LiqenTech",
    description:
      "Operations automation, customer journey automation, lead capture, a private knowledge hub and Integration & RPA — five ways into the work, all built on the systems you already run.",
    url: `${SITE_URL}/solutions`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solutions — LiqenTech",
    description:
      "Operations automation, customer journey automation, lead capture, a private knowledge hub and Integration & RPA — five ways into the work, all built on the systems you already run.",
  },
};

const tracks = [
  {
    href: "/solutions/operations",
    title: "Operations automation",
    lead: "The back office: orders, invoices and the systems they run on.",
    desc: "Orders, invoices, master data, reports: the work that still moves by hand between systems that were never built to talk.",
    points: ["Nothing migrated, nothing replaced", "Interface-level automation where there is no API", "IT-approved guardrails and an audit log"],
    linkLabel: "Explore operations",
  },
  {
    href: "/solutions/customer-journey",
    title: "Customer journey automation",
    lead: "The front office: leads, campaigns and the handoff to sales.",
    desc: "From the first form fill to renewal, we build the always-on campaigns that move every lead forward — then stay to run them with you.",
    points: ["Behaviour-driven segments and scoring", "Multi-step journeys and CRM sync", "Self-hosted by default, no lock-in"],
    linkLabel: "Explore customer journey",
  },
  {
    href: "/solutions/lead-capture",
    title: "Lead capture & follow-up",
    lead: "The 72 hours after a form fill.",
    desc: "Capture, qualify, follow up and hand off — automated end to end, so nothing waits in an inbox and every stage has a number attached to it.",
    points: ["First reply under 60 seconds", "Every lead has an owner and a deadline", "Monthly numbers published, not claimed"],
    linkLabel: "Explore lead capture",
  },
  {
    href: "/solutions/knowledge-hub",
    title: "Private knowledge hub",
    lead: "The answer is in a document somewhere.",
    desc: "Your documents, procedures and hard-won know-how in a private hub on your own hardware: plain-English questions, answers with sources, nothing leaves the building.",
    points: ["Permissions enforced before the answer is written", "Works with the internet unplugged", "Files stay in their own formats"],
    linkLabel: "Explore knowledge hub",
  },
  {
    href: "/solutions/integration",
    title: "Integration & RPA",
    lead: "The system that will never have an API.",
    desc: "WhatsApp, Teams, email and web forms connected to the software you cannot replace: Power Automate cloud flows and desktop flows layered on top, with no migration.",
    points: ["Desktop flows operate the legacy client as-is", "Connectors, Power BI and AI Builder on top", "On-premises data gateway for records that stay inside"],
    linkLabel: "Explore integration",
  },
];

export default function SolutionsPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-36 sm:px-6" data-track-section="solutions">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Solutions</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-tighter text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Pick the bottleneck.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            Five ways in: the back office, the customer journey, the 72 hours after a form fill, the know-how nobody
            wrote down, and the system you cannot replace. Start with the one that hurts.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {tracks.map((track, index) => (
            <Reveal
              key={track.href}
              delay={(index % 2) * 0.06}
              className={index === tracks.length - 1 && tracks.length % 2 === 1 ? "sm:col-span-2" : undefined}
            >
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
                  {track.linkLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

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
