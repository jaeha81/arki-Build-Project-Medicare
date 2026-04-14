import Link from "next/link";
import { useLocale } from "next-intl";
import { Scale, Sparkles, Wind, Heart, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "weight-loss",
    icon: Scale,
    name_en: "Weight Loss",
    name_ja: "体重管理",
    desc_en:
      "Medically supervised weight management programs. May help support your wellness goals. Results vary.",
    desc_ja:
      "医師監督による体重管理プログラム。個人差があります。",
  },
  {
    slug: "skin-care",
    icon: Sparkles,
    name_en: "Skin Care",
    name_ja: "スキンケア",
    desc_en:
      "Prescription-strength skincare solutions for various skin concerns. Consultation required.",
    desc_ja:
      "様々な肌の悩みに対応する処方強度のスキンケア。相談が必要です。",
  },
  {
    slug: "hair-care",
    icon: Wind,
    name_en: "Hair Care",
    name_ja: "ヘアケア",
    desc_en:
      "Clinically developed treatments to support hair health. Individual results may vary.",
    desc_ja:
      "毛髪の健康をサポートする臨床的に開発された治療法。個人差があります。",
  },
  {
    slug: "womens-health",
    icon: Heart,
    name_en: "Women's Health",
    name_ja: "女性の健康",
    desc_en:
      "Personalized care for hormonal balance and reproductive wellness. Medical consultation required.",
    desc_ja:
      "ホルモンバランスと生殖器の健康のためのパーソナライズされたケア。医師の相談が必要です。",
  },
] as const;

export default function CategoryPage() {
  const locale = useLocale();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-4">
        {locale === "ja" ? "治療カテゴリー" : "Treatment Categories"}
      </h1>
      <p className="text-center text-[#64748b] mb-12 max-w-2xl mx-auto">
        {/* COMPLIANCE PLACEHOLDER */}
        {locale === "ja"
          ? "各カテゴリーでは、認定医師による相談後に適切な治療計画をご提供します。"
          : "Each category offers treatment plans developed with licensed physicians following consultation."}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CATEGORIES.map(({ slug, icon: Icon, name_en, name_ja, desc_en, desc_ja }) => (
          <Link
            key={slug}
            href={`/${locale}/category/${slug}`}
            className="group bg-white rounded-xl border border-[#e2e8f0] p-8 hover:border-[#22c55e] hover:shadow-md transition-all flex gap-5"
          >
            <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center shrink-0">
              <Icon className="h-7 w-7 text-[#22c55e]" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-[#1e293b] text-lg mb-2 group-hover:text-[#22c55e] transition-colors">
                {locale === "ja" ? name_ja : name_en}
              </h2>
              <p className="text-[#64748b] text-sm leading-relaxed mb-3">
                {locale === "ja" ? desc_ja : desc_en}
              </p>
              <span className="inline-flex items-center gap-1 text-[#22c55e] text-sm font-medium">
                {locale === "ja" ? "詳しく見る" : "Learn more"}{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
