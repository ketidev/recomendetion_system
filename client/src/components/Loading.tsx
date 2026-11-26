import { LoaderCircle } from "lucide-react";
export default function Loading({ label = "Loading data..." }: { label?: string }) {
  return <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-sm text-slate-400"><LoaderCircle className="animate-spin text-blue-600" size={24} />{label}</div>;
}
