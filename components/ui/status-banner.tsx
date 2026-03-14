import { cn } from "@/lib/utils";
import type { ChallengeCatalogNotice } from "@/types/domain";

type StatusBannerProps = {
  notice: ChallengeCatalogNotice;
};

const toneClasses = {
  muted: "border-slate-200 bg-white/80 text-slate-700",
  warning: "border-amber-200 bg-amber-50/90 text-amber-800",
};

export function StatusBanner({ notice }: StatusBannerProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border p-5 shadow-[0_10px_24px_-18px_var(--shadow)]",
        toneClasses[notice.tone],
      )}
    >
      <p className="mono-label opacity-70">Catalog Status</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">
        {notice.title}
      </h2>
      <p className="mt-2 text-sm leading-7">{notice.message}</p>
    </div>
  );
}
