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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/Asset/LiqenTech-Circle-logo.png" alt="LiqenTech" width={42} height={42} className="h-[42px] w-[42px]" />
          <span className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">LiqenTech</span>
        </Link>

        <div className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={openConsultation} className="btn-primary hidden !px-5 !py-2 text-sm md:inline-flex">
            Book a consultation
          </button>
          <button
            type="button"
            className="glass rounded-full p-2.5 text-[var(--ink)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-4 mt-2 rounded-3xl p-4 md:hidden">
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-[15px] text-[var(--ink-dim)] transition hover:bg-white/5 hover:text-[var(--ink)]"
                onClick={() => setOpen(false)}
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
            >
              Book a consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
