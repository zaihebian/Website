import type { ReactNode } from "react";
import Link from "next/link";
import ConsultationProvider from "@/components/ConsultationProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import ConsultationCta from "@/components/ConsultationCta";
import { VisitorTracker } from "@/components/VisitorTracker";

export type SolutionsContent = {
  section: string;
  eyebrow: string;
  title: string;
  sub: string;
  primaryCta: string;
  ctaTracking: string;
  secondary: { label: string; href: string };
  trust: string[];
  aside: ReactNode;
  problems: {
    eyebrow: string;
    heading: string;
    items: { title: string; body: string; change: string }[];
  };
  build: {
    eyebrow: string;
    heading: string;
    note: string;
    items: { title: string; body: string }[];
  };
  how: {
    eyebrow: string;
    heading: string;
    note: string;
    steps: { when: string; title: string; body: string }[];
  };
  band: { heading: string; body: string; chips: string[] };
  cta: { heading: string; body: string; button: string; note: string };
  cross: { label: string; text: string; href: string; linkLabel: string }[];
};

/**
 * Shared layout for the two solution landing pages linked from the home page's
 * Systems section. Both pages follow the same argument: name the cost, show the
 * failure, show what we build, show how a first engagement runs, then prove the
 * guardrails. Only the content objects differ.
 */
export default function SolutionsPage({ content }: { content: SolutionsContent }) {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-36 sm:px-6" data-track-section={content.section}>
        <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-14">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">{content.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tighter text-[var(--ink)] sm:text-4xl lg:text-[2.9rem]">
              {content.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-dim)]">{content.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ConsultationCta label={content.primaryCta} tracking={content.ctaTracking} />
              <Link href={content.secondary.href} className="btn-secondary">
                {content.secondary.label}
              </Link>
            </div>
            <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-[var(--ink-faint)]">
              {content.trust.join(" · ")}
            </p>
          </Reveal>
          <Reveal delay={0.08}>{content.aside}</Reveal>
        </div>

        <section className="mt-24" aria-labelledby="solution-problems">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {content.problems.eyebrow}
            </p>
            <h2
              id="solution-problems"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              {content.problems.heading}
            </h2>
          </Reveal>
          <div className="mt-10 border-t border-[var(--line)]">
            {content.problems.items.map((item, index) => (
              <Reveal key={item.title}>
                <article className="grid gap-4 border-b border-[var(--line)] py-9 lg:grid-cols-[3rem_1fr_1.05fr] lg:gap-10">
                  <span className="font-mono text-sm text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-[var(--ink)]">{item.title}</h3>
                  <div>
                    <p className="text-[15px] leading-relaxed text-[var(--ink-faint)]">{item.body}</p>
                    <div className="mt-5 border-l-2 border-[var(--accent)] pl-4">
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        What changes
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--ink)]">{item.change}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="what" className="mt-24 scroll-mt-28" aria-labelledby="solution-build">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {content.build.eyebrow}
            </p>
            <h2
              id="solution-build"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              {content.build.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-faint)]">{content.build.note}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.build.items.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <span className="font-mono text-xs text-[var(--ink-faint)]">
                    / {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-24" aria-labelledby="solution-how">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">{content.how.eyebrow}</p>
            <h2
              id="solution-how"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              {content.how.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-faint)]">{content.how.note}</p>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.how.steps.map((step, index) => (
              <Reveal key={step.title} delay={(index % 4) * 0.04}>
                <li className="glass h-full rounded-3xl p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    {step.when}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="mt-24" aria-labelledby="solution-band">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-9">
              <h2
                id="solution-band"
                className="max-w-2xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
              >
                {content.band.heading}
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-faint)]">{content.band.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {content.band.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1.5 text-xs font-medium leading-snug text-[var(--ink-dim)]"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section className="mt-24" aria-labelledby="solution-cta">
          <Reveal>
            <div className="glass rounded-3xl p-8 text-center sm:p-12">
              <h2 id="solution-cta" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
                {content.cta.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                {content.cta.body}
              </p>
              <div className="mt-8 flex justify-center">
                <ConsultationCta label={content.cta.button} tracking={`${content.section}-final-cta`} />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-faint)]">{content.cta.note}</p>
            </div>
          </Reveal>
        </section>

        <Reveal>
          <div className={`mt-12 grid gap-3 ${content.cross.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {content.cross.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass group flex items-center justify-between gap-4 rounded-3xl px-6 py-5 transition hover:border-[rgba(13,110,140,0.35)]"
                data-track-click={`${content.section}-cross-${link.href.split("/").pop()}`}
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                    {link.label}
                  </p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-[var(--ink)]">{link.text}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 group-hover:text-[var(--ink)]">
                  {link.linkLabel}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </ConsultationProvider>
  );
}
