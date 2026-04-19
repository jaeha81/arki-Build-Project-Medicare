import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function BottomCta() {
  const t = useTranslations("home.bottomCta");
  const locale = useLocale();

  return (
    <section className="py-20 px-6 bg-[#0a0f1e] border-t border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-[#22c55e] uppercase mb-4">medipic</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("headline")}</h2>
        <Link
          href={`/${locale}/consultation`}
          className="inline-flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-9 py-4 rounded-xl transition-colors shadow-lg shadow-green-900/30"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {/* COMPLIANCE PLACEHOLDER */}
        <p className="text-white/30 text-sm mt-6">
          {locale === "ja"
            ? "医師の相談が必要です。個人差があります。"
            : "Medical consultation required. Individual results may vary."}
        </p>
      </div>
    </section>
  );
}
