import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";

interface ReviewRow {
  id: string;
  product: string;
  rating: string;
  snippet: string;
  status: string;
  submitted: string;
}

const MOCK_DATA: ReviewRow[] = [
  { id: "r-001", product: "Weight Loss Plan 1", rating: "⭐⭐⭐⭐⭐", snippet: "Very helpful program...", status: "pending", submitted: "2026-04-14" },
  { id: "r-002", product: "Hair Care Plan 2", rating: "⭐⭐⭐⭐", snippet: "Noticeable improvement...", status: "approved", submitted: "2026-04-13" },
  { id: "r-003", product: "Skin Care Plan 1", rating: "⭐⭐⭐", snippet: "Decent results...", status: "pending", submitted: "2026-04-12" },
];

const COLUMNS: Column<ReviewRow>[] = [
  { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-20" },
  { key: "product", label: "Product" },
  { key: "rating", label: "Rating" },
  { key: "snippet", label: "Preview", className: "max-w-xs truncate text-[#64748b]" },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "submitted", label: "Date", className: "text-[#64748b] text-xs" },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex gap-2">
        <button className="text-xs text-[#22c55e] hover:underline font-medium">View</button>
        {row.status === "pending" && (
          <>
            <button className="text-xs text-[#3b82f6] hover:underline font-medium">Approve</button>
            <button className="text-xs text-[#ef4444] hover:underline font-medium">Reject</button>
          </>
        )}
      </div>
    ),
  },
];

export default function ReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Reviews</h1>
        <p className="text-sm text-[#64748b] mt-1">Moderate and approve customer reviews</p>
      </div>
      <DataTable columns={COLUMNS} data={MOCK_DATA} />
    </div>
  );
}
