"use client";

import { useState } from "react";
import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";
import {
  useAdminProducts,
  useSoftDeleteProduct,
  type ProductRecord,
} from "@/hooks/use-admin";

type ProductRow = ProductRecord & { price_display: string };

function buildColumns(onDelete: (id: string) => void): Column<ProductRow>[] {
  return [
    { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-32 truncate" },
    { key: "name_en", label: "Product Name" },
    { key: "slug", label: "Slug", className: "font-mono text-xs text-[#64748b]" },
    { key: "price_display", label: "Base Price" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => <StatusBadge status={row.is_active ? "published" : "draft"} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-xs text-[#22c55e] hover:underline font-medium">Edit</button>
          <button
            onClick={() => onDelete(row.id)}
            className="text-xs text-[#ef4444] hover:underline font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminProducts(page);
  const softDelete = useSoftDeleteProduct();

  const handleDelete = (id: string) => {
    if (!confirm("Soft-delete this product?")) return;
    softDelete.mutate(id);
  };

  if (isLoading)
    return <div className="py-8 text-center text-[#64748b]">Loading…</div>;
  if (isError)
    return <div className="py-8 text-center text-[#ef4444]">Failed to load products.</div>;

  const rows: ProductRow[] = (data?.items ?? []).map((p) => ({
    ...p,
    price_display: `${p.currency === "JPY" ? "¥" : ""}${p.base_price.toLocaleString()}`,
  }));

  const totalPages = Math.ceil((data?.total ?? 0) / (data?.page_size ?? 20));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Products</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage treatment plans and variants{data ? ` — ${data.total} total` : ""}
          </p>
        </div>
        <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Add Product
        </button>
      </div>

      <DataTable columns={buildColumns(handleDelete)} data={rows} />

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
