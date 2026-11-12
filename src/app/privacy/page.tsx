import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How LiqenTech collects, uses and retains the information you share through liqentech.com, including consultation enquiries and website analytics.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What we collect",
    body: [
      "Contact details you submit through the consultation form: name, email address, company name and the message you write.",
      "Technical data recorded by our own analytics endpoint when you browse the site: a randomly generated visitor id, a session id, the pages and sections you view, scroll milestones, clicks on tracked buttons, UTM campaign parameters, the page you arrived from, your browser user agent and a network address prefix. The IP address is truncated before it is stored (typically to the first three octets).",
      "A marketing automation identifier set by our Mautic instance (the `mtc_id` cookie) so that repeat visits and enquiries can be linked to the same contact record.",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "To reply to your enquiry and to provide a quote or next steps (performance of a contract or steps taken at your request before entering a contract).",
      "To understand which pages help visitors and which do not, so the site can be improved (our legitimate interest in running and improving our business site).",
      "To keep our marketing automation contact records and lead scoring accurate (legitimate interest).",
    ],
  },
  {
    title: "Who processes it",
    body: [
      "Supabase — stores website behaviour events and consultation submissions on our behalf.",
      "Mautic — our self-hosted marketing automation platform, which stores contact records, tags and scoring.",
      "Vercel — hosts the website and processes request logs.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Consultation enquiries are kept for up to 24 months after the last contact, so we can pick up a conversation.",
      "Behaviour events are kept for up to 12 months in aggregate form.",
      "Contact records in Mautic are kept until you ask us to remove them, or until they have been inactive for 24 months.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask for a copy of the personal data we hold about you, ask us to correct or delete it, or object to processing based on legitimate interest.",
      "You can also withdraw any consent you have given at any time, and lodge a complaint with the Irish Data Protection Commission (dataprotection.ie) or your local authority.",
      `Write to ${CONTACT_EMAIL} and we will respond within one month.`,
    ],
  },
  {
    title: "Cookies and tracking",
    body: [
      "The site sets a marketing automation cookie from our own Mautic domain and stores a visitor id in your browser's local storage. These are used for the analytics and contact-matching described above; there are no third-party advertising cookies.",
      "Clearing your browser storage removes the visitor id. Blocking the Mautic tracking script does not affect the rest of the site; only marketing attribution is lost.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="glass rounded-3xl p-8 sm:p-12">
        <Link href="/" className="text-sm font-medium text-[var(--accent)] underline underline-offset-4">
          ← LiqenTech
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-dim)]">
          LiqenTech Ltd, Athlone, Ireland, is the controller of the personal data described here. This page explains
          what the website collects, why, and how to reach us about it.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)]">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.body.map((item) => (
                  <li key={item} className="text-[15px] leading-relaxed text-[var(--ink-faint)]">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)]">Contact</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-faint)]">
              Questions about this policy or a data request:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-10 border-t border-[var(--line)] pt-6 text-xs text-[var(--ink-faint)]">
          Last updated: 12 November 2026.
        </p>
      </div>
    </main>
  );
}
