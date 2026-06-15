"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useConsultation } from "@/components/ConsultationProvider";

const links = [
  { href: "/#systems", label: "Systems" },
  { href: "/#why", label: "Why us" },
  { href: "/careers", label: "Careers" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const { openConsultation } = useConsultation();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-16 min-w-0 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 max-w-[min(100%,calc(100%-3.5rem))] items-center gap-2 sm:gap-2.5"
          onClick={() => setOpen(false)}
          aria-label="LiqenTech, home"
        >
          <Image
            src="/Asset/LiqenTech-Circle-logo.png"
            alt=""
            width={42}
            height={42}
            className="h-[42px] w-[42px] shrink-0"
            aria-hidden
          />
          <span className="hidden max-w-[10rem] truncate text-[15px] font-semibold tracking-tight text-[var(--ink)] sm:inline-block md:max-w-none">
            LiqenTech
          </span>
        </Link>

        <div className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)] lg:px-4"
              data-track-click={`nav-${link.label.toLowerCase().replaceAll(" ", "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openConsultation}
            className="btn-primary hidden !px-5 !py-2 text-sm md:inline-flex"
            data-track-click="nav-consultation-cta"
          >
            Book a consultation
          </button>
          <button
            type="button"
            className="glass shrink-0 rounded-full p-2.5 text-[var(--ink)] lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-4 mt-2 rounded-3xl p-4 lg:hidden">
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-[15px] text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)]"
                onClick={() => setOpen(false)}
                data-track-click={`mobile-nav-${link.label.toLowerCase().replaceAll(" ", "-")}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                openConsultation();
                setOpen(false);
              }}
              className="btn-primary mt-3 w-full"
              data-track-click="mobile-nav-consultation-cta"
            >
              Book a consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
