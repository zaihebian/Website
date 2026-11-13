import Reveal from "@/components/Reveal";

const principles = [
  {
    title: "We focus on outcomes",
    desc: "Less manual work. Faster execution. Better decisions.",
  },
  {
    title: "We build around your business",
    desc: "No generic templates. No unnecessary complexity.",
  },
  {
    title: "We deliver real automation",
    desc: "Not demos. Not experiments. Production-ready systems that create value from day one.",
  },
  {
    title: "We think long-term",
    desc: "Technology changes fast. We build solutions that grow with your business.",
  },
];

/**
 * Deliberately the quietest band on the page: the claim is a summary, not a
 * feature, so it sits in one short strip instead of a full-viewport section.
 */
export default function WhyUs() {
  return (
    <section id="why" className="relative scroll-mt-20 px-4 py-14 sm:px-6 lg:py-16" data-track-section="why-us">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-16">
          <Reveal>
            <h2 className="max-w-sm text-2xl font-semibold leading-[1.12] tracking-tighter text-[var(--ink)] sm:text-[1.75rem]">
              AI is easy. Solving business problems is hard.
            </h2>
            <p className="mt-3 text-[15px] leading-snug tracking-tight text-[var(--ink-dim)]">
              That&apos;s where we come in.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.04}>
                <div className="border-t border-[var(--line)] pt-3">
                  <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-[var(--ink)]">
                    {principle.title}
                  </h3>
                  <p className="mt-1 max-w-sm text-[13.5px] leading-snug tracking-tight text-[var(--ink-faint)]">
                    {principle.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
