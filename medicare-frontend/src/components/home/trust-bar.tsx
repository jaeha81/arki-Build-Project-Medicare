import { useTranslations } from "next-intl";
import { ShieldCheck, Lock, Truck, HeartHandshake } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, key: "licensedDoctors" },
  { icon: Lock, key: "privacyFirst" },
  { icon: Truck, key: "fastDelivery" },
  { icon: HeartHandshake, key: "ongoing" },
] as const;

export function TrustBar() {
  const t = useTranslations("home.trust");

  return (
    <section className="bg-white border-y border-[#e2e8f0] py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, key }) => (
            <div key={key} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-[#f0fdf4] rounded-full flex items-center justify-center">
                <Icon className="h-5 w-5 text-[#22c55e]" />
              </div>
              <span className="text-sm font-medium text-[#1e293b]">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
