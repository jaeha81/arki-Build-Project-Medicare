import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "weight-loss",
    label_en: "WEIGHT MANAGEMENT",
    label_ja: "体重管理",
    heading_en: "Doctor-guided weight loss, built around you",
    heading_ja: "あなたに合わせた医師指導の体重管理",
    highlight_en: "built around you",
    highlight_ja: "あなたに合わせた",
    sub_en: "Science-backed GLP-1 programs and personalized plans that fit your lifestyle.",
    sub_ja: "あなたのライフスタイルに合わせた、科学的根拠に基づくプログラム。",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Healthy lifestyle weight management",
    reverse: false,
  },
  {
    slug: "skin-care",
    label_en: "SKIN HEALTH",
    label_ja: "スキンケア",
    heading_en: "Radiant skin through prescription-grade care",
    heading_ja: "処方レベルのケアで輝く肌へ",
    highlight_en: "prescription-grade care",
    highlight_ja: "処方レベルのケア",
    sub_en: "Personalized skincare formulas prescribed by licensed dermatologists.",
    sub_ja: "認定皮膚科医が処方する、あなただけのスキンケア処方。",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Skin care treatment",
    reverse: true,
  },
  {
    slug: "hair-care",
    label_en: "HAIR RESTORATION",
    label_ja: "ヘアケア",
    heading_en: "Clinically proven hair strength and growth",
    heading_ja: "臨床的に証明された髪の強化と成長",
    highlight_en: "strength and growth",
    highlight_ja: "髪の強化と成長",
    sub_en: "Doctor-prescribed treatments that target the root causes of hair loss.",
    sub_ja: "薄毛の根本原因に対処する、医師処方の治療プラン。",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Hair care and restoration",
    reverse: false,
  },
  {
    slug: "womens-health",
    label_en: "WOMEN'S HEALTH",
    label_ja: "女性の健康",
    heading_en: "Whole-body care designed for her",
    heading_ja: "女性のための全身ケア",
    highlight_en: "designed for her",
    highlight_ja: "女性のための",
    sub_en: "Hormone balance, vitality, and confidence — supported by specialist physicians.",
    sub_ja: "ホルモンバランス、活力、自信を — 専門医がサポートします。",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Women's health and wellness",
    reverse: true,
  },
] as const;

export function CategoryCards() {
  const locale = useLocale();

  return (
    <div className="bg-[#0a0f1e]">
      {CATEGORIES.map(({ slug, label_en, label_ja, heading_en, heading_ja, highlight_en, highlight_ja, sub_en, sub_ja, image, imageAlt, reverse }) => {
        const label = locale === "ja" ? label_ja : label_en;
        const heading = locale === "ja" ? heading_ja : heading_en;
        const highlight = locale === "ja" ? highlight_ja : highlight_en;
        const sub = locale === "ja" ? sub_ja : sub_en;
        const headingParts = heading.split(highlight);

        return (
          <section key={slug} className="relative overflow-hidden border-b border-white/5">
            <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} min-h-[560px]`}>

              {/* Text side */}
              <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24 lg:w-1/2 gap-6 relative z-10">
                <span className="text-xs font-bold tracking-[0.2em] text-[#22c55e] uppercase">
                  {label}
                </span>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                  {headingParts[0]}
                  <em className="not-italic text-[#22c55e]">{highlight}</em>
                  {headingParts[1]}
                </h2>

                <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-md">
                  {sub}
                </p>

                <Link
                  href={`/${locale}/category/${slug}`}
                  className="inline-flex items-center gap-2 text-white font-semibold text-base group w-fit mt-2"
                >
                  <span className="border-b border-white/30 group-hover:border-[#22c55e] group-hover:text-[#22c55e] pb-0.5 transition-colors">
                    {locale === "ja" ? "詳しく見る" : "Learn more"}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:text-[#22c55e] group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Image side */}
              <div className="relative lg:w-1/2 h-72 lg:h-auto">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Gradient fade into dark bg */}
                <div className={`absolute inset-0 ${reverse
                  ? "bg-gradient-to-r from-transparent to-[#0a0f1e]/60 lg:bg-gradient-to-l"
                  : "bg-gradient-to-l from-transparent to-[#0a0f1e]/60 lg:bg-gradient-to-r"
                }`} />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
