import type { Metadata } from "next";
import Link from "next/link";
import ConsultationProvider from "@/components/ConsultationProvider";
import StaticBackdrop from "@/components/StaticBackdrop";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import ConsultationCta from "@/components/ConsultationCta";
import { VisitorTracker } from "@/components/VisitorTracker";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Knowledge Hub",
  description:
    "Your company already knows the answer. We put your documents, procedures and hard-won know-how into a private knowledge hub that runs on your own premises — answers with sources, offline, and nothing leaves the building.",
  alternates: { canonical: "/solutions/knowledge-hub" },
  openGraph: {
    title: "Private Knowledge Hub — LiqenTech",
    description:
      "Your company already knows the answer. It's just not in the room. A private hub on your own hardware, answering in plain English with the source attached.",
    url: `${SITE_URL}/solutions/knowledge-hub`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Knowledge Hub — LiqenTech",
    description:
      "Your company already knows the answer. It's just not in the room. A private hub on your own hardware, answering in plain English with the source attached.",
  },
};

const costs = [
  {
    title: "The knowledge walks out at five o'clock.",
    body: "When the person who has been there sixteen years retires, they take the filing system with them — not the files, but the knowledge of which ones matter. Whoever replaces them spends months reconstructing what was never written down.",
  },
  {
    title: "You bought the software. You still can't find the file.",
    body: "Most SMEs now keep documents in four places: a shared drive nobody trusts, an email archive, a folder on one laptop, and a printed copy taped up in the workshop. Search works on filenames. People work on memory.",
  },
  {
    title: "New starters take nine months to become useful.",
    body: "Not because they're slow — because every question has to go through a person, and that person is already doing two jobs.",
  },
  {
    title: "Three people, three versions of the same procedure.",
    body: "Then an audit or a client questionnaire arrives, and nobody can say which one is current.",
  },
];

const included = [
  {
    title: "Ask in plain English",
    body: "No tagging, no folder structures to learn.",
  },
  {
    title: "Every answer cites its source",
    body: "So it can be checked — and argued with.",
  },
  {
    title: "Permissions enforced first",
    body: "Access is checked before the answer is written, not hidden afterwards.",
  },
  {
    title: "It works offline",
    body: "The hub keeps answering with the internet unplugged.",
  },
  {
    title: "Files stay where they are",
    body: "Nothing is migrated into a format you can't get out of.",
  },
];

const trust = [
  {
    title: "Permissions at retrieval, not in the interface",
    body: "If someone in sales isn't entitled to see a pricing file, that file never reaches the model in the first place, so it cannot leak into a summary. It's the single most important line in the design, and it's the one most vendors get wrong.",
  },
  {
    title: "Nothing goes out",
    body: "The device has no route to the internet. You can pull the network cable and it will still answer.",
  },
  {
    title: "There's a record",
    body: "Who asked what, which documents were used, what came back. Useful at audit time, and useful on the day someone insists the procedure says something it doesn't.",
  },
  {
    title: "You keep everything",
    body: "Documents stay in your formats, exports are standard, and the hardware is yours. If you'd rather run it without us next year, we'll hand over the documentation and train whoever takes it on.",
  },
  {
    title: "We'll tell you when it won't work",
    body: "If your documents contradict each other, are out of date, or still live in someone's head, no amount of technology will fix that. We'd rather say so in week one than in month six.",
  },
];

const audience = [
  "Manufacturers and engineering firms with drawings, specs and shift procedures",
  "Trades and technical services with site-specific method statements",
  "Accountants, solicitors and consultancies with precedent files and client templates",
  "Clinics and care providers with policies that must be followed to the letter",
  "Schools, charities and public bodies answering the same questions every term",
];

const steps = [
  {
    when: "First",
    title: "Two hours, three documents",
    body: "No commitment. We'd rather look at what you actually have than send you a proposal written before we'd met you.",
  },
  {
    when: "Four to six weeks",
    title: "One department, one use case",
    body: "A fixed scope and a fixed fee. At the end you have something that works and a short written record of how it works.",
  },
  {
    when: "Then",
    title: "Continue, extend or stop",
    body: "A decision to make with evidence in hand. And if it isn't a fit, that's grand — we'll say so early, and you'll have lost two hours.",
  },
];

const faqs = [
  {
    question: "Does it need an internet connection?",
    answer: "No. Setup is done on site, and day-to-day use runs entirely inside your own network.",
  },
  {
    question: "Where does our data actually live?",
    answer: "On the device in your building. It doesn't replicate anywhere else.",
  },
  {
    question: "Can staff see documents they shouldn't?",
    answer: "Not through the hub. Access is checked before any text reaches the model.",
  },
  {
    question: "What happens if the hardware fails?",
    answer:
      "Encrypted backups, and a replacement machine configured within a working day. We'll agree the detail with you in writing before we start.",
  },
  {
    question: "And GDPR?",
    answer:
      "You remain the data controller. We work under a written agreement, and nothing is transferred outside your premises.",
  },
];

export default function KnowledgeHubPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <StaticBackdrop />
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-36 sm:px-6" data-track-section="knowledge-hub">
        <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-14">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Company knowledge · private knowledge hub
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tighter text-[var(--ink)] sm:text-4xl lg:text-[2.9rem]">
              Your company already knows the answer. It&apos;s just not in the room.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-dim)]">
              Every business of any age has one person who knows where everything is — which drawing is current, which
              supplier form actually gets accepted, why the 2019 batch was recalled. That&apos;s not a system. It&apos;s
              a single point of failure, and it&apos;s one resignation away from becoming a problem nobody can fix.
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
              We put your documents, procedures and hard-won know-how into a private knowledge hub that runs on your own
              premises. Your team asks a question in plain English and gets the answer with its source attached. Nothing
              leaves the building.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ConsultationCta label="Book a two-hour review" tracking="knowledge-hub-consultation-cta" />
              <Link href="#what" className="btn-secondary">
                See what you get
              </Link>
            </div>
            <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-[var(--ink-faint)]">
              On your own hardware · No migration · Answers cite their source · Works offline
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass rounded-3xl p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                Start with three documents
              </p>
              <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink)]">
                Send us three documents you&apos;d be sorry to lose. We&apos;ll show you what a hub built on them looks
                like — with your material, not a demo.
              </p>
              <p className="mt-4 border-t border-dashed border-[var(--line)] pt-4 text-[13px] leading-snug text-[var(--ink-faint)]">
                Two hours, three documents, no commitment.
              </p>
            </div>
          </Reveal>
        </div>

        <section id="costs" className="mt-24 scroll-mt-28" aria-labelledby="knowledge-costs">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              The part that costs you money
            </p>
            <h2
              id="knowledge-costs"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              Four ways the knowledge leaves the building.
            </h2>
          </Reveal>
          <div className="mt-10 border-t border-[var(--line)]">
            {costs.map((item, index) => (
              <Reveal key={item.title}>
                <article className="grid gap-4 border-b border-[var(--line)] py-9 lg:grid-cols-[3rem_1fr_1.05fr] lg:gap-10">
                  <span className="font-mono text-sm text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-[var(--ink)]">{item.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--ink-faint)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="what" className="mt-24 scroll-mt-28" aria-labelledby="knowledge-what">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">What you get</p>
            <h2
              id="knowledge-what"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              A private hub that answers from your own documents.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
              On hardware in your own building. Your team asks a question in plain English and gets the answer with its
              source attached.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {included.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <span className="font-mono text-xs text-[var(--ink-faint)]">/ {String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="trust" className="mt-24 scroll-mt-28" aria-labelledby="knowledge-trust">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Why you can trust us with this
            </p>
            <h2
              id="knowledge-trust"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              Local is a start, not a guarantee.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
              We won&apos;t tell you it&apos;s secure because it&apos;s local. A box in a comms room with the default
              password still on it is worse than a well-run cloud service. So here is what we actually do.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trust.map((item, index) => (
              <Reveal key={item.title} delay={(index % 3) * 0.05}>
                <article className="glass h-full rounded-3xl p-6">
                  <span aria-hidden="true" className="text-[var(--accent)]">
                    ✓
                  </span>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="who" className="mt-24 scroll-mt-28" aria-labelledby="knowledge-who">
          <Reveal>
            <div className="glass rounded-3xl p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Who this is for</p>
              <h2
                id="knowledge-who"
                className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
              >
                Five to two hundred people, and one head that holds most of it.
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-faint)]">
                Organisations where a handful of staff hold most of the knowledge. In practice that means:
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {audience.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px] leading-relaxed text-[var(--ink-dim)]">
                    <span aria-hidden="true" className="mt-0.5 text-[var(--accent)]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] font-medium leading-relaxed text-[var(--ink)]">
                If you have a single site, a settled team, and a folder called &ldquo;Final v3 (use this one)&rdquo;,
                you&apos;re the right size for this.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="how" className="mt-24 scroll-mt-28" aria-labelledby="knowledge-how">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">How we start</p>
            <h2
              id="knowledge-how"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              Two hours, three documents, no commitment.
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.04}>
                <li className="glass h-full rounded-3xl p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    {step.when}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-faint)]">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="faq" className="mt-24 scroll-mt-28" aria-labelledby="knowledge-faq">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Questions we get asked
            </p>
            <h2
              id="knowledge-faq"
              className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl"
            >
              The short answers.
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

        <section className="mt-20" aria-labelledby="knowledge-cta">
          <Reveal>
            <div className="glass rounded-3xl p-8 text-center sm:p-12">
              <h2 id="knowledge-cta" className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
                Send us three documents you&apos;d be sorry to lose.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-dim)]">
                We&apos;ll show you what a hub built on them looks like — with your material, not a demo. Two hours,
                three documents, no commitment.
              </p>
              <div className="mt-8 flex justify-center">
                <ConsultationCta label="Book a two-hour review" tracking="knowledge-hub-final-cta" />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-faint)]">
                If it isn&apos;t a fit, we&apos;ll say so early — and you&apos;ll have lost two hours.
              </p>
            </div>
          </Reveal>
        </section>

        <Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <Link
              href="/solutions/operations"
              className="glass group flex items-center justify-between gap-4 rounded-3xl px-6 py-5 transition hover:border-[rgba(13,110,140,0.35)]"
              data-track-click="knowledge-hub-cross-operations"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                  Bottleneck is back-office?
                </p>
                <p className="mt-1 text-[15px] font-medium leading-snug text-[var(--ink)]">
                  Orders, invoices, master data and legacy systems, automated without a migration.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 group-hover:text-[var(--ink)]">
                Operations automation
                <span aria-hidden="true">→</span>
              </span>
            </Link>
            <Link
              href="/solutions/customer-journey"
              className="glass group flex items-center justify-between gap-4 rounded-3xl px-6 py-5 transition hover:border-[rgba(13,110,140,0.35)]"
              data-track-click="knowledge-hub-cross-customer-journey"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                  Bottleneck is the customer journey?
                </p>
                <p className="mt-1 text-[15px] font-medium leading-snug text-[var(--ink)]">
                  Lead capture, campaign automation and the handoff to sales.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--accent)] underline underline-offset-4 group-hover:text-[var(--ink)]">
                Customer journey
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </ConsultationProvider>
  );
}
