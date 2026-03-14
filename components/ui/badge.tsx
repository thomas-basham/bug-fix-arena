import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "muted" | "accent" | "success" | "warning";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  muted: "border-line bg-white/85 text-slate-700 shadow-[0_10px_20px_-16px_var(--shadow)]",
  accent:
    "border-accent/15 bg-accent-soft text-accent shadow-[0_12px_24px_-18px_rgba(15,118,110,0.32)]",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_12px_24px_-18px_rgba(16,185,129,0.22)]",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 shadow-[0_12px_24px_-18px_rgba(245,158,11,0.22)]",
};

export function Badge({ children, tone = "muted" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em]",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
