import { useTranslations } from "next-intl";
import { ClipboardList, UserCheck, FileText, Package } from "lucide-react";

const STEPS = [
  { icon: ClipboardList, key: "step1" },
  { icon: UserCheck, key: "step2" },
  { icon: FileText, key: "step3" },
  { icon: Package, key: "step4" },
] as const;

export function ProcessSteps() {
  const t = useTranslations("home.process");

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e293b] text-center mb-12">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ icon: Icon, key }, idx) => (
            <div key={key} className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-[#f0fdf4] rounded-full flex items-center justify-center border-2 border-[#bbf7d0]">
                  <Icon className="h-6 w-6 text-[#22c55e]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#22c55e] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>
              <h3 className="font-semibold text-[#1e293b]">{t(`${key}.title`)}</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">{t(`${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
