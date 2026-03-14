import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "muted" | "accent" | "success" | "warning";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  muted: "border-line bg-white/80 text-slate-700",
  accent: "border-accent/15 bg-accent-soft text-accent",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export function Badge({ children, tone = "muted" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.22em]",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
