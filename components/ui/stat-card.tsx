type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-line bg-white/70 p-5 shadow-[0_10px_24px_-18px_var(--shadow)]">
      <p className="mono-label">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
      {detail ? (
        <p className="mt-2 text-sm leading-7 text-slate-600">{detail}</p>
      ) : null}
    </div>
  );
}
