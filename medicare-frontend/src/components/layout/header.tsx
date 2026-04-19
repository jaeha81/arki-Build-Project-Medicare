"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/category/weight-loss", labelKey: "weightLoss" },
  { href: "/category/skin-care", labelKey: "skinCare" },
  { href: "/category/hair-care", labelKey: "hairCare" },
  { href: "/category/womens-health", labelKey: "womensHealth" },
  { href: "/how-it-works", labelKey: "howItWorks" },
  { href: "/faq", labelKey: "faq" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const otherLocale = locale === "en" ? "ja" : "en";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center font-bold text-xl tracking-tight">
            <span className="text-[#1e293b]">medi</span><span className="text-[#22c55e]">pic</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className="text-sm text-[#64748b] hover:text-[#22c55e] transition-colors font-medium"
              >
                {t(labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={`/${otherLocale}`}
              className="text-sm text-[#64748b] hover:text-[#1e293b] font-medium px-2"
            >
              {otherLocale === "ja" ? "日本語" : "EN"}
            </Link>
            <Button
              render={<Link href={`/${locale}/consultation`} />}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg px-5"
            >
              {t("startConsultation")}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden p-2 text-[#64748b]" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-lg tracking-tight"><span className="text-[#1e293b]">medi</span><span className="text-[#22c55e]">pic</span></span>
                  <button onClick={() => setOpen(false)}>
                    <X className="h-5 w-5 text-[#64748b]" />
                  </button>
                </div>
                <nav className="flex flex-col gap-4 flex-1">
                  {NAV_ITEMS.map(({ href, labelKey }) => (
                    <Link
                      key={href}
                      href={`/${locale}${href}`}
                      className="text-base text-[#1e293b] hover:text-[#22c55e] font-medium py-1"
                      onClick={() => setOpen(false)}
                    >
                      {t(labelKey)}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t border-[#e2e8f0]">
                  <Link
                    href={`/${otherLocale}`}
                    className="text-sm text-[#64748b] font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {otherLocale === "ja" ? "日本語で見る" : "View in English"}
                  </Link>
                  <Button
                    render={<Link href={`/${locale}/consultation`} onClick={() => setOpen(false)} />}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white w-full"
                  >
                    {t("startConsultation")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
