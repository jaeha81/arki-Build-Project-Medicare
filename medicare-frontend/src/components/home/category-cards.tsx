import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "weight-loss",
    key: "weightLoss",
    featured: true,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Weight loss treatment",
    accent: "#22c55e",
  },
  {
    slug: "skin-care",
    key: "skinCare",
    featured: false,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Skin care treatment",
    accent: "#a78bfa",
  },
  {
    slug: "hair-care",
    key: "hairCare",
    featured: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Hair care treatment",
    accent: "#f59e0b",
  },
  {
    slug: "womens-health",
    key: "womensHealth",
    featured: false,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Women's health treatment",
    accent: "#f43f5e",
  },
] as const;

export function CategoryCards() {
  const t = useTranslations("home.categories");
  const locale = useLocale();

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-3">
            {locale === "ja" ? "治療カテゴリー" : "Treatment Categories"}
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            {locale === "ja"
              ? "科学的根拠に基づいた治療プランをご提供します"
              : "Science-backed care plans personalized for you"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(({ slug, key, featured, image, imageAlt }) => (
            <Link
              key={slug}
              href={`/${locale}/category/${slug}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f1f5f9]"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {featured && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#15803d] text-xs font-semibold px-2.5 py-1 rounded-full">
                    {locale === "ja" ? "人気" : "Popular"}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2">
                <h3 className="font-bold text-[#1e293b] text-base group-hover:text-[#22c55e] transition-colors">
                  {t(`${key}.name`)}
                </h3>
                <p className="text-sm text-[#64748b] leading-relaxed flex-1">
                  {t(`${key}.description`)}
                </p>
                <div className="flex items-center gap-1.5 text-[#22c55e] text-sm font-semibold mt-2 group-hover:gap-2.5 transition-all">
                  {locale === "ja" ? "詳しく見る" : "Learn more"}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
