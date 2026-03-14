import type { ReactNode } from "react";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="surface-card-strong flex flex-col items-start gap-4 p-8 md:p-10">
      <p className="mono-label">{eyebrow}</p>
      <div className="max-w-2xl space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="text-base leading-8 text-slate-700">{description}</p>
      </div>
      {action}
    </div>
  );
}
