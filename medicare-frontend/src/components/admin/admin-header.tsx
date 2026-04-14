"use client";

import { Bell, LogOut, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-[#64748b] hover:text-[#1e293b] rounded-lg hover:bg-[#f1f5f9] transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#22c55e] rounded-full" />
        </button>
        <div className="flex items-center gap-2 text-sm text-[#1e293b] font-medium">
          <div className="w-7 h-7 bg-[#f0fdf4] rounded-full flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-[#22c55e]" />
          </div>
          <span>Admin</span>
        </div>
        <button className="p-2 text-[#94a3b8] hover:text-[#ef4444] rounded-lg hover:bg-[#fef2f2] transition-colors">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
