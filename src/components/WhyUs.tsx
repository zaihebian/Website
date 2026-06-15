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

export default function WhyUs() {
  return (
    <section id="why" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36" data-track-section="why-us">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">
                AI is easy. Solving business problems is hard.
              </h2>
              <p className="mt-5 text-lg text-[var(--ink-dim)]">That&apos;s where we come in.</p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-col gap-12 lg:mt-8">
              {principles.map((principle, i) => (
                <Reveal key={principle.title} delay={i * 0.06}>
                  <div className={i % 2 === 1 ? "lg:pl-16" : ""}>
                    <h3 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">{principle.title}</h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--ink-dim)]">{principle.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
