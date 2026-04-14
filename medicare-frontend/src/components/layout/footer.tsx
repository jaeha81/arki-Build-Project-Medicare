import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Leaf } from "lucide-react";

const LEGAL_LINKS = [
  { href: "/legal/privacy_policy", labelKey: "privacy" },
  { href: "/legal/terms_of_use", labelKey: "terms" },
  { href: "/legal/medical_disclaimer", labelKey: "disclaimer" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-[#1e293b] text-[#94a3b8] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Leaf className="h-5 w-5 text-[#22c55e]" />
              Medicare
            </div>
            <p className="text-sm leading-relaxed">{t("complianceNote")}</p>
          </div>
          {/* Legal links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map(({ href, labelKey }) => (
                <li key={href}>
                  <Link
                    href={`/${locale}${href}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              {t("contact")}
            </h3>
            <p className="text-sm">support@medicare-platform.com</p>
          </div>
        </div>
        <div className="border-t border-[#334155] pt-6 text-sm text-center">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
