"use client";

import { useState } from "react";
import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";
import { useAdminSubscriptions, usePatchSubscription, type SubscriptionRecord } from "@/hooks/use-admin";

function buildColumns(
  onManage: (id: string, currentStatus: string) => void,
): Column<SubscriptionRecord>[] {
  return [
    { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-32 truncate" },
    { key: "customer_id", label: "Customer ID", className: "font-mono text-xs text-[#64748b] truncate max-w-[120px]" },
    { key: "vertical", label: "Vertical" },
    { key: "plan", label: "Plan" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "renewal_date",
      label: "Next Billing",
      className: "text-[#64748b] text-xs",
      render: (row) => row.renewal_date ?? "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => onManage(row.id, row.status)}
          className="text-xs text-[#22c55e] hover:underline font-medium"
        >
          {row.status === "active" ? "Pause" : row.status === "paused" ? "Activate" : "Manage"}
        </button>
      ),
    },
  ];
}

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminSubscriptions(page);
  const patchSubscription = usePatchSubscription();

  const handleManage = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    patchSubscription.mutate({ id, status: nextStatus });
  };

  if (isLoading)
    return <div className="py-8 text-center text-[#64748b]">Loading…</div>;
  if (isError)
    return <div className="py-8 text-center text-[#ef4444]">Failed to load subscriptions.</div>;

  const totalPages = Math.ceil((data?.total ?? 0) / (data?.page_size ?? 20));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Subscriptions</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Monitor and manage customer subscriptions{data ? ` — ${data.total} total` : ""}
        </p>
      </div>

      <DataTable columns={buildColumns(handleManage)} data={data?.items ?? []} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-[#e2e8f0] rounded-lg disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-3 py-1.5 text-sm text-[#64748b]">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-[#e2e8f0] rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
