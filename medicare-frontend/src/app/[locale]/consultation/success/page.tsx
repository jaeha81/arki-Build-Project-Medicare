import Link from "next/link";
import { getLocale } from "next-intl/server";
import { CheckCircle, ArrowRight } from "lucide-react";

export default async function ConsultationSuccessPage() {
  const locale = await getLocale();
  const isJa = locale === "ja";

  const nextSteps = isJa
    ? [
        "医療チームがアンケートを確認します。",
        "相談結果をメールでお知らせします。",
        "適切な場合、治療計画をご準備します。",
      ]
    : [
        "Our medical team reviews your questionnaire.",
        "You'll receive an email with your consultation results.",
        "If appropriate, a treatment plan will be prepared for you.",
      ];

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-8 w-8 text-[#22c55e]" />
      </div>
      <h1 className="text-3xl font-bold text-[#1e293b] mb-4">
        {isJa ? "相談が送信されました" : "Consultation Submitted"}
      </h1>
      <p className="text-[#64748b] mb-8 leading-relaxed">
        {isJa
          ? "ありがとうございます。認定医師が24〜48時間以内にお客様の情報を確認します。"
          : "Thank you! A licensed physician will review your information within 24–48 hours."}
      </p>
      <div className="bg-[#f0fdf4] rounded-xl p-6 text-left mb-8 space-y-3">
        <h2 className="font-semibold text-[#1e293b]">
          {isJa ? "次のステップ" : "What happens next?"}
        </h2>
        {nextSteps.map((text, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 bg-[#22c55e] text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-[#64748b]">{text}</p>
          </div>
        ))}
      </div>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-[#22c55e] hover:text-[#16a34a] font-medium"
      >
        {isJa ? "ホームに戻る" : "Return to Home"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
