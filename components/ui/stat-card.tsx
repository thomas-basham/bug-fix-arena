type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="surface-panel relative overflow-hidden p-5">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <p className="mono-label">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      {detail ? (
        <p className="mt-2 text-sm leading-7 text-slate-600">{detail}</p>
      ) : null}
    </div>
  );
}
