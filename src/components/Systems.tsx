"use client";

import Link from "next/link";
import { BookOpenText, Circuitry, MagnetStraight, Megaphone, type Icon } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";

type System = {
  icon: Icon;
  title: string;
  lead: string;
  desc: string;
  wash?: string;
  /** Optional deep-dive page for a single capability. */
  href?: string;
  linkLabel?: string;
};

type Group = {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  linkLabel: string;
  track: string;
  cards: System[];
};

/**
 * The six capabilities are split along the two bottlenecks they remove: the back
 * office (operations, systems, knowledge) and the customer journey (leads,
 * campaigns, private AI). Each half has its own landing page.
 */
const groups: Group[] = [
  {
    index: "01",
    eyebrow: "Operations",
    title: "The back office: orders, invoices and the systems they run on",
    desc: "Automation layered on what you already run. Nothing migrated, nothing replaced.",
    href: "/solutions/operations",
    linkLabel: "Explore operations",
    track: "systems-operations-link",
    cards: [
      {
        icon: Circuitry,
        title: "Automate operations",
        lead: "Replace repetitive tasks with intelligent workflows.",
        desc: "From customer onboarding to internal processes, we build systems that keep your business moving without manual effort.",
        wash: "radial-gradient(120% 140% at 0% 0%, rgba(13,110,140,0.07), transparent 55%)",
        href: "/solutions/operations",
        linkLabel: "Explore operations",
      },
      {
        icon: BookOpenText,
        title: "Unlock company knowledge",
        lead: "Your business shouldn't depend on who remembers what.",
        desc: "Transform documents, SOPs, and scattered information into an AI-powered knowledge hub your team can access instantly.",
        href: "/solutions/knowledge-hub",
        linkLabel: "Explore knowledge hub",
      },
    ],
  },
  {
    index: "02",
    eyebrow: "Customer journey",
    title: "The front office: leads, campaigns and the handoff to sales",
    desc: "Always-on campaigns, lead routing and a CRM handoff that actually happens.",
    href: "/solutions/customer-journey",
    linkLabel: "Explore customer journey",
    track: "systems-customer-journey-link",
    cards: [
      {
        icon: MagnetStraight,
        title: "Generate more leads",
        lead: "Capture, qualify and follow up in seconds, not days.",
        desc: "Every form, chat and call lands in one place, scored on fit and intent and routed to an owner with a deadline. First reply in under 60 seconds.",
        href: "/solutions/lead-capture",
        linkLabel: "Explore lead capture",
      },
      {
        icon: Megaphone,
        title: "Accelerate marketing",
        lead: "Do more with less.",
        desc: "Launch campaigns faster, automate customer journeys, and keep prospects engaged without increasing workload.",
        wash: "radial-gradient(130% 130% at 100% 100%, rgba(13,110,140,0.065), transparent 55%)",
        href: "/solutions/customer-journey",
        linkLabel: "Explore customer journey",
      },
    ],
  },
];

export default function Systems() {
  return (
    <section id="systems" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36" data-track-section="systems">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">
            Systems that keep your business in motion
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            Two places the hours go: the work behind the business, and the journey in front of it. Both run on systems
            you already own.
          </p>
        </Reveal>

        <div className="mt-14 space-y-16">
          {groups.map((group, groupIndex) => (
            <div key={group.href} className={groupIndex > 0 ? "border-t border-[var(--line)] pt-14" : undefined}>
              <Reveal>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                      {group.index} — {group.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">{group.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{group.desc}</p>
                  </div>
                  <Link href={group.href} className="btn-secondary shrink-0" data-track-click={group.track}>
                    {group.linkLabel}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.cards.map((system, i) => (
                  <Reveal key={system.title} delay={(i % 2) * 0.08}>
                    <article
                      className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:p-8"
                      style={system.wash ? { backgroundImage: system.wash } : undefined}
                    >
                      <system.icon size={28} weight="light" className="text-[var(--accent)]" aria-hidden="true" />
                      <h4 className="mt-6 text-xl font-semibold tracking-tight text-[var(--ink)]">{system.title}</h4>
                      <p className="mt-2 text-[15px] font-medium text-[var(--ink-dim)]">{system.lead}</p>
                      <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">{system.desc}</p>
                      {system.href ? (
                        <Link
                          href={system.href}
                          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(13,110,140,0.4)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[rgba(13,110,140,0.06)]"
                          data-track-click={`systems-card-${system.href.split("/").pop()}`}
                        >
                          {system.linkLabel ?? "Learn more"}
                          <span aria-hidden="true">→</span>
                        </Link>
                      ) : null}
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
