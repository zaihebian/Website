import type { Metadata } from "next";
import SolutionsPage, { type SolutionsContent } from "@/components/SolutionsPage";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Journey Automation",
  description:
    "From the first form fill to renewal, we build the always-on campaigns that move every lead forward — then stay to run them with you. Platform-agnostic, self-hosted by default.",
  alternates: { canonical: "/solutions/customer-journey" },
  openGraph: {
    title: "Customer Journey Automation — LiqenTech",
    description:
      "Automate the customer journey, not just the busywork. Marketing automation built and operated with your team. Self-hosted by default. No lock-in.",
    url: `${SITE_URL}/solutions/customer-journey`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Journey Automation — LiqenTech",
    description:
      "Automate the customer journey, not just the busywork. Built and operated with your team. Self-hosted by default. No lock-in.",
  },
};

const funnelRows = [
  { label: "Form fills", value: "1,000", pct: 100, risk: false },
  { label: "Reached a human", value: "340", pct: 34, risk: false },
  { label: "Contacted in 24h", value: "180", pct: 18, risk: true },
  { label: "Booked a meeting", value: "95", pct: 9.5, risk: false },
];

function JourneyFunnel() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        Where leads actually disappear
      </p>
      <div className="mt-5 space-y-4">
        {funnelRows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-4 text-[12.5px] text-[var(--ink-faint)]">
              <span>{row.label}</span>
              <span className="font-mono text-[var(--ink)]">{row.value}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-[2px] bg-[rgba(10,13,17,0.06)]">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${row.pct}%`,
                  background: row.risk ? "var(--accent)" : "rgba(13,110,140,0.42)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-dashed border-[var(--line)] pt-4 text-[13px] leading-snug text-[var(--accent)]">
        Most of the loss happens at the handoff — not in the ad spend.
      </p>
    </div>
  );
}

const content: SolutionsContent = {
  section: "customer-journey",
  eyebrow: "Marketing automation · built and operated",
  title: "Automate the customer journey, not just the busywork.",
  sub: "From the first form fill to renewal, we build the always-on campaigns that move every lead forward — then stay to run them with you.",
  primaryCta: "Book a 30-minute funnel audit",
  ctaTracking: "customer-journey-consultation-cta",
  secondary: { label: "See what we configure", href: "#what" },
  trust: ["Platform-agnostic", "Your data stays in your instance", "No lock-in"],
  aside: <JourneyFunnel />,
  problems: {
    eyebrow: "Three places it breaks",
    heading: "Your funnel isn't leaking because of the traffic. It's leaking at the seams.",
    items: [
      {
        title: "The lead that waited until Monday.",
        body: "A form fill lands Friday at 6pm. Someone opens it Tuesday morning. By then the prospect has spoken to two competitors. Speed-to-lead is the cheapest conversion lever you own — and most teams lose it to a five-day work week.",
        change:
          "First response in under 60 seconds, routed to the right owner with full context attached.",
      },
      {
        title: "Everyone gets the same email.",
        body: "A first-time visitor, a demo request, and a customer in year three all get the same monthly newsletter. No wonder open rates decay. Personalisation at scale isn't a content problem — it's a data problem: if behaviour never updates the segment, the segment is just a mailing list.",
        change:
          "Behaviour-driven segments and scoring that adjust the message before a human has to think about it.",
      },
      {
        title: "You bought the tool. Nobody turned it on.",
        body: "The licence is paid. The platform is installed. Six months later the team is back to spreadsheets and manual follow-up — not because the software failed, but because configuring it was nobody's job. This is where most automation budgets quietly die.",
        change:
          "A named operator, documented workflows, and a monthly review against pipeline — not a login and a goodbye.",
      },
    ],
  },
  build: {
    eyebrow: "What we configure",
    heading: "Six things, wired into one system.",
    note: "We work inside the platform you already own — or help you choose one, with no commission attached.",
    items: [
      {
        title: "Contacts & dynamic segments",
        body: "Membership updates itself from behaviour. No list hygiene by hand.",
      },
      {
        title: "Multi-step journeys",
        body: "Branching paths, wait steps and exit rules that respect what the contact actually did.",
      },
      {
        title: "Lead scoring & routing",
        body: "Score models tied to real conversion data, with rule-based ownership and SLA timers.",
      },
      {
        title: "Forms, pages, capture",
        body: "Native capture with consent tracking built in, so GDPR is the default rather than an afterthought.",
      },
      {
        title: "CRM sync & handoff",
        body: "Two-way sync, field mapping, and a handoff the sales team will actually use.",
      },
      {
        title: "Reporting you can defend",
        body: "Attribution by campaign and stage, in language your finance team accepts.",
      },
    ],
  },
  how: {
    eyebrow: "How we work",
    heading: "We don't hand you a login.",
    note: "Four stages. You can stop after the first one and still keep the output.",
    steps: [
      {
        when: "Week 1",
        title: "Diagnose",
        body: "A funnel audit: where leads enter, where they stall, what's still manual. You get a one-page map and a priority list, whether or not you continue.",
      },
      {
        when: "Week 2–4",
        title: "Build",
        body: "Journeys, segments, scoring, CRM wiring. Tested against real contacts before anything goes live.",
      },
      {
        when: "Week 4",
        title: "Train",
        body: "Your team runs the platform, not us. Written playbooks, recorded walkthroughs, one handover session.",
      },
      {
        when: "Ongoing",
        title: "Operate",
        body: "Monthly review of pipeline and campaign performance. We tune what works and shut down what doesn't. This is the part most vendors skip.",
      },
    ],
  },
  band: {
    heading: "Your data stays in your instance.",
    body: "We work with self-hosted and open-source platforms by default, so contact data never leaves infrastructure you control. Export everything, any time, in a standard format. If you outgrow us, you keep the system.",
    chips: [
      "Self-hosted by default",
      "Consent tracking built in",
      "No proprietary lock-in",
      "Full export on request",
      "Platform-agnostic",
    ],
  },
  cta: {
    heading: "Find out what's leaking in your funnel.",
    body: "Thirty minutes, your numbers, no slide deck. We'll point at the three places automation would pay for itself first — and say so plainly if it wouldn't.",
    button: "Book the funnel audit",
    note: "Or send us your current setup — we'll reply with what we'd change.",
  },
  cross: [
    {
      label: "Not the customer journey?",
      text: "If your bottleneck is back-office process — orders, invoicing, legacy systems — look here.",
      href: "/solutions/operations",
      linkLabel: "Operations",
    },
    {
      label: "Leads going cold after the form?",
      text: "Capture, scoring, routing and a first reply under 60 seconds.",
      href: "/solutions/lead-capture",
      linkLabel: "Lead capture",
    },
  ],
};

export default function CustomerJourneySolutionPage() {
  return <SolutionsPage content={content} />;
}
