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
    "We connect WhatsApp, Microsoft Teams, email and web forms to the software you cannot replace, using Microsoft Power Automate cloud flows and desktop flows (RPA).",
  alternates: { canonical: "/integration" },
  openGraph: {
    title: "Integration & RPA — LiqenTech",
    description:
      "Legacy software stays. New channels get connected. Microsoft Power Automate cloud and desktop flows for clinics, manufacturers and public bodies.",
    url: `${SITE_URL}/integration`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Integration & RPA — LiqenTech",
    description:
      "Legacy software stays. New channels get connected. Microsoft Power Automate cloud and desktop flows for clinics, manufacturers and public bodies.",
  },
};

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
    title: "Automate the glue",
    body: "Microsoft Power Automate cloud flows where APIs exist, desktop flows (RPA) where they do not. Scheduled syncs, document intake, notifications and approval routing — built to run unattended.",
  },
  {
    title: "Leave the record alone",
    body: "No data migration. Least-privilege access, audit logs, and an on-premises data gateway for anything that must stay inside your network.",
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

export default function IntegrationPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <StaticBackdrop />
      <SiteNav />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-36 sm:px-6" data-track-section="integration">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Integration &amp; RPA</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Keep the software. Add the channels.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-dim)]">
            Clinics, manufacturers and public bodies run on software they cannot afford to replace: migration risk,
            retraining and downtime outweigh the missing features. So the old system stays — and WhatsApp, Teams and web
            forms never get connected. We use Microsoft Power Automate to close that gap, without a rip-and-replace
            programme.
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

        <section className="mt-20" aria-labelledby="integration-gap">
          <Reveal>
            <h2 id="integration-gap" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              Why the gap exists
            </h2>
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
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability, index) => (
              <Reveal key={capability.title} delay={index * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{capability.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">{capability.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
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
                Keep what works. Connect what&apos;s missing.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                Tell us which system you cannot replace and which channel your patients or customers keep asking for. We
                will map the first automation in a one-week integration review.
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
