import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Static preview FAQs — full list loaded from API on /faq page
const FAQ_PREVIEW_EN = [
  {
    q: "How does the consultation process work?",
    a: "Complete our short health questionnaire online. A licensed physician reviews your information within 24–48 hours. If appropriate, a personalized treatment plan will be prepared for you.",
  },
  {
    q: "Is my health information secure?",
    a: "Yes. Your data is encrypted and handled in accordance with applicable privacy regulations. We never share your personal information without your consent.",
  },
  {
    q: "Are the doctors licensed?",
    a: "All physicians on our platform are fully licensed in Japan. Their credentials are verified before joining the platform.",
  },
  {
    q: "Is this a replacement for in-person medical care?",
    a: "No. This platform connects you with licensed physicians for online consultations. It does not replace in-person care for urgent or complex medical conditions.",
  },
];

const FAQ_PREVIEW_JA = [
  {
    q: "相談プロセスはどのように機能しますか？",
    a: "オンラインで短い健康アンケートにお答えください。認定医師が24〜48時間以内に確認します。適切な場合、パーソナライズされた治療計画を作成します。",
  },
  {
    q: "健康情報は安全ですか？",
    a: "はい。データは暗号化され、適用されるプライバシー規制に従って管理されます。同意なしに個人情報を共有することはありません。",
  },
  {
    q: "医師は認定されていますか？",
    a: "当プラットフォームのすべての医師は日本で完全に認定されています。参加前に資格が確認されます。",
  },
  {
    q: "これは対面診療の代替ですか？",
    a: "いいえ。このプラットフォームはオンライン相談のために認定医師とつなぎます。緊急または複雑な医療状態の対面診療の代替ではありません。",
  },
];

export function FaqPreview() {
  const t = useTranslations("home.faqPreview");
  const locale = useLocale();
  const faqs = locale === "ja" ? FAQ_PREVIEW_JA : FAQ_PREVIEW_EN;

  return (
    <section className="py-20 px-6 bg-[#0d1526]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
          {t("title")}
        </h2>
        <Accordion className="space-y-2">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-white/10 rounded-lg px-4 bg-white/5"
            >
              <AccordionTrigger className="text-left text-white font-medium hover:text-[#22c55e] hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/55 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/faq`}
            className="text-[#22c55e] hover:text-[#4ade80] font-medium text-sm transition-colors"
          >
            {locale === "ja" ? "すべての質問を見る →" : "View all FAQs →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
