"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-[#fbf8f0]/88 backdrop-blur-xl">
      <PageContainer className="py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-slate-950 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-[0_18px_32px_-22px_rgba(15,23,42,0.65)]">
              OS
            </span>
            <div>
              <p className="mono-label">Open Source Bug Fix Arena</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                Developer workflow arena for real GitHub issues
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <nav className="flex flex-wrap items-center gap-2 rounded-full border border-line bg-white/70 p-1.5 shadow-[0_16px_28px_-22px_var(--shadow)] backdrop-blur">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn("nav-link", isActive && "nav-link-active")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="surface-panel hidden items-center gap-3 px-4 py-2.5 text-sm text-slate-700 xl:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
              <span>Live discovery, scoring, and submission tracking</span>
            </div>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
