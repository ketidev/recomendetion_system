import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Overview", subtitle: "Your banking intelligence at a glance" },
  "/recommendations": { title: "Recommendations", subtitle: "Discover relevant products for every customer" },
  "/customers": { title: "Customers", subtitle: "Explore your customer base and segments" },
  "/products": { title: "Products", subtitle: "Your banking product catalogue" },
  "/analytics": { title: "Analytics", subtitle: "Understand product performance and customer behavior" },
};

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const location = useLocation();
  const page = titles[location.pathname] || titles["/"];
  return (
    <header className="sticky top-0 z-30 flex h-[86px] items-center justify-between border-b border-slate-200/70 bg-[#f8faff]/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"><Menu size={19} /></button>
        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-[22px]">{page.title}</h1>
          <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">{page.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 md:flex">
          <Search size={14} /><span>Search workspace</span><kbd className="ml-5 rounded border border-slate-200 px-1.5 py-0.5 text-[9px]">⌘ K</kbd>
        </div>
        <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-400 ring-2 ring-white" /></button>
        <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#dce8fb] text-xs font-bold text-[#244b84]">KK</div>
      </div>
    </header>
  );
}
