import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ClipboardList,
  UserCheck,
  FileText,
  Package,
  MessageCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title_en: "Complete the Questionnaire",
    title_ja: "問診票に記入",
    desc_en: "Fill out our secure online health questionnaire. It takes about 5 minutes.",
    desc_ja: "安全なオンライン健康アンケートに記入します。約5分で完了します。",
  },
  {
    icon: UserCheck,
    title_en: "Physician Review",
    title_ja: "医師によるレビュー",
    desc_en: "A licensed physician reviews your information within 24–48 hours.",
    desc_ja: "認定医師が24〜48時間以内に情報を確認します。",
  },
  {
    icon: FileText,
    title_en: "Treatment Plan",
    title_ja: "治療計画の作成",
    // COMPLIANCE PLACEHOLDER
    desc_en:
      "If appropriate, a personalized treatment plan may be prepared for you. Results are not guaranteed.",
    desc_ja:
      "適切な場合、パーソナライズされた治療計画が作成される可能性があります。結果を保証するものではありません。",
  },
  {
    icon: Package,
    title_en: "Discreet Delivery",
    title_ja: "プライベート配送",
    desc_en: "Medications are shipped in discreet packaging directly to your door.",
    desc_ja: "薬はプライベートな包装でご自宅に直接配送されます。",
  },
  {
    icon: MessageCircle,
    title_en: "Ongoing Support",
    title_ja: "継続的なサポート",
    desc_en:
      "Message your care team with questions. Your physician is available throughout your treatment.",
    desc_ja:
      "ケアチームに質問を送ることができます。治療中、医師が対応します。",
  },
  {
    icon: RefreshCw,
    title_en: "Flexible Subscription",
    title_ja: "柔軟なサブスクリプション",
    desc_en:
      "Pause, adjust, or cancel your subscription anytime from your dashboard.",
    desc_ja:
      "ダッシュボードからいつでもサブスクリプションを一時停止、調整、またはキャンセルできます。",
  },
] as const;

export default function HowItWorksPage() {
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
          {locale === "ja" ? "ご利用の流れ" : "How It Works"}
        </h1>
        <p className="text-[#64748b] max-w-xl mx-auto">
          {locale === "ja"
            ? "簡単なステップでオンライン医療相談を始めましょう。"
            : "Get started with online medical consultation in a few simple steps."}
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#bbf7d0] hidden md:block" />

        <div className="space-y-10">
          {STEPS.map(({ icon: Icon, title_en, title_ja, desc_en, desc_ja }, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-[#f0fdf4] border-2 border-[#22c55e] rounded-full flex items-center justify-center z-10 relative">
                  <Icon className="h-5 w-5 text-[#22c55e]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#22c55e] text-white text-xs font-bold rounded-full flex items-center justify-center z-20">
                  {idx + 1}
                </span>
              </div>
              <div className="pt-2 pb-6">
                <h3 className="font-bold text-[#1e293b] text-lg mb-2">
                  {locale === "ja" ? title_ja : title_en}
                </h3>
                <p className="text-[#64748b] leading-relaxed">
                  {locale === "ja" ? desc_ja : desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href={`/${locale}/consultation`}
          className="inline-flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors"
        >
          {locale === "ja" ? "無料相談を始める" : "Start Free Consultation"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
