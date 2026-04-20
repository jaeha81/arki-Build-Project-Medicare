"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, AlertTriangle, Upload } from "lucide-react"

type VerticalId = "weight-loss" | "skin-care" | "hair-care" | "womens-health"

interface QuestionOption {
  en: string
  ja: string
  value: string
}

interface Question {
  id: string
  en: string
  ja: string
  type: "text" | "radio" | "checkbox" | "photo"
  options?: QuestionOption[]
  contraindication?: boolean
}

const weightLossQuestions: Question[] = [
  { id: "W-01", en: "Current weight (kg)?", ja: "現在の体重（kg）は？", type: "text" },
  { id: "W-02", en: "Height (cm)?", ja: "身長（cm）は？", type: "text" },
  { id: "W-03", en: "Target weight (kg)?", ja: "目標体重（kg）は？", type: "text" },
  { id: "W-04", en: "How long have you been trying to lose weight?", ja: "どのくらい減量に取り組んでいますか？", type: "text" },
  { id: "W-05", en: "Have you tried weight loss medications before? If yes, which ones?", ja: "以前に減量薬を使用したことがありますか？", type: "text" },
  {
    id: "W-06", en: "Do you have Type 2 diabetes or pre-diabetes?", ja: "2型糖尿病または前糖尿病はありますか？", type: "radio",
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }, { en: "Not sure", ja: "わからない", value: "unsure" }],
  },
  {
    id: "W-07", en: "Do you have high blood pressure?", ja: "高血圧はありますか？", type: "radio",
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  {
    id: "W-08", en: "Do you have high cholesterol or triglycerides?", ja: "高コレステロールや中性脂肪の問題はありますか？", type: "radio",
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  {
    id: "W-09", en: "Personal or family history of medullary thyroid cancer (MTC)?", ja: "甲状腺髄様癌（MTC）の個人または家族歴はありますか？",
    type: "radio", contraindication: true,
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }, { en: "Not sure", ja: "わからない", value: "unsure" }],
  },
  {
    id: "W-10", en: "History of Multiple Endocrine Neoplasia syndrome type 2 (MEN2)?", ja: "多発性内分泌腫瘍症2型（MEN2）の病歴はありますか？",
    type: "radio", contraindication: true,
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }, { en: "Not sure", ja: "わからない", value: "unsure" }],
  },
  {
    id: "W-11", en: "History of pancreatitis?", ja: "膵炎の既往症はありますか？", type: "radio",
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  {
    id: "W-12", en: "Are you pregnant or planning to become pregnant?", ja: "妊娠中または妊娠を計画していますか？",
    type: "radio", contraindication: true,
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  { id: "W-13", en: "Describe your typical daily diet", ja: "典型的な1日の食事を教えてください", type: "text" },
  {
    id: "W-14", en: "How often do you exercise per week?", ja: "週に何回運動しますか？", type: "radio",
    options: [{ en: "Never", ja: "しない", value: "never" }, { en: "1–2 times", ja: "1〜2回", value: "1-2" }, { en: "3–4 times", ja: "3〜4回", value: "3-4" }, { en: "5+ times", ja: "5回以上", value: "5+" }],
  },
  {
    id: "W-15", en: "Do you experience binge eating or emotional eating?", ja: "過食や感情的な食事をすることはありますか？", type: "radio",
    options: [{ en: "Often", ja: "よくある", value: "often" }, { en: "Sometimes", ja: "時々", value: "sometimes" }, { en: "Rarely", ja: "まれに", value: "rarely" }, { en: "Never", ja: "ない", value: "never" }],
  },
  { id: "W-16", en: "Any digestive issues (IBS, GERD, etc.)?", ja: "消化器系の問題（IBS、逆流性食道炎など）はありますか？", type: "text" },
  { id: "W-17", en: "Additional information about your weight loss goals", ja: "減量目標についての追加情報があれば", type: "text" },
]

const hairCareQuestions: Question[] = [
  {
    id: "H-01", en: "How long have you been experiencing hair loss?", ja: "脱毛が始まってどのくらいになりますか？", type: "radio",
    options: [{ en: "Less than 6 months", ja: "6ヶ月未満", value: "lt6m" }, { en: "6–12 months", ja: "6〜12ヶ月", value: "6-12m" }, { en: "1–3 years", ja: "1〜3年", value: "1-3y" }, { en: "More than 3 years", ja: "3年以上", value: "gt3y" }],
  },
  {
    id: "H-02", en: "Where is the hair loss occurring?", ja: "脱毛はどの部位で起きていますか？", type: "radio",
    options: [{ en: "Crown / top of head", ja: "頭頂部", value: "crown" }, { en: "Hairline (temples/forehead)", ja: "生え際", value: "hairline" }, { en: "All over", ja: "全体的に", value: "all" }, { en: "Patchy", ja: "斑状", value: "patchy" }],
  },
  {
    id: "H-03", en: "Do you have a family history of hair loss?", ja: "脱毛の家族歴はありますか？", type: "radio",
    options: [{ en: "Yes (maternal)", ja: "はい（母方）", value: "maternal" }, { en: "Yes (paternal)", ja: "はい（父方）", value: "paternal" }, { en: "Both sides", ja: "両方", value: "both" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  { id: "H-04", en: "Have you used any hair loss treatments before?", ja: "以前に脱毛治療を受けたことがありますか？", type: "text" },
  {
    id: "H-05", en: "Do you experience scalp itching, flaking, or redness?", ja: "頭皮のかゆみ、フケ、赤みはありますか？", type: "radio",
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  {
    id: "H-06", en: "Have you experienced significant stress recently?", ja: "最近、大きなストレスを経験しましたか？", type: "radio",
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  { id: "H-07", en: "Any recent hormonal changes (pregnancy, menopause, thyroid)?", ja: "最近ホルモンの変化がありましたか（妊娠・更年期・甲状腺）？", type: "text" },
  { id: "H-08", en: "Describe your current hair care routine", ja: "現在のヘアケアルーティンを教えてください", type: "text" },
  {
    id: "H-09", en: "How often do you use heat styling tools?", ja: "ヘアアイロンやドライヤーをどのくらい使用しますか？", type: "radio",
    options: [{ en: "Daily", ja: "毎日", value: "daily" }, { en: "Several times/week", ja: "週に数回", value: "weekly" }, { en: "Rarely", ja: "まれに", value: "rarely" }, { en: "Never", ja: "使わない", value: "never" }],
  },
  { id: "H-10", en: "Upload a photo of your scalp / hairline (optional)", ja: "頭皮・生え際の写真をアップロードしてください（任意）", type: "photo" },
  { id: "H-11", en: "Additional comments about your hair loss concerns", ja: "脱毛に関する追加コメント", type: "text" },
]

const womensHealthQuestions: Question[] = [
  {
    id: "M-01", en: "Current menstrual status?", ja: "現在の月経の状態は？", type: "radio",
    options: [{ en: "Regular periods", ja: "規則的な月経", value: "regular" }, { en: "Irregular periods", ja: "不規則な月経", value: "irregular" }, { en: "Perimenopause", ja: "更年期前期", value: "perimenopause" }, { en: "Postmenopause (12+ months)", ja: "閉経後（12ヶ月以上）", value: "postmenopause" }],
  },
  {
    id: "M-02", en: "Select all symptoms you are currently experiencing:", ja: "現在経験している症状を選択してください（複数可）：",
    type: "checkbox",
    options: [
      { en: "Hot flashes", ja: "ほてり（ホットフラッシュ）", value: "hot_flashes" },
      { en: "Night sweats", ja: "寝汗", value: "night_sweats" },
      { en: "Sleep disturbances", ja: "睡眠障害", value: "sleep" },
      { en: "Mood changes / irritability", ja: "気分の変動・イライラ", value: "mood" },
      { en: "Vaginal dryness", ja: "膣の乾燥", value: "vaginal_dryness" },
      { en: "Decreased libido", ja: "性欲低下", value: "libido" },
      { en: "Memory / concentration issues", ja: "記憶力・集中力の低下", value: "cognitive" },
      { en: "Joint pain", ja: "関節痛", value: "joint_pain" },
      { en: "Weight gain", ja: "体重増加", value: "weight" },
      { en: "Fatigue", ja: "疲労感", value: "fatigue" },
    ],
  },
  {
    id: "M-03", en: "Symptom severity (1–10)?", ja: "症状の重さ（1〜10）は？", type: "radio",
    options: [{ en: "Mild (1–3)", ja: "軽度（1〜3）", value: "mild" }, { en: "Moderate (4–6)", ja: "中等度（4〜6）", value: "moderate" }, { en: "Severe (7–10)", ja: "重度（7〜10）", value: "severe" }],
  },
  {
    id: "M-04", en: "Have you previously used hormone replacement therapy (HRT)?", ja: "以前にホルモン補充療法（HRT）を使用したことがありますか？", type: "radio",
    options: [{ en: "Yes, currently", ja: "はい、現在使用中", value: "current" }, { en: "Yes, in the past", ja: "はい、過去に使用", value: "past" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  {
    id: "M-05", en: "Personal or family history of breast cancer?", ja: "乳がんの個人または家族歴はありますか？",
    type: "radio", contraindication: true,
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }, { en: "Not sure", ja: "わからない", value: "unsure" }],
  },
  {
    id: "M-06", en: "History of blood clots or stroke?", ja: "血栓や脳卒中の病歴はありますか？",
    type: "radio", contraindication: true,
    options: [{ en: "Yes", ja: "はい", value: "yes" }, { en: "No", ja: "いいえ", value: "no" }],
  },
  {
    id: "M-07", en: "Do you smoke?", ja: "喫煙しますか？", type: "radio",
    options: [{ en: "Current smoker", ja: "現在喫煙中", value: "current" }, { en: "Former smoker", ja: "過去に喫煙", value: "former" }, { en: "Never", ja: "喫煙歴なし", value: "never" }],
  },
  {
    id: "M-08", en: "How much do symptoms affect your daily life?", ja: "症状は日常生活にどの程度影響していますか？", type: "radio",
    options: [{ en: "Minimally", ja: "ほとんど影響なし", value: "minimal" }, { en: "Moderately", ja: "ある程度影響あり", value: "moderate" }, { en: "Significantly", ja: "大きく影響あり", value: "significant" }],
  },
  { id: "M-09", en: "Additional information or specific concerns", ja: "追加情報や特定の懸念事項があればご記入ください", type: "text" },
]

const skinCareQuestions: Question[] = [
  {
    id: "S-01", en: "Primary skin concern?", ja: "主な肌の悩みは何ですか？", type: "radio",
    options: [
      { en: "Acne / breakouts", ja: "ニキビ・吹き出物", value: "acne" },
      { en: "Aging / wrinkles", ja: "老化・シワ", value: "aging" },
      { en: "Hyperpigmentation / dark spots", ja: "色素沈着・シミ", value: "pigmentation" },
      { en: "Redness / rosacea", ja: "赤み・酒さ", value: "redness" },
      { en: "Dryness / eczema", ja: "乾燥・湿疹", value: "dryness" },
      { en: "Other", ja: "その他", value: "other" },
    ],
  },
  {
    id: "S-02", en: "Skin type?", ja: "肌タイプは？", type: "radio",
    options: [{ en: "Oily", ja: "脂性肌", value: "oily" }, { en: "Dry", ja: "乾燥肌", value: "dry" }, { en: "Combination", ja: "混合肌", value: "combination" }, { en: "Normal", ja: "普通肌", value: "normal" }, { en: "Sensitive", ja: "敏感肌", value: "sensitive" }],
  },
  {
    id: "S-03", en: "How long have you had this skin concern?", ja: "この肌の悩みはどのくらい続いていますか？", type: "radio",
    options: [{ en: "Less than 1 month", ja: "1ヶ月未満", value: "lt1m" }, { en: "1–6 months", ja: "1〜6ヶ月", value: "1-6m" }, { en: "6 months – 2 years", ja: "6ヶ月〜2年", value: "6m-2y" }, { en: "More than 2 years", ja: "2年以上", value: "gt2y" }],
  },
  { id: "S-04", en: "What skin products do you currently use?", ja: "現在使用しているスキンケア製品を教えてください", type: "text" },
  { id: "S-05", en: "Have you used prescription skin treatments before?", ja: "以前に処方された皮膚治療を受けたことがありますか？", type: "text" },
  { id: "S-06", en: "Any known skin allergies or sensitivities?", ja: "肌のアレルギーや過敏症はありますか？", type: "text" },
  { id: "S-07", en: "Upload a photo of the affected area (optional)", ja: "患部の写真をアップロードしてください（任意）", type: "photo" },
  { id: "S-08", en: "Any additional skin concerns or information", ja: "肌について追加情報や懸念事項があれば", type: "text" },
]

const QUESTIONS_MAP: Record<VerticalId, Question[]> = {
  "weight-loss": weightLossQuestions,
  "hair-care": hairCareQuestions,
  "womens-health": womensHealthQuestions,
  "skin-care": skinCareQuestions,
}

interface CategoryQuestionsProps {
  verticalId: string
  locale: string
  onBack: () => void
  onComplete: (answers: Record<string, unknown>) => void
}

export function CategoryQuestions({ verticalId, locale, onBack, onComplete }: CategoryQuestionsProps) {
  const questions = QUESTIONS_MAP[verticalId as VerticalId] ?? []
  const isJa = locale === "ja"
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [checkboxState, setCheckboxState] = useState<Record<string, string[]>>({})
  const [contraindication, setContraindication] = useState<string | null>(null)

  function handleRadio(qid: string, value: string, isContraindication?: boolean) {
    setAnswers((p) => ({ ...p, [qid]: value }))
    if (isContraindication && value === "yes") {
      setContraindication(qid)
    } else if (contraindication === qid && value !== "yes") {
      setContraindication(null)
    }
  }

  function handleCheckbox(qid: string, value: string, checked: boolean) {
    setCheckboxState((p) => {
      const prev = p[qid] ?? []
      const next = checked ? [...prev, value] : prev.filter((v) => v !== value)
      return { ...p, [qid]: next }
    })
    setAnswers((p) => ({
      ...p,
      [qid]: checkboxState[qid] ? [...(checkboxState[qid] ?? []), ...(checked ? [value] : [])].filter((v) => checked || v !== value) : checked ? [value] : [],
    }))
  }

  function handleText(qid: string, value: string) {
    setAnswers((p) => ({ ...p, [qid]: value }))
  }

  function handleNext() {
    const merged = { ...answers }
    Object.entries(checkboxState).forEach(([k, v]) => { merged[k] = v })
    onComplete(merged)
  }

  if (questions.length === 0) {
    return (
      <div>
        <p className="text-[#64748b] text-sm">{isJa ? "追加の質問はありません。" : "No additional questions for this category."}</p>
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>{isJa ? "戻る" : "Back"}</Button>
          <Button onClick={() => onComplete({})} className="bg-[#22c55e] hover:bg-[#16a34a] text-white">{isJa ? "次へ" : "Next"}</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1e293b] mb-2">
        {isJa ? "カテゴリー別問診" : "Category-Specific Questions"}
      </h2>
      <p className="text-sm text-[#64748b] mb-6">
        {isJa
          ? "選択されたカテゴリーに関連する詳細情報をお聞かせください。"
          : "Please answer the following questions related to your selected category."}
      </p>

      {contraindication && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
          <span>
            {isJa
              ? "ご回答内容に基づき、医師が安全性を確認した上でご案内いたします。"
              : "Based on your answer, a physician will review your safety profile before making recommendations."}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const label = isJa ? q.ja : q.en
          return (
            <div key={q.id}>
              <Label className="text-sm font-medium text-[#1e293b] mb-2 block">
                <span className="text-xs text-[#94a3b8] mr-1">{q.id}</span>
                {label}
                {q.contraindication && (
                  <span className="ml-1 text-xs text-amber-600 font-normal">{isJa ? "（安全確認）" : "(safety check)"}</span>
                )}
              </Label>

              {q.type === "text" && (
                <Textarea
                  rows={2}
                  className="resize-none"
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => handleText(q.id, e.target.value)}
                />
              )}

              {q.type === "radio" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleRadio(q.id, opt.value, q.contraindication)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                          selected
                            ? "border-[#22c55e] bg-[#f0fdf4] text-[#16a34a] font-medium"
                            : "border-[#e2e8f0] bg-white text-[#475569] hover:border-[#22c55e]"
                        }`}
                      >
                        {isJa ? opt.ja : opt.en}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === "checkbox" && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const checked = (checkboxState[q.id] ?? []).includes(opt.value)
                    return (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleCheckbox(q.id, opt.value, e.target.checked)}
                          className="w-4 h-4 accent-[#22c55e]"
                        />
                        <span className="text-sm text-[#1e293b]">{isJa ? opt.ja : opt.en}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {q.type === "photo" && (
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-[#94a3b8]" />
                  <p className="text-sm text-[#64748b]">
                    {isJa ? "写真をドラッグ＆ドロップ、またはクリックして選択" : "Drag & drop or click to select a photo"}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    {isJa ? "JPEG・PNG・最大10MB" : "JPEG · PNG · up to 10 MB"}
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setAnswers((p) => ({ ...p, [q.id]: file.name }))
                    }}
                    id={`photo-${q.id}`}
                  />
                  <label
                    htmlFor={`photo-${q.id}`}
                    className="mt-3 inline-block px-4 py-1.5 rounded-lg border border-[#e2e8f0] text-sm text-[#475569] cursor-pointer hover:border-[#22c55e] hover:text-[#22c55e] transition-colors"
                  >
                    {answers[q.id]
                      ? String(answers[q.id])
                      : isJa ? "ファイルを選択" : "Choose file"}
                  </label>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {isJa ? "戻る" : "Back"}
        </Button>
        <Button onClick={handleNext} className="bg-[#22c55e] hover:bg-[#16a34a] text-white">
          {isJa ? "次へ" : "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
