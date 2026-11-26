import { NavLink } from "react-router-dom";
import {
  Activity, ArrowUpRight, BarChart3, CreditCard, LayoutDashboard,
  Sparkles, Users, WalletCards, X,
} from "lucide-react";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/products", label: "Products", icon: WalletCards },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

interface SidebarProps { open: boolean; onClose: () => void }
export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && <button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" />}
      <aside className={`sidebar-scroll fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200/80 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#183b73] text-white shadow-lg shadow-blue-900/15">
              <Activity size={21} strokeWidth={2.4} />
            </div>
            <div>
              <p className="font-display text-[17px] font-extrabold tracking-tight text-slate-900">northstar</p>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Banking intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"><X size={18} /></button>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition ${isActive ? "bg-[#edf3ff] text-[#24549a]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
              {label === "Recommendations" && <span className="ml-auto rounded-md bg-[#e2ecff] px-1.5 py-0.5 text-[9px] font-bold text-[#24549a]">AI</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="overflow-hidden rounded-2xl bg-[#142f59] p-4 text-white">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10"><Sparkles size={16} /></div>
            <p className="font-display text-sm font-bold">Smarter decisions start here.</p>
            <p className="mt-1.5 text-[11px] leading-5 text-blue-100/70">Explore customer patterns and discover relevant banking products.</p>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-blue-100">Explore insights <ArrowUpRight size={13} /></div>
            <div className="pointer-events-none absolute" />
          </div>
          <div className="mt-5 flex items-center gap-2 px-1 text-[10px] text-slate-400">
            <CreditCard size={13} /> Portfolio project · Demo data
          </div>
        </div>
      </aside>
    </>
  );
}
