export default function StatCard({
  label,
  value,
  delta,
  hint,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  tone?: "cyan" | "gold" | "green" | "amber" | "red";
}) {
  const toneColor: Record<string, string> = {
    cyan: "text-cyan-400",
    gold: "text-amber-400",
    green: "text-emerald-400",
    amber: "text-amber-300",
    red: "text-rose-400",
  };
  return (
    <div className="wwai-card p-5">
      <div className="text-[11px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`text-3xl font-extrabold mt-1 ${toneColor[tone]}`}>{value}</div>
      <div className="flex items-center justify-between mt-1">
        {delta && <span className="text-xs text-emerald-400">{delta}</span>}
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
    </div>
  );
}
