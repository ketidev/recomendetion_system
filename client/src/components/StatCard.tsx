import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string; value: string; helper: string; icon: LucideIcon;
  tone?: "blue" | "violet" | "mint" | "amber";
}
const tones = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  mint: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};
export default function StatCard({ label, value, helper, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <div className="card-shadow rounded-2xl border border-slate-200/80 bg-white p-5">
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-3 font-display text-[27px] font-extrabold tracking-tight text-slate-900">{value}</p></div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={19} /></div>
      </div>
      <p className="mt-3 text-[11px] text-slate-400">{helper}</p>
    </div>
  );
}
