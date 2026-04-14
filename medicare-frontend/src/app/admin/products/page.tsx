import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";

interface ProductRow {
  id: string;
  name: string;
  vertical: string;
  price: string;
  variants: number;
  status: string;
}

const MOCK_DATA: ProductRow[] = [
  { id: "p-001", name: "Weight Loss Plan 1", vertical: "Weight Loss", price: "¥9,800", variants: 2, status: "published" },
  { id: "p-002", name: "Weight Loss Plan 2", vertical: "Weight Loss", price: "¥19,600", variants: 2, status: "published" },
  { id: "p-003", name: "Hair Care Plan 1", vertical: "Hair Care", price: "¥9,800", variants: 2, status: "published" },
  { id: "p-004", name: "Hair Care Plan 2", vertical: "Hair Care", price: "¥19,600", variants: 2, status: "published" },
  { id: "p-005", name: "Skin Care Plan 1", vertical: "Skin Care", price: "¥9,800", variants: 2, status: "draft" },
];

const COLUMNS: Column<ProductRow>[] = [
  { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-20" },
  { key: "name", label: "Product Name" },
  { key: "vertical", label: "Vertical" },
  { key: "price", label: "Base Price" },
  { key: "variants", label: "Variants", render: (row) => <span className="text-[#64748b]">{row.variants}</span> },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <div className="flex gap-2">
        <button className="text-xs text-[#22c55e] hover:underline font-medium">Edit</button>
        <button className="text-xs text-[#64748b] hover:underline font-medium">View</button>
      </div>
    ),
  },
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Products</h1>
          <p className="text-sm text-[#64748b] mt-1">Manage treatment plans and variants</p>
        </div>
        <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Add Product
        </button>
      </div>
      <DataTable columns={COLUMNS} data={MOCK_DATA} />
    </div>
  );
}
