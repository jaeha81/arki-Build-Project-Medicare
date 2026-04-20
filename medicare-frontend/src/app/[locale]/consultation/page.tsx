"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useConsultationStore } from "@/stores/consultation-store";
import { apiClient } from "@/lib/api-client";
import type { ConsultationStatusOut } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryQuestions } from "@/components/consultation/CategoryQuestions";

const TOTAL_STEPS = 6;

const step2Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  age_range: z.string().min(1, "Age range required"),
  preferred_language: z.enum(["en", "ja"]),
});

const VERTICAL_OPTIONS = [
  { value: "weight-loss", label_en: "Weight Loss", label_ja: "体重管理" },
  { value: "skin-care", label_en: "Skin Care", label_ja: "スキンケア" },
  { value: "hair-care", label_en: "Hair Care", label_ja: "ヘアケア" },
  { value: "womens-health", label_en: "Women's Health", label_ja: "女性の健康" },
] as const;

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

interface StepIndicatorProps {
  current: number;
  total: number;
  locale: string;
}

function StepIndicator({ current, total, locale }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              s < current
                ? "bg-[#22c55e] text-white"
                : s === current
                ? "bg-[#22c55e] text-white ring-2 ring-[#22c55e] ring-offset-2"
                : "bg-[#f1f5f9] text-[#94a3b8]"
            }`}
          >
            {s < current ? <CheckCircle className="h-4 w-4" /> : s}
          </div>
          {s < total && (
            <div
              className={`h-0.5 w-8 ${s < current ? "bg-[#22c55e]" : "bg-[#e2e8f0]"}`}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-[#64748b]">
        {locale === "ja" ? `${current} / ${total}` : `Step ${current} of ${total}`}
      </span>
    </div>
  );
}

export default function ConsultationPage() {
  const locale = useLocale();
  const router = useRouter();
  const { step, data, nextStep, prevStep, updateData, reset } =
    useConsultationStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isJa = locale === "ja";

  function Step1() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-6">
          {isJa ? "カテゴリーを選択してください" : "Select a Category"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VERTICAL_OPTIONS.map(({ value, label_en, label_ja }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                updateData({ vertical_id: value });
                nextStep();
              }}
              className={`p-5 rounded-xl border-2 text-left font-semibold transition-all hover:border-[#22c55e] ${
                data.vertical_id === value
                  ? "border-[#22c55e] bg-[#f0fdf4]"
                  : "border-[#e2e8f0] bg-white"
              }`}
            >
              {isJa ? label_ja : label_en}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function Step2() {
    const [localData, setLocalData] = useState({
      name: data.name ?? "",
      email: data.email ?? "",
      age_range: data.age_range ?? "",
      preferred_language: (data.preferred_language ?? locale) as "en" | "ja",
    });

    function handleNext() {
      const result = step2Schema.safeParse(localData);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((e) => {
          if (e.path[0]) errs[String(e.path[0])] = e.message;
        });
        setErrors(errs);
        return;
      }
      setErrors({});
      updateData(localData);
      nextStep();
    }

    return (
      <div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-6">
          {isJa ? "基本情報を入力してください" : "Basic Information"}
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="name">{isJa ? "氏名" : "Full Name"} *</Label>
            <Input
              id="name"
              value={localData.name}
              onChange={(e) =>
                setLocalData((p) => ({ ...p, name: e.target.value }))
              }
              className={errors.name ? "border-red-400" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">
              {isJa ? "メールアドレス" : "Email Address"} *
            </Label>
            <Input
              id="email"
              type="email"
              value={localData.email}
              onChange={(e) =>
                setLocalData((p) => ({ ...p, email: e.target.value }))
              }
              className={errors.email ? "border-red-400" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label>{isJa ? "年齢層" : "Age Range"} *</Label>
            <Select
              value={localData.age_range}
              onValueChange={(v) =>
                setLocalData((p) => ({ ...p, age_range: v ?? "" }))
              }
            >
              <SelectTrigger
                className={errors.age_range ? "border-red-400" : ""}
              >
                <SelectValue
                  placeholder={isJa ? "選択してください" : "Select..."}
                />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{isJa ? "希望言語" : "Preferred Language"}</Label>
            <Select
              value={localData.preferred_language}
              onValueChange={(v) =>
                setLocalData((p) => ({
                  ...p,
                  preferred_language: v as "en" | "ja",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isJa ? "戻る" : "Back"}
          </Button>
          <Button
            onClick={handleNext}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
          >
            {isJa ? "次へ" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  function Step3() {
    const [survey, setSurvey] = useState<Record<string, string>>(
      (data.health_survey as Record<string, string>) ?? {}
    );

    const questions = isJa
      ? [
          "主な健康上の悩みを教えてください",
          "現在服用中の薬はありますか？",
          "既往症はありますか？",
          "アレルギーはありますか？",
          "現在の生活習慣について教えてください（運動、食事など）",
        ]
      : [
          "What is your primary health concern?",
          "Are you currently taking any medications?",
          "Do you have any pre-existing conditions?",
          "Do you have any known allergies?",
          "Describe your current lifestyle (exercise, diet, etc.)",
        ];

    return (
      <div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-2">
          {isJa ? "健康アンケート" : "Health Survey"}
        </h2>
        <p className="text-sm text-[#64748b] mb-6">
          {isJa
            ? "以下の情報は医師が適切な治療計画を検討するために使用されます。"
            : "This information helps physicians consider appropriate treatment options for you."}
        </p>
        <div className="space-y-5">
          {questions.map((q, idx) => (
            <div key={idx}>
              <Label className="text-sm text-[#1e293b] mb-1.5 block">{q}</Label>
              <Textarea
                rows={2}
                value={survey[String(idx)] ?? ""}
                onChange={(e) =>
                  setSurvey((p) => ({ ...p, [String(idx)]: e.target.value }))
                }
                className="resize-none"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isJa ? "戻る" : "Back"}
          </Button>
          <Button
            onClick={() => {
              updateData({ health_survey: survey });
              nextStep();
            }}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
          >
            {isJa ? "次へ" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  function Step4() {
    return (
      <CategoryQuestions
        verticalId={data.vertical_id ?? ""}
        locale={locale}
        onBack={prevStep}
        onComplete={(answers) => {
          updateData({ category_answers: answers });
          nextStep();
        }}
      />
    );
  }

  function Step5() {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-2">
          {isJa
            ? "治療の希望（任意）"
            : "Treatment Preferences (Optional)"}
        </h2>
        <p className="text-sm text-[#64748b] mb-6">
          {isJa
            ? "特に希望する治療法や質問がある場合はご記入ください。"
            : "Let us know if you have any specific preferences or questions."}
        </p>
        <Textarea
          rows={4}
          placeholder={
            isJa
              ? "例：特定の薬を避けたい、過去の治療経験など"
              : "e.g., specific medications to avoid, past treatment history..."
          }
          value={
            (data.product_interest as { notes?: string })?.notes ?? ""
          }
          onChange={(e) =>
            updateData({ product_interest: { notes: e.target.value } })
          }
          className="resize-none"
        />
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isJa ? "戻る" : "Back"}
          </Button>
          <Button
            onClick={nextStep}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
          >
            {isJa ? "次へ" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  function Step6() {
    const [consents, setConsents] = useState({
      terms: data.consent_terms ?? false,
      privacy: data.consent_privacy ?? false,
      medical: data.consent_medical ?? false,
    });

    async function handleSubmit() {
      if (!consents.terms || !consents.privacy || !consents.medical) {
        setErrors({
          consent: isJa
            ? "すべての同意事項にチェックしてください"
            : "Please agree to all items",
        });
        return;
      }
      setErrors({});
      setSubmitting(true);
      try {
        await apiClient.post<ConsultationStatusOut>(
          "/api/v1/consultations",
          {
            ...data,
            consent_terms: consents.terms,
            consent_privacy: consents.privacy,
            consent_medical: consents.medical,
          }
        );
        reset();
        router.push(`/${locale}/consultation/success`);
      } catch {
        setErrors({
          submit: isJa
            ? "送信に失敗しました。もう一度お試しください。"
            : "Submission failed. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    }

    const consentItems = isJa
      ? [
          { key: "terms", label: "利用規約に同意します" },
          { key: "privacy", label: "プライバシーポリシーに同意します" },
          {
            key: "medical",
            label: "これは対面診療の代替ではないことを理解しています",
          },
        ]
      : [
          { key: "terms", label: "I agree to the Terms of Use" },
          { key: "privacy", label: "I agree to the Privacy Policy" },
          {
            key: "medical",
            label: "I understand this is not a substitute for in-person medical care",
          },
        ];

    return (
      <div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-6">
          {isJa ? "確認・送信" : "Review & Submit"}
        </h2>
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 mb-6 text-sm space-y-1">
          <p>
            <span className="text-[#64748b]">
              {isJa ? "カテゴリー: " : "Category: "}
            </span>
            {data.vertical_id ?? "—"}
          </p>
          <p>
            <span className="text-[#64748b]">{isJa ? "氏名: " : "Name: "}</span>
            {data.name ?? "—"}
          </p>
          <p>
            <span className="text-[#64748b]">
              {isJa ? "メール: " : "Email: "}
            </span>
            {data.email ?? "—"}
          </p>
        </div>
        <div className="space-y-3 mb-6">
          {consentItems.map(({ key, label }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents[key as keyof typeof consents]}
                onChange={(e) =>
                  setConsents((p) => ({ ...p, [key]: e.target.checked }))
                }
                className="mt-0.5 w-4 h-4 accent-[#22c55e]"
              />
              <span className="text-sm text-[#1e293b]">{label}</span>
            </label>
          ))}
        </div>
        {errors.consent && (
          <p className="text-red-500 text-sm mb-4">{errors.consent}</p>
        )}
        {errors.submit && (
          <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
        )}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={submitting}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isJa ? "戻る" : "Back"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8"
          >
            {submitting
              ? isJa
                ? "送信中..."
                : "Submitting..."
              : isJa
              ? "相談を送信する"
              : "Submit Consultation"}
          </Button>
        </div>
      </div>
    );
  }

  const STEP_COMPONENTS = [Step1, Step2, Step3, Step4, Step5, Step6];
  const CurrentStep = STEP_COMPONENTS[step - 1];

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          {isJa ? "無料相談を始める" : "Start Your Free Consultation"}
        </h1>
        <p className="text-[#64748b] mt-2 text-sm">
          {isJa
            ? "医師への相談が必要です。結果を保証するものではありません。"
            : "Medical consultation required. Results are not guaranteed."}
        </p>
      </div>
      <StepIndicator current={step} total={TOTAL_STEPS} locale={locale} />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
        {CurrentStep && <CurrentStep />}
      </div>
    </div>
  );
}
