import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface VerticalPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const VERTICAL_META: Record<
  string,
  { name_en: string; name_ja: string; desc_en: string; desc_ja: string }
> = {
  "weight-loss": {
    name_en: "Weight Loss",
    name_ja: "体重管理",
    desc_en:
      "Medically supervised weight management. May help support your goals. Consultation required.",
    desc_ja:
      "医師監督による体重管理。目標をサポートする可能性があります。相談が必要です。",
  },
  "skin-care": {
    name_en: "Skin Care",
    name_ja: "スキンケア",
    desc_en:
      "Prescription-strength skincare for various skin concerns. Consultation required.",
    desc_ja:
      "様々な肌の悩みに対応する処方スキンケア。相談が必要です。",
  },
  "hair-care": {
    name_en: "Hair Care",
    name_ja: "ヘアケア",
    desc_en:
      "Treatments developed to support hair health. Individual results may vary.",
    desc_ja:
      "毛髪の健康をサポートするために開発された治療法。個人差があります。",
  },
  "womens-health": {
    name_en: "Women's Health",
    name_ja: "女性の健康",
    desc_en:
      "Personalized care for hormonal balance and reproductive wellness. Medical consultation required.",
    desc_ja:
      "ホルモンバランスと生殖器の健康のためのパーソナライズされたケア。",
  },
};

export default async function VerticalPage({ params }: VerticalPageProps) {
  const { locale, slug } = await params;
  const meta = VERTICAL_META[slug] ?? VERTICAL_META["weight-loss"];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-4">
          {locale === "ja" ? meta.name_ja : meta.name_en}
        </h1>
        {/* COMPLIANCE PLACEHOLDER */}
        <p className="text-[#64748b] max-w-xl mx-auto leading-relaxed">
          {locale === "ja" ? meta.desc_ja : meta.desc_en}
        </p>
      </div>

      {/* Doctor trust block */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6 flex gap-4 mb-12">
        <ShieldCheck className="h-8 w-8 text-[#22c55e] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-[#1e293b] mb-1">
            {locale === "ja"
              ? "認定医師によるレビュー"
              : "Reviewed by Licensed Physicians"}
          </p>
          {/* COMPLIANCE PLACEHOLDER */}
          <p className="text-sm text-[#64748b]">
            {locale === "ja"
              ? "すべての治療計画は資格のある医師によって監督されます。これは医療アドバイスの代替ではありません。"
              : "All treatment plans are supervised by qualified physicians. This is not a substitute for medical advice."}
          </p>
        </div>
      </div>

      {/* Products placeholder — populated from API in Step 1-9 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#1e293b] mb-6">
          {locale === "ja" ? "利用可能なプラン" : "Available Plans"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Link
              key={i}
              href={`/${locale}/category/${slug}/product-${i}`}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#22c55e] hover:shadow-sm transition-all"
            >
              <div className="h-4 w-32 bg-[#f1f5f9] rounded mb-3 animate-pulse" />
              <div className="h-3 w-full bg-[#f1f5f9] rounded mb-2 animate-pulse" />
              <div className="h-3 w-2/3 bg-[#f1f5f9] rounded mb-4 animate-pulse" />
              <span className="text-[#22c55e] text-sm font-medium inline-flex items-center gap-1">
                {locale === "ja" ? "詳細を見る" : "View details"}{" "}
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
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
