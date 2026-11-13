import ConsultationProvider from "@/components/ConsultationProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { VisitorTracker } from "@/components/VisitorTracker";
import { CAREERS_EMAIL, SITE_URL } from "@/lib/site";

const offers = [
  "Competitive salary",
  "Opportunity to work on diverse projects",
  "Professional development support",
];

const employment = "Full-time";
const workplace = "Athlone, Ireland";

const roles = [
  {
    title: "AI Automation Engineer (Copilot Studio)",
    description:
      "We're hiring one engineer to build multi-agent systems for mid-sized companies: agents that hand work to each other and to the systems a business already runs. The work is Microsoft Copilot Studio, real repositories, and clients who describe the problem badly the first time.",
    responsibilities: [
      "Design and build agents in Microsoft Copilot Studio: topics, generative answers, connectors, escalation between agents.",
      "Run multi-agent orchestration for mid-sized clients — routing, handoffs, guardrails and fallbacks across two or three agents and the systems behind them.",
      "Own the code around the agents: repositories, reviews, branching, deployment scripts and documentation that matches.",
      "Connect agents to what the client already runs — SharePoint, Dataverse, SQL, ERP or CRM — through connectors and APIs, or desktop automation where no API exists.",
      "Scope the work with the client: turn a messy process description into an agent design, an estimate and a handover plan.",
      "Test and monitor what you ship, and write the runbook the client's own team will use.",
    ],
    requirements: [
      "Five years or more in software or automation engineering, with production systems you can point to.",
      "Hands-on Microsoft Copilot Studio: agents, topics, connectors, Power Platform integration.",
      "Experience designing multi-agent or multi-step orchestration for mid-sized enterprises.",
      "Strong programming in C# or TypeScript/JavaScript, plus Python where it fits — and real code management: Git, pull requests, CI, versioning.",
      "Comfortable with Power Automate, Dataverse and one of Azure OpenAI or Azure AI Foundry.",
      "Can explain a design to a non-technical client, and write it down.",
      "Nice to have: Power Automate Desktop, SQL, Microsoft 365 tenancy administration.",
    ],
  },
  {
    title: "Oracle Engineer (development and administration)",
    description:
      "We're hiring one Oracle engineer for the systems our clients have run for a decade and will run for another: schemas, PL/SQL, and the administration around them. You'll move data between Oracle and everything else, keep the month-end reports fast, and leave documentation behind.",
    responsibilities: [
      "Design and maintain Oracle schemas, PL/SQL packages, views and scheduled jobs.",
      "Build data flows between Oracle and other systems — batch, ETL, APIs — including applications that never had an API.",
      "Tune slow queries and month-end reports; own indexes, partitioning and execution plans.",
      "Run the administration: users and privileges, RMAN backup and restore tests, patching and migrations.",
      "Document data models, access rules and change history, so audits are uneventful.",
      "Work with the automation team to expose data safely to agents and Power Automate.",
    ],
    requirements: [
      "Five years or more with Oracle Database (11g through 19c or 23ai) as a developer and an administrator.",
      "Strong SQL and PL/SQL: packages, triggers, performance tuning, execution plans.",
      "Experience with data migration, ETL and integration to non-Oracle systems.",
      "Administration: users and roles, RMAN backup and restore, patching, tablespace and storage management.",
      "Working knowledge of Git and a documented change process.",
      "Can read a legacy data model and say what it actually does.",
      "Nice to have: Oracle APEX, OCI, Oracle Fusion or E-Business Suite, SQL Server or PostgreSQL.",
    ],
  },
];

const jobPostings = roles.map((role) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: role.title,
  description: role.description,
  datePosted: "2026-11-13",
  employmentType: "FULL_TIME",
  hiringOrganization: { "@type": "Organization", name: "LiqenTech", sameAs: SITE_URL },
  jobLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: "Athlone", addressCountry: "IE" },
  },
  directApply: false,
  url: `${SITE_URL}/careers`,
}));

export default function CareersPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostings) }} />

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6" data-track-section="careers">
        <h1 className="text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-4xl">Join LiqenTech</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--ink-dim)]">
          We hire thoughtfully and keep teams small. Two roles below, one hire each, and both need five years or more
          doing the work rather than next to it. If that sounds like you, write to us.
        </p>

        <div className="mt-12 space-y-10">
          {roles.map((role) => (
            <article key={role.title} className="border-t border-[var(--line)] pt-8">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)]">{role.title}</h2>
              <p className="mt-1.5 text-[13.5px] text-[var(--ink-faint)]">
                {employment} · {workplace} (registered office)
              </p>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-dim)]">{role.description}</p>

              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--ink)]">Responsibilities</h3>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-[14px] leading-snug text-[var(--ink-faint)] marker:text-[rgba(10,13,17,0.32)]">
                    {role.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--ink)]">Requirements</h3>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-[14px] leading-snug text-[var(--ink-faint)] marker:text-[rgba(10,13,17,0.32)]">
                    {role.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-[14px] leading-relaxed text-[var(--ink-faint)]">
                <span className="font-medium text-[var(--ink)]">What we offer: </span>
                {offers.join(" · ")}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-[var(--line)] bg-white px-6 py-7">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)]">Don&apos;t see a role that fits?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
            We&apos;re after people who can hear a problem described badly and still come back with something that makes
            the room go quiet. CV and a brief cover letter to:
          </p>
          <a
            href={`mailto:${CAREERS_EMAIL}`}
            className="mt-3 inline-block text-base font-medium text-[var(--accent)] underline underline-offset-4 transition hover:opacity-80"
            data-track-click="careers-email"
          >
            {CAREERS_EMAIL}
          </a>
        </section>
      </main>

      <SiteFooter />
    </ConsultationProvider>
  );
}
