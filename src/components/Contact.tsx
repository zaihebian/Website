"use client";

import { Envelope, MapPin, Phone } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";
import { useConsultation } from "@/components/ConsultationProvider";

export default function Contact() {
  const { openConsultation } = useConsultation();

  return (
    <section id="contact" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36" data-track-section="contact">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 lg:py-24">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: "radial-gradient(90% 120% at 50% 0%, rgba(143,205,230,0.08), transparent 60%)" }}
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">
                Ready to eliminate busywork?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-dim)]">
                Let&apos;s identify the biggest bottlenecks in your business and automate them.
              </p>
              <div className="mt-10">
                <button type="button" onClick={openConsultation} className="btn-primary" data-track-click="contact-consultation-cta">
                  Book a consultation
                </button>
              </div>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-[var(--ink-faint)] sm:flex-row sm:gap-8">
                <a
                  href="mailto:contact@liqentech.com"
                  className="inline-flex items-center gap-2 transition hover:text-[var(--ink)]"
                  data-track-click="contact-email"
                >
                  <Envelope size={16} aria-hidden="true" />
                  contact@liqentech.com
                </a>
                <a
                  href="tel:+353892665691"
                  className="inline-flex items-center gap-2 transition hover:text-[var(--ink)]"
                  data-track-click="contact-phone"
                >
                  <Phone size={16} aria-hidden="true" />
                  +353 89 266 5691
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} aria-hidden="true" />
                  Athlone, Ireland
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
