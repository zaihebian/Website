import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--line)] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/Asset/LiqenTech-Circle-logo.png" alt="LiqenTech" width={36} height={36} className="h-9 w-9" />
            <span className="text-sm font-semibold tracking-tight text-[var(--ink)]">LiqenTech</span>
          </Link>
          <p className="text-sm text-[var(--ink-faint)]">Business solutions powered by AI.</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--ink-dim)]">
          <Link href="/#systems" className="transition hover:text-[var(--ink)]">Systems</Link>
          <Link href="/#why" className="transition hover:text-[var(--ink)]">Why us</Link>
          <Link href="/careers" className="transition hover:text-[var(--ink)]">Careers</Link>
          <Link href="/#contact" className="transition hover:text-[var(--ink)]">Contact</Link>
        </nav>

        <p className="text-sm text-[var(--ink-faint)]">© 2026 LiqenTech Ltd.</p>
      </div>
    </footer>
  );
}
