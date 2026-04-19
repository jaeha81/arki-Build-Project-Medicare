"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

export function LanguageTopBar() {
  const locale = useLocale();

  return (
    <div className="w-full bg-[#0a0f1e] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end gap-1 py-2">
          <Globe className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
          <span className="text-xs text-white/40 mr-1">
            {locale === "ja" ? "言語" : "Language"}:
          </span>
          <Link
            href="/ja"
            aria-current={locale === "ja" ? "page" : undefined}
            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
              locale === "ja"
                ? "text-[#2bbda4] bg-[#2bbda4]/10"
                : "text-white/50 hover:text-white"
            }`}
          >
            日本語
          </Link>
          <span className="text-white/20 text-xs">|</span>
          <Link
            href="/en"
            aria-current={locale === "en" ? "page" : undefined}
            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
              locale === "en"
                ? "text-[#2bbda4] bg-[#2bbda4]/10"
                : "text-white/50 hover:text-white"
            }`}
          >
            English
          </Link>
        </div>
      </div>
    </div>
  );
}
