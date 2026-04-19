import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "50,000+", label_en: "Patients Served", label_ja: "患者数" },
  { value: "4.9★", label_en: "Patient Rating", label_ja: "患者評価" },
  { value: "100%", label_en: "Licensed Doctors", label_ja: "認定医師" },
  { value: "24h", label_en: "Medical Support", label_ja: "医療サポート" },
];

export function HeroSection() {
  const locale = useLocale();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#0a0f1e]">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1800&q=80"
          alt="Medical consultation"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/60 via-[#0a0f1e]/40 to-[#0a0f1e]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 pt-20 pb-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80] text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" />
          {locale === "ja" ? "医師監督のオンライン診療" : "Physician-supervised online care"}
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          {locale === "ja" ? (
            <>
              医療を、あなたの<br />
              <em className="not-italic text-[#22c55e]">リアルな生活</em>のために
            </>
          ) : (
            <>
              Healthcare,{" "}
              <em className="not-italic text-[#22c55e]">redefined</em>
              <br />
              for real life.
            </>
          )}
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          {locale === "ja"
            ? "認定医師によるオーダーメイドの治療プランで、あなたの健康目標を実現します。"
            : "Licensed physicians. Science-backed treatments. Delivered to your door — no clinic visits required."}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href={`/${locale}/consultation`}
            className="inline-flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-9 py-4 rounded-xl transition-colors text-base shadow-lg shadow-green-900/30"
          >
            {locale === "ja" ? "無料相談を始める" : "Get Started Free"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/how-it-works`}
            className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white font-medium px-9 py-4 rounded-xl transition-colors text-base"
          >
            {locale === "ja" ? "ご利用方法" : "How it works"}
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-10">
          {STATS.map(({ value, label_en, label_ja }) => (
            <div key={value} className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-bold text-white">{value}</span>
              <span className="text-sm text-white/50">{locale === "ja" ? label_ja : label_en}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
