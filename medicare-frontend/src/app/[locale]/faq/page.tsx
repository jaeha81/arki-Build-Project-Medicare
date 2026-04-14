"use client";

import { useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAQS = {
  all: [
    {
      q_en: "How does the consultation process work?",
      q_ja: "相談プロセスはどのように機能しますか？",
      a_en: "Complete our health questionnaire online. A licensed physician reviews your information within 24–48 hours. If appropriate, a treatment plan will be prepared.",
      a_ja: "オンラインで健康アンケートに記入してください。認定医師が24〜48時間以内に確認します。",
    },
    {
      q_en: "Is my health information secure?",
      q_ja: "健康情報は安全ですか？",
      a_en: "Yes. Your data is encrypted and handled per applicable privacy regulations. We never share your data without consent.",
      a_ja: "はい。データは暗号化され、プライバシー規制に従って管理されます。",
    },
    {
      q_en: "Are the doctors licensed?",
      q_ja: "医師は認定されていますか？",
      a_en: "All physicians are fully licensed in Japan. Their credentials are verified before joining our platform.",
      a_ja: "すべての医師は日本で完全に認定されており、プラットフォーム参加前に資格が確認されます。",
    },
    {
      q_en: "Can I cancel my subscription?",
      q_ja: "サブスクリプションはキャンセルできますか？",
      a_en: "Yes, you can cancel anytime from your account dashboard with no cancellation fee.",
      a_ja: "はい、アカウントダッシュボードからいつでもキャンセル料なしにキャンセルできます。",
    },
    {
      q_en: "How long does delivery take?",
      q_ja: "配送にはどのくらいかかりますか？",
      a_en: "Typically 3–5 business days after prescription approval.",
      a_ja: "処方承認後、通常3〜5営業日です。",
    },
    {
      q_en: "Is this a replacement for in-person medical care?",
      q_ja: "これは対面診療の代替ですか？",
      a_en: "No. This platform does not replace in-person care for urgent or complex medical needs. Always consult a physician in person for serious conditions.",
      a_ja: "いいえ。このプラットフォームは緊急または複雑な医療ニーズの対面診療を代替しません。",
    },
    {
      q_en: "Do you ship to all regions of Japan?",
      q_ja: "日本全国に配送しますか？",
      a_en: "We currently ship to most regions of Japan. Please check availability at checkout.",
      a_ja: "現在、日本のほとんどの地域に配送しています。",
    },
    {
      q_en: "What payment methods are accepted?",
      q_ja: "どの支払い方法が利用できますか？",
      a_en: "Payment options coming soon. We are currently setting up secure payment processing.",
      a_ja: "支払いオプションは近日公開予定です。",
    },
  ],
};

const TABS = [
  { value: "all", label_en: "All", label_ja: "すべて" },
  { value: "weight-loss", label_en: "Weight Loss", label_ja: "体重管理" },
  { value: "skin-care", label_en: "Skin Care", label_ja: "スキンケア" },
  { value: "hair-care", label_en: "Hair Care", label_ja: "ヘアケア" },
  { value: "womens-health", label_en: "Women's Health", label_ja: "女性の健康" },
] as const;

export default function FaqPage() {
  const locale = useLocale();

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
      <Tabs defaultValue="all">
        <TabsList className="flex flex-wrap gap-1 h-auto mb-8 bg-[#f1f5f9] p-1 rounded-lg">
          {TABS.map(({ value, label_en, label_ja }) => (
            <TabsTrigger key={value} value={value} className="text-sm rounded-md">
              {locale === "ja" ? label_ja : label_en}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <Accordion className="space-y-2">
            {FAQS.all.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border border-[#e2e8f0] rounded-lg px-4"
              >
                <AccordionTrigger className="text-left font-medium text-[#1e293b] hover:text-[#22c55e] hover:no-underline">
                  {locale === "ja" ? faq.q_ja : faq.q_en}
                </AccordionTrigger>
                <AccordionContent className="text-[#64748b] leading-relaxed">
                  {locale === "ja" ? faq.a_ja : faq.a_en}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        {TABS.slice(1).map(({ value }) => (
          <TabsContent key={value} value={value}>
            <p className="text-[#64748b] text-center py-8">
              {locale === "ja"
                ? "このカテゴリーのFAQは近日公開予定です。"
                : "FAQs for this category coming soon."}
            </p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
