import type { Metadata } from "next";
import Link from "next/link";
import ConsultationProvider from "@/components/ConsultationProvider";
import StaticBackdrop from "@/components/StaticBackdrop";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import ConsultationCta from "@/components/ConsultationCta";
import { VisitorTracker } from "@/components/VisitorTracker";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Integration & RPA",
  description:
    "Legacy software can't be replaced overnight — and it doesn't have to be. Microsoft Power Automate cloud flows, desktop flows (RPA), connectors and AI layered onto the systems you already run: WhatsApp, Teams and web forms connected without a migration.",
  alternates: { canonical: "/integration" },
  openGraph: {
    title: "Integration & RPA — LiqenTech",
    description:
      "Don't rip and replace. Teach your legacy system new tricks: Power Automate automation, integration and AI on top of the systems clinics, manufacturers and public bodies already run.",
    url: `${SITE_URL}/integration`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Integration & RPA — LiqenTech",
    description:
      "Don't rip and replace. Teach your legacy system new tricks: Power Automate automation, integration and AI on top of the systems your business already runs.",
  },
};

const replacementCosts = [
  {
    label: "Downtime windows",
    note: "The business stops while the migration runs.",
  },
  {
    label: "Data migration",
    note: "Every record, attachment and exception, moved and re-checked.",
  },
  {
    label: "Retraining every employee",
    note: "A new interface for every person who touches the system.",
  },
  {
    label: "Rebuilding processes from scratch",
    note: "Processes that took years to settle, rebuilt and re-tuned in production.",
  },
];

const symptoms = [
  "The same data entered three times across three systems",
  "Reports stitched together by hand",
  "Legacy clients with no API",
  "New tools that can't get in the door",
  "Systems sitting behind a wall from one another",
];

const gaps = [
  {
    title: "Replacement is a programme, not a purchase",
    body: "A patient record system, ERP or case-management platform is the system of record. Replacing it means years of migration risk, retraining and downtime.",
  },
  {
    title: "New channels arrive faster than vendors ship",
    body: "Patients and customers expect WhatsApp, email, web forms and Teams. Legacy software only speaks its own screens.",
  },
  {
    title: "The glue is manual",
    body: "Staff re-key data, print, scan and chase approvals. It works until someone is on leave — then it fails quietly.",
  },
];

const capabilities = [
  {
    title: "Connect the channel",
    body: "WhatsApp Business via the Meta Cloud API, email, web forms and Microsoft Teams, connected to the system you already run. An incoming message becomes a record; a record produces a reply.",
  },
  {
    title: "Cloud flows",
    body: "Where APIs exist: scheduled syncs, document intake, notifications and approval routing — built to run unattended, monitored and documented.",
  },
  {
    title: "Desktop flows (RPA)",
    body: "Where they don't: flows operate the legacy client the way a person does — clicking menus, filling forms, moving data — with no change to the interface.",
  },
  {
    title: "Connectors",
    body: "Excel, email, ERP, cloud storage and the new SaaS tools you just bought, tied into one line. Plugging something new into the old system becomes as simple as a USB drive.",
  },
  {
    title: "Power BI",
    body: "Gives the data buried in legacy databases a voice: one dashboard over systems that were never designed to talk to each other.",
  },
  {
    title: "AI Builder & Copilot",
    body: "Business users describe a process in a sentence and have it built — classification, extraction, drafting — on the same platform as the rest of the automation.",
  },
];

const unchanged = [
  {
    title: "Core databases",
    body: "No migration, no re-keying, no schema change.",
  },
  {
    title: "Historical data",
    body: "Everything already in the system stays exactly where it is.",
  },
  {
    title: "Employee habits",
    body: "Same screens, same menus, same shortcuts on Monday morning.",
  },
];

const steps = [
  {
    title: "Integration review — one week",
    body: "Inventory of systems, channels, data flows and the constraints that actually decide the design.",
  },
  {
    title: "Design",
    body: "What to automate first, where the data gateway sits, and which steps stay human.",
  },
  {
    title: "Build",
    body: "Power Automate flows plus a thin connector layer, tested against a copy of your data before anything goes live.",
  },
  {
    title: "Handover",
    body: "A runbook, monitoring and alerts, and a documented map of every automation we leave behind.",
  },
];

const pilotPoints = ["One painful process first", "Live two to four weeks after the review", "Contained risk, measurable spend"];

const reasons = [
  {
    title: "We connect, we don't replace",
    body: "No rip-and-replace pitch and no vendor lock-in: your current system stays the system of record.",
  },
  {
    title: "Healthcare and B2B platform background",
    body: "ClinicDesk (WhatsApp booking for clinics), NADclinic (UK clinic) and Juusteel Quote (drawing-to-quote for manufacturing).",
  },
  {
    title: "Production systems, not demos",
    body: "Every flow we hand over is monitored, documented and owned by you — a first automation typically goes live two to four weeks after the integration review.",
  },
];

const faqs = [
  {
    question: "Do we have to replace our existing software?",
    answer: "No. The system of record stays; we add the channels and the automation around it.",
  },
  {
    question: "Isn't a new system the cleaner answer?",
    answer:
      "Sometimes — but not by default. A system that has run reliably for ten years is an asset, not a liability. Replacing it means downtime windows, data migration, retraining and rebuilt processes, plus the risk that the new system doesn't work either. Layer on top first and keep the option open.",
  },
  {
    question: "Will our staff notice a difference?",
    answer:
      "Not on their screens. Desktop flows drive the same menus and forms your people use today, so the interface, the records and the habits stay. What changes is who does the repetitive part — the automation, not a person re-keying data at 6pm.",
  },
  {
    question: "What if the automation doesn't work out?",
    answer:
      "We start with one painful process, so the downside is one workflow rather than a system: contained risk, measurable spend, and a result that either makes the case or gets rolled back.",
  },
  {
    question: "Will patient or customer data leave our network?",
    answer:
      "Only what the automation needs. With an on-premises data gateway, records stay inside your environment.",
  },
  {
    question: "Which WhatsApp connection do you use?",
    answer:
      "Meta's WhatsApp Cloud API directly — official Business Platform access, no unofficial bridge and no third-party reseller in the middle.",
  },
  {
    question: "How long until the first automation is live?",
    answer: "A first flow typically goes live two to four weeks after the integration review.",
  },
];

const systems = [
  "WhatsApp Business",
  "Microsoft Teams",
  "Email",
  "Web forms",
  "REST & SOAP APIs",
  "SQL databases",
  "Desktop applications (UI automation)",
  "Document intake (PDF, scans)",
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function IntegrationPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <StaticBackdrop />
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-36 sm:px-6" data-track-section="integration">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Integration &amp; RPA</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.06] tracking-tighter text-[var(--ink)] sm:text-5xl lg:text-[3.5rem]">
            Don&apos;t rip and replace.
            <br />
            Teach your legacy system new tricks.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            Clinics, manufacturers and public bodies run on software that can&apos;t be replaced overnight — and
            shouldn&apos;t be. We layer Microsoft Power Automate on top of what you already run: cloud flows where APIs
            exist, desktop flows (RPA) where they don&apos;t. WhatsApp, Teams and web forms get connected without a
            migration, a retraining programme or a single record moved.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ConsultationCta label="Book an integration review" tracking="integration-consultation-cta" />
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Integration%20review`}
              className="btn-secondary"
              data-track-click="integration-email-cta"
            >
              Tell us which system you can&apos;t replace
            </a>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-[var(--ink-faint)]">
            {systems.join(" · ")}
          </p>
        </Reveal>

        <section className="mt-20" aria-labelledby="integration-cost">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-9">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
                <div>
                  <h2
                    id="integration-cost"
                    className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
                  >
                    What replacement costs
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                    If a system has been running reliably for ten years, it isn&apos;t a liability. It&apos;s an asset.
                    The real cost calculation was never about the software itself.
                  </p>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
                    So what does replacing it actually involve? Everything except the licence fee.
                  </p>
                  <p className="mt-6 text-[15px] font-medium leading-relaxed text-[var(--ink)]">
                    Most of the time, the rational answer is simple: don&apos;t.
                  </p>
                  <blockquote className="mt-5 rounded-2xl border-l-2 border-[var(--accent)] bg-white/55 px-4 py-3.5">
                    <p className="text-[15px] italic text-[var(--ink-dim)]">
                      &ldquo;assuming the new system works.&rdquo;
                    </p>
                    <p className="mt-1.5 text-[13px] leading-snug text-[var(--ink-faint)]">
                      Millions in budget, a two-year timeline, and every bit of the risk sitting with the business.
                    </p>
                  </blockquote>
                </div>
                <div>
                  <dl className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white/50">
                    {replacementCosts.map((cost) => (
                      <div key={cost.label} className="border-b border-[var(--line)] px-4 py-3.5 last:border-b-0">
                        <dt className="text-sm font-semibold text-[var(--ink)]">
                          <span aria-hidden="true" className="mr-2 text-[var(--accent)]">
                            ×
                          </span>
                          {cost.label}
                        </dt>
                        <dd className="mt-0.5 pl-4 text-[13px] leading-snug text-[var(--ink-faint)]">{cost.note}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-20" aria-labelledby="integration-gap">
          <Reveal>
            <h2 id="integration-gap" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              Why the gap exists
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
              But the efficiency gap is real — and it doesn&apos;t fix itself just because you kept the system. It
              usually shows up in the same five places:
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1.5 text-xs leading-snug text-[var(--ink-dim)]"
                >
                  {symptom}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {gaps.map((gap, index) => (
              <Reveal key={gap.title} delay={index * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{gap.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">{gap.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="integration-what">
          <Reveal>
            <h2 id="integration-what" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              What we do
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
              Power Automate doesn&apos;t punch a hole in that wall. It goes over it. Think of it as a layer of nerve
              endings wrapped around what you already own:
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => (
              <Reveal key={capability.title} delay={(index % 3) * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{capability.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">{capability.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="integration-unchanged">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-9">
              <h2
                id="integration-unchanged"
                className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
              >
                What stays the same
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
                This is the part clients check first. Nothing underneath you moves.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {unchanged.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[var(--ink-faint)]">{item.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[15px] font-medium text-[var(--ink)]">
                All you&apos;re adding is a pair of hands and a pair of eyes.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mt-20" aria-labelledby="integration-how">
          <Reveal>
            <h2 id="integration-how" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              How an engagement runs
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={(index % 2) * 0.05}>
                <li className="glass h-full rounded-3xl p-6">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <div className="glass mt-4 rounded-3xl p-7 sm:p-9">
              <h3 className="text-xl font-semibold tracking-tight text-[var(--ink)]">It starts small on purpose</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                Pick the most painful process — month-end reconciliation, order entry, report consolidation — and let the
                results make the argument before you scale.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {pilotPoints.map((point) => (
                  <li
                    key={point}
                    className="rounded-full border border-[var(--line)] bg-white/60 px-3 py-1.5 text-xs font-medium leading-snug text-[var(--ink-dim)]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[15px] leading-relaxed text-[var(--ink-faint)]">
                  If it fails, you&apos;ve lost one workflow, not a system.
                </p>
                <ConsultationCta
                  label="Start with one process"
                  className="btn-primary shrink-0"
                  tracking="integration-pilot-cta"
                />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mt-20" aria-labelledby="integration-why">
          <Reveal>
            <h2 id="integration-why" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              Why us
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reasons.map((reason, index) => (
              <Reveal key={reason.title} delay={index * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{reason.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">{reason.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="integration-compliance">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-9">
              <h2 id="integration-compliance" className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Built for regulated environments
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
                GDPR by design; deployments for US clients are designed around HIPAA requirements. Data minimisation,
                role-based access and audit trails are part of the build, not an afterthought. Where data must not leave
                your network, the on-premises data gateway keeps the system of record inside it.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mt-20" aria-labelledby="integration-faq">
          <Reveal>
            <h2 id="integration-faq" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              Questions we get asked
            </h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="glass group rounded-2xl p-5">
                <summary className="cursor-pointer list-none text-[15px] font-medium text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-[var(--accent)] transition group-open:rotate-90 inline-block">▸</span>
                  {faq.question}
                </summary>
                <p className="mt-3 pl-6 text-[15px] leading-relaxed text-[var(--ink-faint)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20" aria-labelledby="integration-cta">
          <Reveal>
            <div className="glass rounded-3xl p-8 text-center sm:p-12">
              <h2 id="integration-cta" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
                You don&apos;t need to start over.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                Legacy isn&apos;t the problem — letting it grow old alone is. Tell us which system you cannot replace and
                which channel your patients or customers keep asking for. We will map the first automation in a one-week
                integration review.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ConsultationCta label="Book an integration review" tracking="integration-final-cta" />
                <Link href="/#work" className="btn-secondary">
                  See related platforms
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </ConsultationProvider>
  );
}
