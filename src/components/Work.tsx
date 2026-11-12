import Reveal from "@/components/Reveal";

type CaseLink = {
  label: string;
  url: string;
  track: string;
};

type CaseStudy = {
  id: string;
  domain: string;
  label: string;
  title: string;
  subtitle: string;
  role: string;
  points: string[];
  links: CaseLink[];
};

const cases: CaseStudy[] = [
  {
    id: "clinicdesk",
    domain: "clinicdesk.liqentech.com",
    label: "Our product · Clinics",
    title: "ClinicDesk",
    subtitle: "WhatsApp booking assistant for clinics",
    role: "Product design · Conversation design · Full-stack build",
    points: [
      "Patients book, reschedule and ask FAQs inside WhatsApp — no app install",
      "Calendar-aware scheduling with reminders, multi-clinic and multi-clinician support",
      "Built for UK and Irish clinics, hosted in-region with GDPR-first data handling",
    ],
    links: [
      { label: "Product overview", url: "https://clinicdesk.liqentech.com/", track: "work-clinicdesk" },
      { label: "Try the live demo", url: "https://book.liqentech.com/", track: "work-clinicdesk-demo" },
    ],
  },
  {
    id: "juusteel",
    domain: "juusteel.com",
    label: "Steel · China",
    title: "Juusteel",
    subtitle: "Steel spot big-data platform",
    role: "Platform planning · Information architecture · System design",
    points: [
      "B2B marketplace around spot steel inventory and steel price data",
      "Supplier, procurement and membership flows, built for a large catalogue",
      "Multi-language entry points for an export-oriented audience",
    ],
    links: [{ label: "Visit juusteel.com", url: "https://www.juusteel.com/", track: "work-juusteel" }],
  },
  {
    id: "juusteel-quote",
    domain: "juusteel.com/quote",
    label: "Manufacturing · Quoting",
    title: "Juusteel Quote",
    subtitle: "Drawing-to-quote platform for metal fabrication",
    role: "Product planning · Workflow design · Interface design",
    points: [
      "Upload STEP, IGES, PDF, DWG or DXF part drawings and get a price",
      "Two tracks: instant AI estimate for cut parts, 24-hour human review for the rest",
      "Incoterms (EXW / FCA / FOB), surface finishes, fasteners and 20+ languages",
    ],
    links: [{ label: "Visit the quote platform", url: "https://www.juusteel.com/quote/", track: "work-juusteel-quote" }],
  },
  {
    id: "nadclinic",
    domain: "nadclinic.com",
    label: "Healthcare · UK",
    title: "NADclinic",
    subtitle: "NAD+ longevity and IV therapy clinic",
    role: "Service journey planning · Storefront design",
    points: [
      "Treatment catalogue spanning IV therapies, beauty and weight-loss programmes",
      "Consultation-to-purchase journey with a knowledge base and FAQs",
      "Conversion-focused service pages for a premium clinic brand",
    ],
    links: [{ label: "Visit nadclinic.com", url: "https://nadclinic.com/", track: "work-nadclinic" }],
  },
];

export default function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36" data-track-section="work">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Selected work</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">
            Products and platforms our team planned, designed or built
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            ClinicDesk is our own product and you can try it live. The rest are client platforms where our engineers
            contributed planning, architecture and interface design — the same problems of complex workflows,
            multi-language commerce and high-intent lead capture.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {cases.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.06}>
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

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {item.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] underline underline-offset-4 transition hover:text-[var(--ink)]"
                      data-track-click={link.track}
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--ink-faint)]">
            For client platforms, these case studies describe work our engineers contributed to at the planning,
            system-architecture and interface-design level; delivery was run together with each client&apos;s own team.
            ClinicDesk is designed and built in-house.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
