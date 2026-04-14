"use client";

import {
  useKpiSnapshot,
  useConsultationTrend,
  useVerticalDistribution,
  useAgentActivity,
} from "@/hooks/use-kpi";
import { KpiCard } from "./kpi-card";
import { TrendChart } from "./trend-chart";
import { VerticalDistribution } from "./vertical-distribution";

export function KpiDashboard() {
  const snapshot = useKpiSnapshot();
  const trend = useConsultationTrend(30);
  const verticals = useVerticalDistribution();
  const agents = useAgentActivity();

  const snap = snapshot.data;

  return (
    <>
      {/* KPI 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Consultations"
          value={snap?.total_consultations ?? "—"}
          accent="green"
        />
        <KpiCard
          title="Pending Consultations"
          value={snap?.pending_consultations ?? "—"}
          accent="amber"
        />
        <KpiCard
          title="Active Subscriptions"
          value={snap?.active_subscriptions ?? "—"}
          accent="blue"
        />
        <KpiCard
          title="Pending Approvals"
          value={snap?.pending_approvals ?? "—"}
          accent="rose"
        />
      </div>

      {/* 2열 그리드: 트렌드 차트 + 버티컬 분포 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={trend.data ?? []}
          label="Consultation Trend (Last 7 Days)"
        />
        <VerticalDistribution data={verticals.data ?? []} />
      </div>

      {/* 에이전트 활동 요약 테이블 */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e2e8f0]">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
            Agent Activity — Today
          </p>
        </div>
        {agents.data && agents.data.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Agent ID
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Runs Today
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {agents.data.map((agent) => {
                const ratePercent = Math.round(agent.success_rate * 100);
                const rateColor =
                  ratePercent >= 90
                    ? "text-[#15803d]"
                    : ratePercent >= 70
                    ? "text-[#b45309]"
                    : "text-[#be123c]";
                return (
                  <tr key={agent.agent_id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3 font-mono text-[#1e293b]">{agent.agent_id}</td>
                    <td className="px-5 py-3 text-right text-[#475569]">{agent.runs_today}</td>
                    <td className={`px-5 py-3 text-right font-semibold ${rateColor}`}>
                      {ratePercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-[#94a3b8]">
            오늘 에이전트 활동 없음
          </div>
        )}
      </div>

      {/* 추가 KPI: 전환율, 컴플라이언스, 이탈 위험 */}
      {snap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <KpiCard
            title="Conversion Rate"
            value={`${snap.conversion_rate}%`}
            accent="green"
          />
          <KpiCard
            title="Avg Compliance Score"
            value={`${snap.avg_compliance_score}%`}
            accent="blue"
          />
          <KpiCard
            title="Churn Risk"
            value={snap.churn_risk_count}
            accent="rose"
          />
        </div>
      )}
    </>
  );
}
