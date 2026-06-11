"use client";

import {
  BookOpenText,
  Circuitry,
  LockKey,
  MagnetStraight,
  Megaphone,
  Plugs,
  type Icon,
} from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";

type System = {
  icon: Icon;
  title: string;
  lead: string;
  desc: string;
  span: string;
  wash?: string;
};

const systems: System[] = [
  {
    icon: Circuitry,
    title: "Automate operations",
    lead: "Replace repetitive tasks with intelligent workflows.",
    desc: "From customer onboarding to internal processes, we build systems that keep your business moving without manual effort.",
    span: "md:col-span-4",
    wash: "radial-gradient(120% 140% at 0% 0%, rgba(143,205,230,0.10), transparent 55%)",
  },
  {
    icon: MagnetStraight,
    title: "Generate more leads",
    lead: "Turn attention into opportunities.",
    desc: "Automate lead capture, qualification, follow-up, and pipeline management, so no opportunity slips through the cracks.",
    span: "md:col-span-2",
  },
  {
    icon: Megaphone,
    title: "Accelerate marketing",
    lead: "Do more with less.",
    desc: "Launch campaigns faster, automate customer journeys, and keep prospects engaged without increasing workload.",
    span: "md:col-span-3",
  },
  {
    icon: BookOpenText,
    title: "Unlock company knowledge",
    lead: "Your business shouldn't depend on who remembers what.",
    desc: "Transform documents, SOPs, and scattered information into an AI-powered knowledge hub your team can access instantly.",
    span: "md:col-span-3",
    wash: "radial-gradient(130% 130% at 100% 100%, rgba(143,205,230,0.09), transparent 55%)",
  },
  {
    icon: LockKey,
    title: "Deploy private AI",
    lead: "Keep your data where it belongs.",
    desc: "Run powerful AI solutions on your own infrastructure with full control, privacy, and security.",
    span: "md:col-span-2",
  },
  {
    icon: Plugs,
    title: "Connect everything",
    lead: "Your tools should work together.",
    desc: "We integrate systems, automate workflows, and eliminate disconnected processes across your business.",
    span: "md:col-span-4",
    wash: "radial-gradient(110% 150% at 100% 0%, rgba(143,205,230,0.10), transparent 50%)",
  },
];

export default function Systems() {
  return (
    <section id="systems" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">
            Systems that keep your business in motion
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {systems.map((system, i) => (
            <Reveal key={system.title} delay={(i % 3) * 0.08} className={system.span}>
              <article
                className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:p-8"
                style={system.wash ? { backgroundImage: system.wash } : undefined}
              >
                <system.icon size={28} weight="light" className="text-[var(--accent)]" aria-hidden="true" />
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-[var(--ink)]">{system.title}</h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--ink-dim)]">{system.lead}</p>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--ink-faint)]">{system.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
