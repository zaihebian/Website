import type { Metadata } from "next";
import SolutionsPage, { type SolutionsContent } from "@/components/SolutionsPage";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Operations Automation",
  description:
    "Automate orders, invoicing, master data and reporting without migrating off the systems that already work. We connect your existing stack — nothing gets replaced.",
  alternates: { canonical: "/solutions/operations" },
  openGraph: {
    title: "Operations Automation — LiqenTech",
    description:
      "Automate operations without replacing the systems that already work. Orders, invoices, master data, reports: we connect the systems that were never built to talk.",
    url: `${SITE_URL}/solutions/operations`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Operations Automation — LiqenTech",
    description:
      "Automate operations without replacing the systems that already work. Orders, invoices, master data, reports — connected, not migrated.",
  },
};

const ledgerRows = [
  { label: "Read the email, open the attachment", minutes: 2, hand: false },
  { label: "Type it into the ERP", minutes: 8, hand: true },
  { label: "Update the tracking sheet", minutes: 6, hand: true },
  { label: "Send the confirmation", minutes: 4, hand: true },
  { label: "File it where finance can find it", minutes: 3, hand: false },
];

function OperationsLedger() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        <span>One order, by hand</span>
        <span>minutes</span>
      </div>
      <dl className="mt-4">
        {ledgerRows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-dotted border-[var(--line)] py-2.5 last:border-b-0"
          >
            <dt className="text-[13.5px] leading-snug text-[var(--ink-faint)]">{row.label}</dt>
            <dd className={`font-mono text-[12.5px] ${row.hand ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>
              {row.minutes}
            </dd>
          </div>
        ))}
        <div className="mt-3 flex items-baseline justify-between gap-4 text-[13.5px] font-semibold text-[var(--ink)]">
          <dt>Per order, per person</dt>
          <dd className="font-mono">23</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-dashed border-[var(--line)] pt-4 text-[13px] leading-snug text-[var(--accent)]">
        At 40 orders a day, that&apos;s 15 hours a week spent re-typing data that already existed.
      </p>
    </div>
  );
}

const content: SolutionsContent = {
  section: "operations",
  eyebrow: "Operations automation · no rip and replace",
  title: "Automate operations without replacing the systems that already work.",
  sub: "Orders, invoices, master data, reports: the work that still moves by hand between systems that were never built to talk. We connect them. Nothing gets replaced.",
  primaryCta: "Book a 30-minute process audit",
  ctaTracking: "operations-consultation-cta",
  secondary: { label: "See what we automate", href: "#what" },
  trust: ["Runs on your existing stack", "No migration", "IT-approved guardrails"],
  aside: <OperationsLedger />,
  problems: {
    eyebrow: "Three reasons automation stalls",
    heading: "The problem was never the software. It's the gaps between the software.",
    items: [
      {
        title: "The same order, entered three times.",
        body: "It arrives by email, goes into the ERP, and gets copied into a spreadsheet so someone can actually see it. Every re-entry is a chance to transpose a digit. Then month-end reconciliation takes three days instead of one afternoon.",
        change:
          "One entry point, validated against existing rules, written to every system that needs it — and logged.",
      },
      {
        title: "The system that will never have an API.",
        body: "It has run for twelve years, the vendor stopped updating it, and replacing it would mean rebuilding half the company. Every modern tool stops at this door. So the integration project gets deferred, year after year, and the manual work stays.",
        change:
          "Interface-level automation steps in where the API doesn't exist — the same clicks a person makes, at machine speed and with a log.",
      },
      {
        title: "One person, one laptop, one macro.",
        body: "Half the automation in the business runs on a script someone wrote in 2019 and never documented. When that person is on holiday, it stops. When they leave, it dies. It also fails audit, because nobody can say what it touched.",
        change:
          "Documented workflows, credentials in a vault, alerting on failure, and a handover your IT team signs off on.",
      },
      {
        title: "Every system is an island.",
        body: "The CRM doesn't know what the ERP knows, the spreadsheet knows neither, and the handoff between them is a person. Your tools are meant to work together; in practice the integration layer is somebody's inbox.",
        change:
          "One flow across the systems — handoffs automated, validated and logged, so disconnected processes stop being the default.",
      },
    ],
  },
  build: {
    eyebrow: "What we automate",
    heading: "Six processes that pay for themselves first.",
    note: "We work with the automation platform your IT already approves — or the one they'd rather you didn't install on a personal laptop.",
    items: [
      {
        title: "Order & invoice entry",
        body: "From email, PDF or portal to the ERP, with validation and an exception queue.",
      },
      {
        title: "Master data sync",
        body: "Customers, items and prices kept consistent, with a documented rule for conflicts.",
      },
      {
        title: "Report consolidation",
        body: "Multi-source reporting on a fixed schedule, with a fixed definition of every number.",
      },
      {
        title: "Approval routing",
        body: "Routed by amount, department and risk, with automatic reminders and escalation.",
      },
      {
        title: "Exception alerts",
        body: "Humans only get called when something is actually wrong. Normal runs are silent.",
      },
      {
        title: "Legacy desktop steps",
        body: "Where no API exists, interface-level automation does the clicking — no UI change required.",
      },
    ],
  },
  how: {
    eyebrow: "How we work",
    heading: "One process at a time, proven before it scales.",
    note: "Four stages. If the first one says don't automate this, we'll tell you and stop there.",
    steps: [
      {
        when: "Week 1",
        title: "Map",
        body: "We watch the process as it actually runs, not as the manual describes it. Every manual handoff gets a time cost and a name.",
      },
      {
        when: "Week 2–3",
        title: "Build one",
        body: "One process, end to end, tested against real documents before anyone relies on it.",
      },
      {
        when: "Week 4",
        title: "Harden",
        body: "Error handling, audit log, credential vault, rollback. Then the review with IT and compliance.",
      },
      {
        when: "Ongoing",
        title: "Operate",
        body: "Monitor failure rates, adjust as the business changes, review quarterly. Automation that isn't watched decays.",
      },
    ],
  },
  band: {
    heading: "Nothing gets replaced. Nothing gets broken.",
    body: "Your core systems stay exactly as they are. We add a supervised layer around them — every run logged, every credential vaulted, every change reversible. If a workflow misbehaves, it's switched off the same day.",
    chips: [
      "Audit log on every run",
      "Credentials in a vault",
      "One-click rollback",
      "Change control with IT",
      "No core system modification",
    ],
  },
  cta: {
    heading: "Find the one process worth automating first.",
    body: "Thirty minutes, one process, real numbers. We'll estimate the hours it costs you per month — and say plainly if the payback isn't there.",
    button: "Book the process audit",
    note: "Bring one process. That's enough to start.",
  },
  cross: [
    {
      label: "Not back-office?",
      text: "If your bottleneck is lead follow-up and customer lifecycle, look here.",
      href: "/solutions/customer-journey",
      linkLabel: "Customer journey",
    },
    {
      label: "Leads going cold after the form?",
      text: "Capture, scoring, routing and a first reply under 60 seconds.",
      href: "/solutions/lead-capture",
      linkLabel: "Lead capture",
    },
  ],
};

export default function OperationsSolutionPage() {
  return <SolutionsPage content={content} />;
}
