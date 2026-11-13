import type { Metadata } from "next";
import SolutionsPage, { type SolutionsContent } from "@/components/SolutionsPage";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lead Capture & Follow-up",
  description:
    "Most leads go cold in the gap between submitting a form and hearing back. We automate capture, scoring, routing and follow-up — first reply in under 60 seconds.",
  alternates: { canonical: "/solutions/lead-capture" },
  openGraph: {
    title: "Lead Capture & Follow-up — LiqenTech",
    description:
      "Your pipeline problem isn't traffic. It's the 72 hours after a form fill. Capture, qualify, follow up and hand off — automated end to end.",
    url: `${SITE_URL}/solutions/lead-capture`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Capture & Follow-up — LiqenTech",
    description:
      "Your pipeline problem isn't traffic. It's the 72 hours after a form fill. Capture, qualify, follow up and hand off — automated end to end.",
  },
};

const speedRows = [
  { label: "Fastest human reply", value: "31h 12m", pct: 64, hot: false },
  { label: "Slowest human reply", value: "4d 6h", pct: 100, hot: false },
  { label: "Leads reached within 1 hour", value: "12%", pct: 12, hot: false },
  { label: "Automated first response", value: "47s", pct: 6, hot: true },
];

function LeadSpeedPanel() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        <span>A typical setup, measured</span>
        <span className="font-mono">n = 10</span>
      </div>
      <div className="mt-4">
        {speedRows.map((row) => (
          <div key={row.label} className="border-b border-dotted border-[var(--line)] py-3 last:border-b-0">
            <div className="flex items-baseline justify-between gap-4 text-[13.5px] text-[var(--ink-faint)]">
              <span>{row.label}</span>
              <span
                className={`font-mono text-[13px] ${row.hot ? "font-semibold text-[var(--accent)]" : "text-[var(--ink)]"}`}
              >
                {row.value}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-[2px] bg-[rgba(10,13,17,0.06)]">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${row.pct}%`,
                  background: row.hot ? "var(--accent)" : "rgba(10,13,17,0.22)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-dashed border-[var(--line)] pt-4 text-[13px] leading-snug text-[var(--accent)]">
        Same leads. Same budget. Different answer time.
      </p>
      <p className="mt-2 text-[11.5px] leading-snug text-[var(--ink-faint)]">
        Illustrative of typical setups — not a guarantee of results.
      </p>
    </div>
  );
}

const content: SolutionsContent = {
  section: "lead-capture",
  eyebrow: "Lead capture · qualification · follow-up",
  title: "Your pipeline problem isn't traffic. It's the 72 hours after a form fill.",
  sub: "Capture, qualify, follow up and hand off — automated end to end, so nothing waits in an inbox and every stage has a number attached to it.",
  primaryCta: "Test your reply time — free",
  ctaTracking: "lead-capture-consultation-cta",
  secondary: { label: "See what we set up", href: "#what" },
  trust: ["No new CRM required", "Works with your current forms", "Live in two weeks"],
  aside: <LeadSpeedPanel />,
  problems: {
    eyebrow: "Three places leads quietly die",
    heading: "A lead is rarely lost in the funnel. It's lost in the gap between two people.",
    items: [
      {
        title: "The form goes to an inbox nobody owns.",
        body: "The website form sends a notification to info@. Four people can see it, so nobody is responsible for it. Whoever opens it first forwards it to whoever they think handles this. That's three handoffs before anyone actually speaks to the buyer.",
        change:
          "Every submission gets an owner within seconds, with a timer running and an escalation if nobody acts.",
      },
      {
        title: "Sales cherry-picks, and the good ones rot.",
        body: "Ten leads land on Monday. Three look familiar, so they get called. The other seven look like tyre-kickers, so they wait. Two of those seven were the only ones with budget. The problem is that “looks promising” is a guess, not a score.",
        change:
          "Fit and intent scored automatically, so the queue is in priority order instead of in arrival order.",
      },
      {
        title: "“I gave it to you.” “No you didn't.”",
        body: "Marketing says it sent 400 leads last quarter. Sales says it received 180. Both are telling the truth from where they sit. Without one shared record, every pipeline meeting becomes an argument about data instead of a decision about customers.",
        change: "One record per lead, one definition per stage, visible to both sides on the same screen.",
      },
    ],
  },
  build: {
    eyebrow: "What we set up",
    heading: "Six pieces, in the order they break.",
    note: "We start at the point of capture and work backwards, because that's where the money leaks first.",
    items: [
      {
        title: "Capture that doesn't lose data",
        body: "Every form, chat and call logged to one place, with the source and consent recorded.",
      },
      {
        title: "Instant first response",
        body: "An acknowledgement in under a minute, written like a human and signed by a real person.",
      },
      {
        title: "Scoring on fit and intent",
        body: "Two separate scores, tuned against your closed-won data, not against a template.",
      },
      {
        title: "Routing with an owner",
        body: "Rule-based assignment, SLA timers, and escalation when a lead sits too long.",
      },
      {
        title: "A place for “not yet”",
        body: "Not-ready leads go into nurture instead of into a dead folder. They come back when they're ready.",
      },
      {
        title: "Reporting that ends arguments",
        body: "Leads in, leads worked, leads closed — one set of definitions everyone signed off on.",
      },
    ],
  },
  how: {
    eyebrow: "How we work",
    heading: "First, we time you. Then we fix the clock.",
    note: "Four stages, each one provable before the next begins.",
    steps: [
      {
        when: "Week 1",
        title: "Measure",
        body: "We submit test enquiries through your own forms and time the reply. No theory — just your actual number.",
      },
      {
        when: "Week 1–2",
        title: "Close the gap",
        body: "Capture, acknowledgement, owner assignment. The unglamorous part that moves the number most.",
      },
      {
        when: "Week 2–3",
        title: "Score & route",
        body: "Scores built on your own won/lost history, then wired into routing rules and nurture.",
      },
      {
        when: "Ongoing",
        title: "Keep it honest",
        body: "A monthly report on response time, contact rate and lead-to-meeting conversion. Numbers we publish, not numbers we claim.",
      },
    ],
  },
  band: {
    heading: "The first reply is a promise. Keep it or lose the deal.",
    body: "No lead goes unowned. No enquiry sits past its SLA. Nothing gets marked “contacted” without a timestamp. When we say 60 seconds, you can check it on any given Tuesday.",
    chips: [
      "First reply under 60s",
      "Every lead has an owner",
      "Nothing older than 24h",
      "Consent recorded",
      "Monthly numbers published",
    ],
  },
  cta: {
    heading: "Find out how long you actually take to reply.",
    body: "Send us your website. We'll submit three test enquiries through your own forms and time every reply — then send you the results, whether or not we work together.",
    button: "Send my website — get the numbers",
    note: "Three test enquiries. No sales call required.",
  },
  cross: [
    {
      label: "What happens after they reply?",
      text: "Nurture, scoring, campaigns and renewal — the rest of the journey.",
      href: "/solutions/customer-journey",
      linkLabel: "Customer journey",
    },
    {
      label: "Bottleneck is back-office?",
      text: "Orders, invoices, master data and legacy systems, automated without a migration.",
      href: "/solutions/operations",
      linkLabel: "Operations automation",
    },
  ],
};

export default function LeadCaptureSolutionPage() {
  return <SolutionsPage content={content} />;
}
