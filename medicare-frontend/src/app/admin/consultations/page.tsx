"use client";

import { useState } from "react";
import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";
import {
  useAdminConsultations,
  useUpdateConsultationStatus,
  type ConsultationListItem,
} from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

const STATUS_FILTER_MAP: Record<string, string | undefined> = {
  All: undefined,
  Pending: "pending",
  "In Review": "under_review",
  Approved: "approved",
  Rejected: "rejected",
  Completed: "completed",
};

const FILTER_LABELS = Object.keys(STATUS_FILTER_MAP);

export default function ConsultationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const statusParam = STATUS_FILTER_MAP[activeFilter];

  const { data: consultations = [], isLoading, isError } = useAdminConsultations(statusParam);
  const updateStatus = useUpdateConsultationStatus();

  const columns: Column<ConsultationListItem>[] = [
    { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-20" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email", className: "text-[#64748b]" },
    { key: "preferred_language", label: "Language" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "created_at",
      label: "Submitted",
      className: "text-[#64748b] text-xs",
      render: (row) => (
        <span>
          {new Date(row.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-xs text-[#22c55e] hover:underline font-medium">View</button>
          {row.status === "pending" && (
            <button
              onClick={() => updateStatus.mutate({ id: row.id, status: "under_review" })}
              disabled={updateStatus.isPending}
              className="text-xs text-[#3b82f6] hover:underline font-medium disabled:opacity-50"
            >
              Review
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Consultations</h1>
          <p className="text-sm text-[#64748b] mt-1">Manage incoming consultation requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {FILTER_LABELS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
                  activeFilter === f
                    ? "bg-[#1e293b] text-white"
                    : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#22c55e]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center text-[#64748b]">Loading...</div>
      )}
      {isError && (
        <div className="py-8 text-center text-[#ef4444]">Failed to load data.</div>
      )}
      {!isLoading && !isError && (
        <DataTable columns={columns} data={consultations} />
      )}
    </div>
  );
}
