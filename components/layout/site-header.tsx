import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/challenges", label: "Challenges" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-[#fbf8f0]/85 backdrop-blur">
      <PageContainer className="flex h-[4.5rem] items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-white">
            OS
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
              Bug Fix Arena
            </p>
            <p className="text-sm font-medium text-slate-900">
              Open source issue training ground
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-line hover:bg-white/70 hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </PageContainer>
    </header>
  );
}
