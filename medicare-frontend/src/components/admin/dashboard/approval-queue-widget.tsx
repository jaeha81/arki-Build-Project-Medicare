import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

const MOCK_APPROVALS = [
  { id: "1", agent: "Intake Agent", action: "Send consultation summary email", created: "5m ago" },
  { id: "2", agent: "Compliance Gate", action: "Flag review for manual check", created: "22m ago" },
  { id: "3", agent: "Retention Agent", action: "Send churn-prevention offer", created: "1h ago" },
];

export function ApprovalQueueWidget() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#1e293b]">Pending Approvals</h2>
        <Link href="/admin/approvals" className="text-xs text-[#22c55e] hover:text-[#16a34a] font-medium inline-flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {MOCK_APPROVALS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-[#fcd34d] p-4 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-[#f59e0b] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#92400e]">{item.agent}</p>
              <p className="text-sm text-[#1e293b] mt-0.5">{item.action}</p>
              <p className="text-xs text-[#94a3b8] mt-1">{item.created}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="text-xs bg-[#22c55e] text-white px-2.5 py-1 rounded-md hover:bg-[#16a34a] transition-colors font-medium">
                Approve
              </button>
              <button className="text-xs bg-[#fee2e2] text-[#b91c1c] px-2.5 py-1 rounded-md hover:bg-[#fecaca] transition-colors font-medium">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
