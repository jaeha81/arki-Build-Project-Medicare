"use client";

import { useState } from "react";
import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";
import { useAdminReviews, usePatchReview, type ReviewRecord } from "@/hooks/use-admin";

type ReviewRow = ReviewRecord & { rating_display: string; snippet: string };

const STATUS_FILTERS = ["All", "pending", "approved", "rejected"] as const;

function buildColumns(
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): Column<ReviewRow>[] {
  return [
    { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-20 truncate" },
    { key: "customer_name", label: "Customer" },
    { key: "rating_display", label: "Rating" },
    { key: "snippet", label: "Preview", className: "max-w-xs truncate text-[#64748b]" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "created_at",
      label: "Date",
      className: "text-[#64748b] text-xs",
      render: (row) => new Date(row.created_at).toLocaleDateString("en-CA"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-xs text-[#22c55e] hover:underline font-medium">View</button>
          {row.status === "pending" && (
            <>
              <button
                onClick={() => onApprove(row.id)}
                className="text-xs text-[#3b82f6] hover:underline font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(row.id)}
                className="text-xs text-[#ef4444] hover:underline font-medium"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
}

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = useAdminReviews(page, statusFilter);
  const patchReview = usePatchReview();

  const handleApprove = (id: string) => patchReview.mutate({ id, status: "approved" });
  const handleReject = (id: string) => patchReview.mutate({ id, status: "rejected" });

  if (isLoading)
    return <div className="py-8 text-center text-[#64748b]">Loading…</div>;
  if (isError)
    return <div className="py-8 text-center text-[#ef4444]">Failed to load reviews.</div>;

  const rows: ReviewRow[] = (data?.items ?? []).map((r) => ({
    ...r,
    rating_display: "⭐".repeat(Math.max(1, Math.min(5, r.rating))),
    snippet: r.body ? r.body.slice(0, 60) + (r.body.length > 60 ? "…" : "") : "—",
  }));

  const totalPages = Math.ceil((data?.total ?? 0) / (data?.page_size ?? 20));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Reviews</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Moderate and approve customer reviews{data ? ` — ${data.total} total` : ""}
          </p>
        </div>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f === "All" ? undefined : f); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                (f === "All" && !statusFilter) || statusFilter === f
                  ? "bg-[#1e293b] text-white border-[#1e293b]"
                  : "bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#22c55e]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={buildColumns(handleApprove, handleReject)} data={rows} />

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
