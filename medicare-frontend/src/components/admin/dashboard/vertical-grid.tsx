import Link from "next/link";
import { Scale, Sparkles, Wind, Heart, ChevronRight } from "lucide-react";

const VERTICALS = [
  {
    id: "weight-loss",
    name: "Weight Loss",
    icon: Scale,
    color: "bg-[#dcfce7] text-[#15803d]",
    pending: 12,
    active: 87,
  },
  {
    id: "hair-care",
    name: "Hair Care",
    icon: Wind,
    color: "bg-[#dbeafe] text-[#1d4ed8]",
    pending: 8,
    active: 54,
  },
  {
    id: "skin-care",
    name: "Skin Care",
    icon: Sparkles,
    color: "bg-[#fef3c7] text-[#b45309]",
    pending: 5,
    active: 43,
  },
  {
    id: "womens-health",
    name: "Women's Health",
    icon: Heart,
    color: "bg-[#ffe4e6] text-[#be123c]",
    pending: 3,
    active: 29,
  },
] as const;

export function VerticalGrid() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[#1e293b] mb-3">Vertical Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VERTICALS.map(({ id, name, icon: Icon, color, pending, active }) => (
          <Link
            key={id}
            href={`/admin/consultations?vertical=${id}`}
            className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#22c55e] hover:shadow-sm transition-all flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1e293b] text-sm">{name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-[#f59e0b]">{pending} pending</span>
                <span className="text-xs text-[#22c55e]">{active} active</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#94a3b8] shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
