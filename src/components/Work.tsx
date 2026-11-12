import Reveal from "@/components/Reveal";

type CaseStudy = {
  id: string;
  domain: string;
  url: string;
  label: string;
  title: string;
  subtitle: string;
  role: string;
  points: string[];
  track: string;
};

const cases: CaseStudy[] = [
  {
    id: "juusteel",
    domain: "juusteel.com",
    url: "https://www.juusteel.com/",
    label: "Steel · China",
    title: "Juusteel",
    subtitle: "Steel spot big-data platform",
    role: "Platform planning · Information architecture · System design",
    points: [
      "B2B marketplace around spot steel inventory and steel price data",
      "Supplier, procurement and membership flows, built for a large catalogue",
      "Multi-language entry points for an export-oriented audience",
    ],
    track: "work-juusteel",
  },
  {
    id: "juusteel-quote",
    domain: "juusteel.com/quote",
    url: "https://www.juusteel.com/quote/",
    label: "Manufacturing · Quoting",
    title: "Juusteel Quote",
    subtitle: "Drawing-to-quote platform for metal fabrication",
    role: "Product planning · Workflow design · Interface design",
    points: [
      "Upload STEP, IGES, PDF, DWG or DXF part drawings and get a price",
      "Two tracks: instant AI estimate for cut parts, 24-hour human review for the rest",
      "Incoterms (EXW / FCA / FOB), surface finishes, fasteners and 20+ languages",
    ],
    track: "work-juusteel-quote",
  },
  {
    id: "nadclinic",
    domain: "nadclinic.com",
    url: "https://nadclinic.com/",
    label: "Healthcare · UK",
    title: "NADclinic",
    subtitle: "NAD+ longevity and IV therapy clinic",
    role: "Service journey planning · Storefront design",
    points: [
      "Treatment catalogue spanning IV therapies, beauty and weight-loss programmes",
      "Consultation-to-purchase journey with a knowledge base and FAQs",
      "Conversion-focused service pages for a premium clinic brand",
    ],
    track: "work-nadclinic",
  },
];

export default function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36" data-track-section="work">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Selected work</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">
            Platforms our engineers helped plan and design
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            Before building automation systems for clients, our engineers worked on steel trading, industrial quoting and
            regulated healthcare platforms — the same problems of complex workflows, multi-language commerce and
            high-intent lead capture.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {cases.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <article className="glass flex h-full flex-col rounded-3xl p-7 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[var(--line)] bg-[rgba(10,13,17,0.04)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                    {item.label}
                  </span>
                  <span className="text-xs text-[var(--ink-faint)]">{item.domain}</span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--ink)]">{item.title}</h3>
                <p className="mt-1 text-[15px] font-medium text-[var(--ink-dim)]">{item.subtitle}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--accent)]">{item.role}</p>

                <ul className="mt-4 flex-1 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="text-[15px] leading-relaxed text-[var(--ink-faint)]">
                      {point}
                    </li>
                  ))}
                </ul>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] underline underline-offset-4 transition hover:text-[var(--ink)]"
                  data-track-click={item.track}
                >
                  Visit {item.domain}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--ink-faint)]">
            These case studies describe work our engineers contributed to at the planning, system-architecture and
            interface-design level; delivery was run together with each client&apos;s own team.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
