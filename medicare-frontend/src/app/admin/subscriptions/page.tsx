import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";

interface SubscriptionRow {
  id: string;
  customer: string;
  product: string;
  billing: string;
  status: string;
  next_billing: string;
}

const MOCK_DATA: SubscriptionRow[] = [
  { id: "s-001", customer: "Tanaka Yuki", product: "Weight Loss Plan 1 — 1M", billing: "¥8,820", status: "active", next_billing: "2026-05-14" },
  { id: "s-002", customer: "Sato Hiroshi", product: "Hair Care Plan 2 — 2M", billing: "¥35,280", status: "active", next_billing: "2026-05-14" },
  { id: "s-003", customer: "Yamamoto Ai", product: "Skin Care Plan 1 — 1M", billing: "¥8,820", status: "paused", next_billing: "—" },
  { id: "s-004", customer: "Suzuki Kenji", product: "Women's Health Plan 1 — 1M", billing: "¥8,820", status: "cancelled", next_billing: "—" },
];

const COLUMNS: Column<SubscriptionRow>[] = [
  { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-20" },
  { key: "customer", label: "Customer" },
  { key: "product", label: "Product", className: "text-[#64748b] text-xs max-w-xs" },
  { key: "billing", label: "Amount" },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "next_billing", label: "Next Billing", className: "text-[#64748b] text-xs" },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <button className="text-xs text-[#22c55e] hover:underline font-medium">Manage</button>
    ),
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Subscriptions</h1>
        <p className="text-sm text-[#64748b] mt-1">Monitor and manage customer subscriptions</p>
      </div>
      <DataTable columns={COLUMNS} data={MOCK_DATA} />
    </div>
  );
}
