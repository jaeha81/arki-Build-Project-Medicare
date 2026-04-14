import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";

interface ConsultationRow {
  id: string;
  name: string;
  email: string;
  vertical: string;
  status: string;
  submitted: string;
}

const MOCK_DATA: ConsultationRow[] = [
  { id: "c-001", name: "Tanaka Yuki", email: "tanaka@example.com", vertical: "Weight Loss", status: "pending", submitted: "2026-04-14 09:12" },
  { id: "c-002", name: "Sato Hiroshi", email: "sato@example.com", vertical: "Hair Care", status: "under_review", submitted: "2026-04-14 08:55" },
  { id: "c-003", name: "Yamamoto Ai", email: "yama@example.com", vertical: "Skin Care", status: "approved", submitted: "2026-04-13 17:40" },
  { id: "c-004", name: "Suzuki Kenji", email: "suzuki@example.com", vertical: "Women's Health", status: "completed", submitted: "2026-04-13 14:22" },
  { id: "c-005", name: "Kobayashi Mika", email: "koba@example.com", vertical: "Weight Loss", status: "rejected", submitted: "2026-04-12 11:30" },
];

const COLUMNS: Column<ConsultationRow>[] = [
  { key: "id", label: "ID", className: "font-mono text-xs text-[#94a3b8] w-20" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email", className: "text-[#64748b]" },
  { key: "vertical", label: "Vertical" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: "submitted", label: "Submitted", className: "text-[#64748b] text-xs" },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex gap-2">
        <button className="text-xs text-[#22c55e] hover:underline font-medium">View</button>
        {row.status === "pending" && (
          <button className="text-xs text-[#3b82f6] hover:underline font-medium">Review</button>
        )}
      </div>
    ),
  },
];

export default function ConsultationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Consultations</h1>
          <p className="text-sm text-[#64748b] mt-1">Manage incoming consultation requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {["All", "Pending", "In Review", "Approved", "Rejected"].map((f) => (
              <button
                key={f}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  f === "All"
                    ? "bg-[#1e293b] text-white"
                    : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#22c55e]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      <DataTable columns={COLUMNS} data={MOCK_DATA} />
    </div>
  );
}
