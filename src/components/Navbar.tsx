"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  variant?: "default" | "company";
  onEarlyAccessClick?: () => void;
};

export default function Navbar({ variant = "default", onEarlyAccessClick }: NavbarProps) {
  const [open, setOpen] = useState(false);

  if (variant === "company") {
    return (
      <nav className="fixed top-0 w-full z-50 border-t-0 border-x-0 rounded-none backdrop-blur-lg bg-[#0a0a0f]/70 border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/Asset/LiqenTech-Circle-logo.png" alt="LiqenTech" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-semibold tracking-tight text-white">LiqenTech</span>
          </Link>
          <div className={`md:flex items-center gap-8 text-sm font-medium ${open ? "flex flex-col absolute top-full left-0 right-0 bg-[#0a0a0f]/95 border-b border-white/10 py-6 space-y-4" : "hidden md:flex md:flex-row md:static md:border-0 md:py-0 md:space-y-0"}`}>
            <Link href="/#home" className="text-gray-200 hover:text-cyan-400 transition" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/#products" className="text-gray-200 hover:text-cyan-400 transition" onClick={() => setOpen(false)}>Products</Link>
            <Link href="/#about" className="text-gray-200 hover:text-cyan-400 transition" onClick={() => setOpen(false)}>About</Link>
            <Link href="/#contact" className="text-gray-200 hover:text-cyan-400 transition" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/careers" className="text-gray-200 hover:text-cyan-400 transition" onClick={() => setOpen(false)}>Hiring</Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { onEarlyAccessClick?.(); setOpen(false); }}
              className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition text-white"
            >
              Get early access
            </button>
            <button
              type="button"
              className="md:hidden text-2xl text-gray-300 cursor-pointer p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden px-6 pb-4">
            <button
              type="button"
              onClick={() => { onEarlyAccessClick?.(); setOpen(false); }}
              className="w-full text-left py-2 text-cyan-400 font-semibold"
            >
              Get early access
            </button>
          </div>
        )}
      </nav>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/60 border-b border-white/70">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="LiqenTech" width={80} height={80} />
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <ul className={`md:flex gap-6 ${open ? "block mt-3" : "hidden md:flex"}`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/careers">Hiring</Link></li>
          <li><Link href="/#consulting">Consulting</Link></li>
        </ul>
      </nav>
    </header>
  );
}
