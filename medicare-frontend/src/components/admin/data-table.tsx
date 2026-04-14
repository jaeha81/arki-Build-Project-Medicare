import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn("text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide", col.className)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-[#94a3b8]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn("px-4 py-3 text-[#1e293b]", col.className)}>
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Status badge helper
interface StatusBadgeProps {
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#fef3c7] text-[#b45309]",
  under_review: "bg-[#dbeafe] text-[#1d4ed8]",
  approved: "bg-[#dcfce7] text-[#15803d]",
  rejected: "bg-[#fee2e2] text-[#b91c1c]",
  completed: "bg-[#f0fdf4] text-[#166534]",
  active: "bg-[#dcfce7] text-[#15803d]",
  paused: "bg-[#fef3c7] text-[#b45309]",
  cancelled: "bg-[#fee2e2] text-[#b91c1c]",
  draft: "bg-[#f1f5f9] text-[#475569]",
  published: "bg-[#dcfce7] text-[#15803d]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", STATUS_COLOR[status] ?? "bg-[#f1f5f9] text-[#475569]")}>
      {status.replace("_", " ")}
    </span>
  );
}
