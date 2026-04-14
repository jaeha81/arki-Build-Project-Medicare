import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function BottomCta() {
  const t = useTranslations("home.bottomCta");
  const locale = useLocale();

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#15803d] to-[#22c55e]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("headline")}</h2>
        <Link
          href={`/${locale}/consultation`}
          className="inline-flex items-center gap-2 bg-white text-[#15803d] font-semibold px-8 py-3.5 rounded-lg hover:bg-[#f0fdf4] transition-colors"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {/* COMPLIANCE PLACEHOLDER */}
        <p className="text-[#bbf7d0] text-sm mt-6">
          {locale === "ja"
            ? "医師の相談が必要です。個人差があります。"
            : "Medical consultation required. Individual results may vary."}
        </p>
      </div>
    </section>
  );
}
