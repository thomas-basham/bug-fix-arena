import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="mono-label">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-[2.35rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
