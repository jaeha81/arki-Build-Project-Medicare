import { Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "consultation" | "approval" | "review" | "subscription";
  message: string;
  time: string;
  status?: "pending" | "approved" | "rejected";
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "1", type: "consultation", message: "New consultation submitted — Weight Loss", time: "2m ago", status: "pending" },
  { id: "2", type: "approval", message: "Agent action approved by admin", time: "15m ago", status: "approved" },
  { id: "3", type: "review", message: "New 5-star review — Hair Care Plan 2", time: "1h ago" },
  { id: "4", type: "consultation", message: "New consultation submitted — Skin Care", time: "2h ago", status: "pending" },
  { id: "5", type: "subscription", message: "Subscription renewed — Women's Health", time: "3h ago" },
];

const STATUS_BADGE = {
  pending: "bg-[#fef3c7] text-[#b45309]",
  approved: "bg-[#dcfce7] text-[#15803d]",
  rejected: "bg-[#fee2e2] text-[#b91c1c]",
} as const;

export function ActivityFeed() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[#1e293b] mb-3">Recent Activity</h2>
      <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9]">
        {MOCK_ACTIVITY.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#1e293b] leading-snug">{item.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-[#94a3b8]" />
                <span className="text-xs text-[#94a3b8]">{item.time}</span>
                {item.status && (
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${STATUS_BADGE[item.status]}`}>
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
