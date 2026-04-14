import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  return (
    <section className="relative bg-gradient-to-br from-[#f0fdf4] via-[#fafffe] to-white py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#15803d] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
          {locale === "ja" ? "医師監督のもとで安心" : "Physician-supervised care"}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e293b] mb-6 leading-tight">
          {t("headline")}
        </h1>
        <p className="text-lg md:text-xl text-[#64748b] mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("subtext")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/consultation`}
            className="inline-flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/how-it-works`}
            className="inline-flex items-center justify-center gap-2 border border-[#e2e8f0] hover:border-[#22c55e] text-[#1e293b] font-medium px-8 py-3.5 rounded-lg transition-colors text-base"
          >
            {locale === "ja" ? "ご利用方法を見る" : "See how it works"}
          </Link>
        </div>
      </div>
    </section>
  );
}
