import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Scale, Sparkles, Wind, Heart, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { slug: "weight-loss", icon: Scale, key: "weightLoss", featured: true },
  { slug: "hair-care", icon: Wind, key: "hairCare", featured: true },
  { slug: "skin-care", icon: Sparkles, key: "skinCare", featured: false },
  { slug: "womens-health", icon: Heart, key: "womensHealth", featured: false },
] as const;

export function CategoryCards() {
  const t = useTranslations("home.categories");
  const locale = useLocale();

  return (
    <section className="py-16 px-6 bg-[#fafffe]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e293b] text-center mb-10">
          {locale === "ja" ? "治療カテゴリー" : "Treatment Categories"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(({ slug, icon: Icon, key, featured }) => (
            <Link
              key={slug}
              href={`/${locale}/category/${slug}`}
              className={`group relative bg-white rounded-xl border p-6 flex flex-col gap-4 hover:border-[#22c55e] hover:shadow-md transition-all ${
                featured ? "border-[#bbf7d0] shadow-sm" : "border-[#e2e8f0]"
              }`}
            >
              {featured && (
                <span className="absolute top-3 right-3 bg-[#dcfce7] text-[#15803d] text-xs font-medium px-2 py-0.5 rounded-full">
                  {locale === "ja" ? "人気" : "Popular"}
                </span>
              )}
              <div className="w-12 h-12 bg-[#f0fdf4] rounded-xl flex items-center justify-center">
                <Icon className="h-6 w-6 text-[#22c55e]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1e293b] mb-1">{t(`${key}.name`)}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{t(`${key}.description`)}</p>
              </div>
              <div className="flex items-center gap-1 text-[#22c55e] text-sm font-medium mt-auto group-hover:gap-2 transition-all">
                {locale === "ja" ? "詳しく見る" : "Learn more"}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
