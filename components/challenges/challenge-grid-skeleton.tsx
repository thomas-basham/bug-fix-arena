type ChallengeGridSkeletonProps = {
  count?: number;
};

export function ChallengeGridSkeleton({
  count = 4,
}: ChallengeGridSkeletonProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="surface-card animate-pulse p-6">
          <div className="flex gap-3">
            <div className="h-8 w-18 rounded-full bg-slate-200/70" />
            <div className="h-8 w-40 rounded-full bg-slate-200/70" />
          </div>
          <div className="mt-5 h-8 w-3/4 rounded-full bg-slate-200/70" />
          <div className="mt-4 h-4 w-full rounded-full bg-slate-200/70" />
          <div className="mt-3 h-4 w-5/6 rounded-full bg-slate-200/70" />
          <div className="mt-5 flex gap-2">
            <div className="h-8 w-28 rounded-full bg-slate-200/70" />
            <div className="h-8 w-20 rounded-full bg-slate-200/70" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="h-20 rounded-2xl bg-slate-200/70" />
            <div className="h-20 rounded-2xl bg-slate-200/70" />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="h-4 w-16 rounded-full bg-slate-200/70" />
            <div className="h-10 w-32 rounded-full bg-slate-200/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
