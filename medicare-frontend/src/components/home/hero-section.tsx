import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ArrowRight, Shield, Star, Clock } from "lucide-react";

const TRUST_BADGES = [
  { icon: Shield, label_en: "Licensed Physicians", label_ja: "認定医師" },
  { icon: Star, label_en: "4.9 / 5 Rating", label_ja: "4.9 / 5 評価" },
  { icon: Clock, label_en: "24h Support", label_ja: "24時間サポート" },
];

export function HeroSection() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#15803d] text-sm font-semibold px-4 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              {locale === "ja" ? "医師監督のもとで安心" : "Physician-supervised care"}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e293b] leading-[1.1] tracking-tight">
              {t("headline")}
            </h1>

            <p className="text-lg text-[#64748b] leading-relaxed max-w-lg">
              {t("subtext")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/consultation`}
                className="inline-flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-green-200"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/how-it-works`}
                className="inline-flex items-center justify-center gap-2 border border-[#e2e8f0] hover:border-[#22c55e] hover:text-[#22c55e] text-[#1e293b] font-medium px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                {locale === "ja" ? "ご利用方法を見る" : "See how it works"}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {TRUST_BADGES.map(({ icon: Icon, label_en, label_ja }) => (
                <div key={label_en} className="flex items-center gap-2 text-sm text-[#64748b]">
                  <div className="w-8 h-8 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <span className="font-medium">{locale === "ja" ? label_ja : label_en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image collage */}
          <div className="relative hidden lg:block">
            <div className="relative h-[520px] w-full">
              {/* Main large image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
                  alt="Online medical consultation"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/10 to-transparent" />
              </div>

              {/* Floating card — top right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 z-10 w-52">
                <div className="w-10 h-10 bg-[#dcfce7] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-[#22c55e]" />
                </div>
                <div>
                  <div className="text-xs text-[#64748b]">{locale === "ja" ? "患者満足度" : "Patient Rating"}</div>
                  <div className="font-bold text-[#1e293b]">4.9 / 5.0 ⭐</div>
                </div>
              </div>

              {/* Floating card — bottom left */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 z-10 w-56">
                <div className="w-10 h-10 bg-[#dbeafe] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <div>
                  <div className="text-xs text-[#64748b]">{locale === "ja" ? "認定医師" : "Certified Doctors"}</div>
                  <div className="font-bold text-[#1e293b]">
                    {locale === "ja" ? "全員が資格保有" : "100% Licensed"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent" />
    </section>
  );
}
