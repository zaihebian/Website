"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/60 border-b border-white/70">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo-new.png" alt="LiqenTech" width={80} height={80} />
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
