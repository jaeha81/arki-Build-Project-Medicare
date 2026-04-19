"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFaqs } from "@/hooks/use-catalog";
import type { FAQ } from "@/types";

const TABS = [
  { value: "all", label_en: "All", label_ja: "すべて" },
  { value: "weight-loss", label_en: "Weight Loss", label_ja: "体重管理" },
  { value: "skin-care", label_en: "Skin Care", label_ja: "スキンケア" },
  { value: "hair-care", label_en: "Hair Care", label_ja: "ヘアケア" },
  { value: "womens-health", label_en: "Women's Health", label_ja: "女性の健康" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function FaqList({ vertical, locale }: { vertical: TabValue; locale: string }) {
  const slug = vertical === "all" ? undefined : vertical;
  const { data, isLoading, isError } = useFaqs(slug);

  if (isLoading)
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full bg-[#f1f5f9] rounded-lg animate-pulse" />
        ))}
      </div>
    );

  if (isError)
    return (
      <p className="text-[#ef4444] text-center py-8">
        {locale === "ja" ? "FAQを読み込めませんでした。" : "Failed to load FAQs."}
      </p>
    );

  const items = (data ?? []).filter((f: FAQ) => f.is_active !== false);

  if (items.length === 0)
    return (
      <p className="text-[#64748b] text-center py-8">
        {locale === "ja"
          ? "このカテゴリーのFAQは近日公開予定です。"
          : "FAQs for this category coming soon."}
      </p>
    );

  return (
    <Accordion className="space-y-2">
      {items.map((faq: FAQ, idx: number) => (
        <AccordionItem
          key={faq.id ?? idx}
          value={`faq-${faq.id ?? idx}`}
          className="border border-[#e2e8f0] rounded-lg px-4"
        >
          <AccordionTrigger className="text-left font-medium text-[#1e293b] hover:text-[#22c55e] hover:no-underline">
            {locale === "ja" ? faq.question_ja : faq.question_en}
          </AccordionTrigger>
          <AccordionContent className="text-[#64748b] leading-relaxed">
            {locale === "ja" ? faq.answer_ja : faq.answer_en}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function FaqPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-4">
        {locale === "ja" ? "よくある質問" : "Frequently Asked Questions"}
      </h1>
      <p className="text-center text-[#64748b] mb-10">
        {locale === "ja"
          ? "ご不明な点がございましたらお気軽にお問い合わせください。"
          : "Can't find what you're looking for? Contact our support team."}
      </p>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="flex flex-wrap gap-1 h-auto mb-8 bg-[#f1f5f9] p-1 rounded-lg">
          {TABS.map(({ value, label_en, label_ja }) => (
            <TabsTrigger key={value} value={value} className="text-sm rounded-md">
              {locale === "ja" ? label_ja : label_en}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value }) => (
          <TabsContent key={value} value={value}>
            <FaqList vertical={value} locale={locale} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
