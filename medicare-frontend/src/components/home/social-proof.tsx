import { useLocale } from "next-intl";

export function SocialProof() {
  const locale = useLocale();

  const stats =
    locale === "ja"
      ? [
          { value: "50+", label: "提携認定医師" },
          { value: "98%", label: "患者満足度*" },
          { value: "24〜48h", label: "初回レスポンス" },
          { value: "100%", label: "プライベート配送" },
        ]
      : [
          { value: "50+", label: "Partner Physicians" },
          { value: "98%", label: "Patient Satisfaction*" },
          { value: "24–48h", label: "Initial Response" },
          { value: "100%", label: "Private Delivery" },
        ];

  return (
    <section className="py-16 px-6 bg-[#0a0f1e]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-4xl font-bold text-[#22c55e] mb-1">{value}</div>
              <div className="text-sm text-white/50">{label}</div>
            </div>
          ))}
        </div>
        {/* COMPLIANCE PLACEHOLDER */}
        <p className="text-xs text-center text-white/25">
          {locale === "ja"
            ? "* 患者アンケートより。個人差があります。結果を保証するものではありません。"
            : "* Based on patient surveys. Individual results may vary. Results are not guaranteed."}
        </p>
      </div>
    </section>
  );
}
