"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Star,
  CreditCard,
  Users,
  ShieldCheck,
  Settings,
  ChevronRight,
  Bot,
  ScrollText,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/consultations", label: "Consultations", icon: MessageSquare },
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    ],
  },
  {
    label: "Agents",
    items: [
      { href: "/admin/agents", label: "Agent Control", icon: Bot },
      { href: "/admin/agents/logs", label: "Agent Logs", icon: ScrollText },
      { href: "/admin/compliance", label: "Compliance Queue", icon: ClipboardCheck },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/approvals", label: "Approvals", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-[#1e293b] text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#334155]">
        <div>
          <span className="font-bold text-sm tracking-tight"><span className="text-white">medi</span><span className="text-[#22c55e]">pic</span></span>
          <span className="block text-[10px] text-[#64748b] font-medium uppercase tracking-wide">Admin OS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider px-2 mb-2">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#22c55e]/20 text-[#22c55e]"
                          : "text-[#94a3b8] hover:bg-[#334155] hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                      {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#334155]">
        <p className="text-[11px] text-[#475569]">medipic OS v0.1</p>
      </div>
    </aside>
  );
}
