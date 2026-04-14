import { KpiDashboard } from "@/components/admin/dashboard/kpi-dashboard";
import { ApprovalQueueWidget } from "@/components/admin/dashboard/approval-queue-widget";
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Medicare OS</h1>
        <p className="text-sm text-[#64748b] mt-1">Platform overview — all verticals</p>
      </div>

      {/* KPI 대시보드 (클라이언트 컴포넌트: React Query + 30초 자동 갱신) */}
      <KpiDashboard />

      {/* 하단 그리드: 승인 큐 + 활동 피드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <ApprovalQueueWidget />
        </div>
      </div>
    </div>
  );
}
