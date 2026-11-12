"use client";

import { Envelope, MapPin, Phone } from "@phosphor-icons/react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { useConsultation } from "@/components/ConsultationProvider";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_LABEL } from "@/lib/site";

export default function Contact() {
  const { openConsultation } = useConsultation();

  return (
    <section id="contact" className="relative scroll-mt-20 px-4 py-28 sm:px-6 lg:py-36" data-track-section="contact">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 lg:py-24">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: "radial-gradient(90% 120% at 50% 0%, rgba(13,110,140,0.07), transparent 60%)" }}
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
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 transition hover:text-[var(--ink)]"
                  data-track-click="contact-email"
                >
                  <Envelope size={16} aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="inline-flex items-center gap-2 transition hover:text-[var(--ink)]"
                  data-track-click="contact-phone"
                >
                  <Phone size={16} aria-hidden="true" />
                  {CONTACT_PHONE_LABEL}
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} aria-hidden="true" />
                  Athlone, Ireland
                </span>
              </div>

              <div className="relative mt-10 border-t border-[var(--line)] pt-8">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                  European &amp; Irish enterprise support
                </p>
                {/* The official logos ship with dark artwork, so they sit on a dark credential band. */}
                <div className="mt-6 rounded-2xl bg-[#0b1114] px-5 py-6 ring-1 ring-[rgba(10,13,17,0.12)]">
                  <div className="grid grid-cols-1 items-center justify-items-center gap-6 sm:grid-cols-3 sm:gap-8">
                    <Image
                      src="/official-support/european-regional-development-fund.png"
                      alt="European Regional Development Fund"
                      width={360}
                      height={112}
                      className="h-auto max-h-11 w-auto max-w-[210px] rounded-sm object-contain"
                    />
                    <Image
                      src="/official-support/local-enterprise-office.png"
                      alt="Local Enterprise Office"
                      width={180}
                      height={180}
                      className="h-14 w-14 rounded-sm object-contain"
                    />
                    <Image
                      src="/official-support/enterprise-ireland.jpg"
                      alt="Enterprise Ireland"
                      width={360}
                      height={117}
                      className="h-auto max-h-11 w-auto max-w-[210px] rounded-sm object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
