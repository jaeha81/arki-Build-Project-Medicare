import { useLocale } from "next-intl";
import { ShieldCheck, Lock, Truck, HeartHandshake } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, en: "Licensed Doctors", ja: "認定医師" },
  { icon: Lock, en: "Private & Secure", ja: "プライバシー保護" },
  { icon: Truck, en: "Discreet Delivery", ja: "離散配送" },
  { icon: HeartHandshake, en: "Ongoing Support", ja: "継続サポート" },
] as const;

export function TrustBar() {
  const locale = useLocale();

  return (
    <section className="bg-[#0d1526] border-b border-white/5 py-6 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, en, ja }) => (
            <div key={en} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#22c55e]/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="h-4.5 w-4.5 text-[#22c55e]" />
              </div>
              <span className="text-sm font-medium text-white/70">{locale === "ja" ? ja : en}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
