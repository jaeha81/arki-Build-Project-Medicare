"""Questionnaire schema API — returns category-specific question definitions."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

__all__: list[str] = []

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])


class QuestionOption(BaseModel):
    value: str
    label_en: str
    label_ja: str


class Question(BaseModel):
    id: str
    type: str  # text | radio | checkbox | photo
    required: bool
    label_en: str
    label_ja: str
    placeholder_en: str | None = None
    placeholder_ja: str | None = None
    options: list[QuestionOption] | None = None
    contraindication_trigger: str | None = None


_WEIGHT_LOSS_QUESTIONS: list[dict] = [
    {"id": "W-01", "type": "radio", "required": True, "label_en": "Have you ever been diagnosed with medullary thyroid carcinoma or MEN2?", "label_ja": "甲状腺髄様がんまたはMEN2の診断を受けたことがありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "yes"},
    {"id": "W-02", "type": "radio", "required": True, "label_en": "Are you currently pregnant or planning to become pregnant?", "label_ja": "現在妊娠中または妊娠を計画していますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "yes"},
    {"id": "W-03", "type": "radio", "required": True, "label_en": "Do you have a personal or family history of pancreatitis?", "label_ja": "膵炎の個人または家族歴がありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "W-04", "type": "radio", "required": True, "label_en": "Do you have type 1 or type 2 diabetes?", "label_ja": "1型または2型糖尿病がありますか？", "options": [{"value": "type1", "label_en": "Type 1", "label_ja": "1型"}, {"value": "type2", "label_en": "Type 2", "label_ja": "2型"}, {"value": "none", "label_en": "Neither", "label_ja": "なし"}]},
    {"id": "W-05", "type": "text", "required": True, "label_en": "What is your current weight (kg)?", "label_ja": "現在の体重（kg）は？", "placeholder_en": "e.g. 75", "placeholder_ja": "例: 75"},
    {"id": "W-06", "type": "text", "required": True, "label_en": "What is your height (cm)?", "label_ja": "身長（cm）は？", "placeholder_en": "e.g. 170", "placeholder_ja": "例: 170"},
    {"id": "W-07", "type": "text", "required": False, "label_en": "What is your target weight (kg)?", "label_ja": "目標体重（kg）は？", "placeholder_en": "e.g. 65", "placeholder_ja": "例: 65"},
    {"id": "W-08", "type": "radio", "required": True, "label_en": "How long have you been trying to lose weight?", "label_ja": "どのくらいの期間、減量に取り組んでいますか？", "options": [{"value": "less_3m", "label_en": "Less than 3 months", "label_ja": "3か月未満"}, {"value": "3_12m", "label_en": "3–12 months", "label_ja": "3〜12か月"}, {"value": "over_1y", "label_en": "Over 1 year", "label_ja": "1年以上"}]},
    {"id": "W-09", "type": "checkbox", "required": False, "label_en": "Which diets have you tried? (select all that apply)", "label_ja": "これまで試したダイエット法を選んでください（複数可）", "options": [{"value": "calorie", "label_en": "Calorie restriction", "label_ja": "カロリー制限"}, {"value": "keto", "label_en": "Ketogenic", "label_ja": "ケトジェニック"}, {"value": "intermittent", "label_en": "Intermittent fasting", "label_ja": "断食"}, {"value": "exercise", "label_en": "Exercise program", "label_ja": "運動プログラム"}, {"value": "other", "label_en": "Other", "label_ja": "その他"}]},
    {"id": "W-10", "type": "radio", "required": True, "label_en": "How would you describe your current physical activity level?", "label_ja": "現在の運動量を教えてください", "options": [{"value": "sedentary", "label_en": "Sedentary (little or no exercise)", "label_ja": "ほぼ運動しない"}, {"value": "light", "label_en": "Light (1–3 days/week)", "label_ja": "軽め（週1〜3日）"}, {"value": "moderate", "label_en": "Moderate (3–5 days/week)", "label_ja": "中程度（週3〜5日）"}, {"value": "active", "label_en": "Very active (6–7 days/week)", "label_ja": "活発（週6〜7日）"}]},
    {"id": "W-11", "type": "checkbox", "required": False, "label_en": "Do you have any of the following conditions?", "label_ja": "以下の状態に該当するものはありますか？", "options": [{"value": "hypertension", "label_en": "High blood pressure", "label_ja": "高血圧"}, {"value": "dyslipidemia", "label_en": "High cholesterol", "label_ja": "高コレステロール"}, {"value": "sleep_apnea", "label_en": "Sleep apnea", "label_ja": "睡眠時無呼吸"}, {"value": "fatty_liver", "label_en": "Fatty liver", "label_ja": "脂肪肝"}, {"value": "none", "label_en": "None", "label_ja": "なし"}]},
    {"id": "W-12", "type": "radio", "required": True, "label_en": "Do you have a history of eating disorders (anorexia, bulimia)?", "label_ja": "摂食障害（拒食症・過食症）の既往はありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "W-13", "type": "radio", "required": True, "label_en": "Are you currently taking any weight-loss supplements or medications?", "label_ja": "現在、ダイエットサプリや薬を服用していますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "W-14", "type": "text", "required": False, "label_en": "If yes, please list them:", "label_ja": "「はい」の場合、具体的に教えてください", "placeholder_en": "e.g. Metformin, protein supplements", "placeholder_ja": "例: メトホルミン、プロテイン"},
    {"id": "W-15", "type": "radio", "required": True, "label_en": "Do you have any known drug allergies?", "label_ja": "薬物アレルギーはありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "W-16", "type": "text", "required": False, "label_en": "If yes, please describe your allergies:", "label_ja": "「はい」の場合、詳しく教えてください", "placeholder_en": "e.g. Penicillin — rash", "placeholder_ja": "例: ペニシリン→発疹"},
    {"id": "W-17", "type": "text", "required": False, "label_en": "Any additional information for the doctor?", "label_ja": "医師への補足情報があればご記入ください", "placeholder_en": "Other notes...", "placeholder_ja": "その他の備考..."},
]

_HAIR_CARE_QUESTIONS: list[dict] = [
    {"id": "H-01", "type": "radio", "required": True, "label_en": "How long have you been experiencing hair loss?", "label_ja": "抜け毛が始まってどのくらいですか？", "options": [{"value": "less_6m", "label_en": "Less than 6 months", "label_ja": "6か月未満"}, {"value": "6_24m", "label_en": "6–24 months", "label_ja": "6〜24か月"}, {"value": "over_2y", "label_en": "Over 2 years", "label_ja": "2年以上"}]},
    {"id": "H-02", "type": "radio", "required": True, "label_en": "Where is hair loss most noticeable?", "label_ja": "最も気になる部位はどこですか？", "options": [{"value": "crown", "label_en": "Crown/Top", "label_ja": "頭頂部"}, {"value": "hairline", "label_en": "Hairline/Temple", "label_ja": "生え際・こめかみ"}, {"value": "diffuse", "label_en": "Diffuse (all over)", "label_ja": "全体的な薄毛"}, {"value": "patches", "label_en": "Patchy loss", "label_ja": "部分的なはげ"}]},
    {"id": "H-03", "type": "photo", "required": False, "label_en": "Upload a scalp photo (top-down view)", "label_ja": "頭頂部の写真をアップロードしてください"},
    {"id": "H-04", "type": "radio", "required": True, "label_en": "Do you have a family history of hair loss?", "label_ja": "家族に薄毛の方はいますか？", "options": [{"value": "father", "label_en": "Father's side", "label_ja": "父方"}, {"value": "mother", "label_en": "Mother's side", "label_ja": "母方"}, {"value": "both", "label_en": "Both sides", "label_ja": "両方"}, {"value": "none", "label_en": "No family history", "label_ja": "なし"}]},
    {"id": "H-05", "type": "checkbox", "required": False, "label_en": "Do you have any of the following?", "label_ja": "以下の状態に当てはまるものはありますか？", "options": [{"value": "thyroid", "label_en": "Thyroid disorder", "label_ja": "甲状腺疾患"}, {"value": "iron_def", "label_en": "Iron deficiency", "label_ja": "鉄欠乏"}, {"value": "scalp_cond", "label_en": "Scalp condition (seborrheic dermatitis etc.)", "label_ja": "頭皮疾患（脂漏性皮膚炎等）"}, {"value": "none", "label_en": "None", "label_ja": "なし"}]},
    {"id": "H-06", "type": "radio", "required": True, "label_en": "Are you currently using any hair loss treatments?", "label_ja": "現在、育毛・発毛の治療をしていますか？", "options": [{"value": "minoxidil", "label_en": "Minoxidil (topical)", "label_ja": "ミノキシジル（外用）"}, {"value": "finasteride", "label_en": "Finasteride/Dutasteride (oral)", "label_ja": "フィナステリド/デュタステリド（内服）"}, {"value": "other", "label_en": "Other", "label_ja": "その他"}, {"value": "none", "label_en": "None", "label_ja": "なし"}]},
    {"id": "H-07", "type": "radio", "required": True, "label_en": "How would you rate your current hair loss severity? (Norwood scale)", "label_ja": "現在の薄毛の程度を教えてください（ノーウッドスケール）", "options": [{"value": "1_2", "label_en": "Early (Type I–II)", "label_ja": "初期（タイプI〜II）"}, {"value": "3_4", "label_en": "Moderate (Type III–IV)", "label_ja": "中程度（タイプIII〜IV）"}, {"value": "5_7", "label_en": "Advanced (Type V–VII)", "label_ja": "進行（タイプV〜VII）"}, {"value": "unsure", "label_en": "Not sure", "label_ja": "わからない"}]},
    {"id": "H-08", "type": "radio", "required": True, "label_en": "Do you have erectile dysfunction? (for finasteride safety screening)", "label_ja": "勃起不全はありますか？（フィナステリド安全確認）", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}, {"value": "prefer_not", "label_en": "Prefer not to say", "label_ja": "回答しない"}]},
    {"id": "H-09", "type": "radio", "required": True, "label_en": "Are you currently trying to conceive?", "label_ja": "現在、妊活中ですか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "yes"},
    {"id": "H-10", "type": "radio", "required": True, "label_en": "Do you have a history of liver disease?", "label_ja": "肝疾患の既往はありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "H-11", "type": "text", "required": False, "label_en": "Any additional notes for the doctor?", "label_ja": "医師への補足情報があればご記入ください", "placeholder_en": "Other notes...", "placeholder_ja": "その他の備考..."},
]

_WOMENS_HEALTH_QUESTIONS: list[dict] = [
    {"id": "M-01", "type": "radio", "required": True, "label_en": "Are you still having menstrual periods?", "label_ja": "現在も生理はありますか？", "options": [{"value": "regular", "label_en": "Yes, regular", "label_ja": "はい、規則的"}, {"value": "irregular", "label_en": "Yes, irregular", "label_ja": "はい、不規則"}, {"value": "stopped", "label_en": "No, stopped (menopause)", "label_ja": "いいえ、閉経済み"}]},
    {"id": "M-02", "type": "checkbox", "required": False, "label_en": "Which menopausal symptoms are you experiencing? (GCS-21)", "label_ja": "以下の更年期症状で当てはまるものを選んでください（複数可）", "options": [{"value": "hot_flash", "label_en": "Hot flashes", "label_ja": "ほてり・のぼせ"}, {"value": "night_sweat", "label_en": "Night sweats", "label_ja": "夜間発汗"}, {"value": "sleep", "label_en": "Sleep disturbance", "label_ja": "睡眠障害"}, {"value": "mood", "label_en": "Mood changes / irritability", "label_ja": "気分の変化・イライラ"}, {"value": "anxiety", "label_en": "Anxiety / depression", "label_ja": "不安・抑うつ"}, {"value": "fatigue", "label_en": "Fatigue", "label_ja": "疲労感"}, {"value": "libido", "label_en": "Decreased libido", "label_ja": "性欲低下"}, {"value": "vaginal", "label_en": "Vaginal dryness", "label_ja": "膣乾燥"}, {"value": "joint", "label_en": "Joint / muscle pain", "label_ja": "関節・筋肉痛"}, {"value": "memory", "label_en": "Memory/concentration issues", "label_ja": "記憶力・集中力低下"}, {"value": "headache", "label_en": "Headaches", "label_ja": "頭痛"}]},
    {"id": "M-03", "type": "radio", "required": True, "label_en": "Have you ever had breast cancer or are at high risk?", "label_ja": "乳がんの既往または高リスクがありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "yes"},
    {"id": "M-04", "type": "radio", "required": True, "label_en": "Have you had a hysterectomy?", "label_ja": "子宮摘出手術を受けたことはありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "M-05", "type": "radio", "required": True, "label_en": "Do you have a history of blood clots (DVT or PE)?", "label_ja": "血栓症（深部静脈血栓症・肺塞栓症）の既往はありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "yes"},
    {"id": "M-06", "type": "radio", "required": True, "label_en": "Do you have unexplained vaginal bleeding?", "label_ja": "原因不明の性器出血はありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "yes"},
    {"id": "M-07", "type": "radio", "required": True, "label_en": "Are you currently using any hormone therapy?", "label_ja": "現在、ホルモン療法を受けていますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "M-08", "type": "radio", "required": True, "label_en": "How severe are your symptoms overall?", "label_ja": "全体的な症状の重さはどのくらいですか？", "options": [{"value": "mild", "label_en": "Mild — manageable", "label_ja": "軽度 — 日常生活に支障なし"}, {"value": "moderate", "label_en": "Moderate — affecting daily life", "label_ja": "中等度 — 日常生活に影響あり"}, {"value": "severe", "label_en": "Severe — significantly impacting life", "label_ja": "重度 — 生活が大きく制限される"}]},
    {"id": "M-09", "type": "text", "required": False, "label_en": "Any additional information for the doctor?", "label_ja": "医師への補足情報があればご記入ください", "placeholder_en": "Other notes...", "placeholder_ja": "その他の備考..."},
]

_SKIN_CARE_QUESTIONS: list[dict] = [
    {"id": "S-01", "type": "radio", "required": True, "label_en": "What is your primary skin concern?", "label_ja": "主なお肌のお悩みを教えてください", "options": [{"value": "acne", "label_en": "Acne / breakouts", "label_ja": "にきび・吹き出物"}, {"value": "aging", "label_en": "Aging / wrinkles", "label_ja": "エイジング・しわ"}, {"value": "pigment", "label_en": "Pigmentation / dark spots", "label_ja": "色素沈着・シミ"}, {"value": "rosacea", "label_en": "Rosacea / redness", "label_ja": "酒さ・赤み"}, {"value": "dryness", "label_en": "Dryness / eczema", "label_ja": "乾燥・湿疹"}]},
    {"id": "S-02", "type": "radio", "required": True, "label_en": "What is your skin type?", "label_ja": "肌質を教えてください", "options": [{"value": "dry", "label_en": "Dry", "label_ja": "乾燥肌"}, {"value": "oily", "label_en": "Oily", "label_ja": "脂性肌"}, {"value": "combination", "label_en": "Combination", "label_ja": "混合肌"}, {"value": "sensitive", "label_en": "Sensitive", "label_ja": "敏感肌"}, {"value": "normal", "label_en": "Normal", "label_ja": "普通肌"}]},
    {"id": "S-03", "type": "photo", "required": False, "label_en": "Upload a photo of the affected skin area", "label_ja": "気になる部位の写真をアップロードしてください"},
    {"id": "S-04", "type": "radio", "required": True, "label_en": "How long have you had this concern?", "label_ja": "悩み始めてどのくらいですか？", "options": [{"value": "new", "label_en": "New (less than 1 month)", "label_ja": "最近（1か月未満）"}, {"value": "recent", "label_en": "1–6 months", "label_ja": "1〜6か月"}, {"value": "chronic", "label_en": "Over 6 months", "label_ja": "6か月以上"}]},
    {"id": "S-05", "type": "checkbox", "required": False, "label_en": "Which prescription or OTC products have you tried?", "label_ja": "これまで試したスキンケア・治療を教えてください（複数可）", "options": [{"value": "retinoids", "label_en": "Retinoids", "label_ja": "レチノイド"}, {"value": "antibiotics", "label_en": "Topical antibiotics", "label_ja": "抗菌外用剤"}, {"value": "steroids", "label_en": "Topical steroids", "label_ja": "ステロイド外用剤"}, {"value": "acids", "label_en": "AHA/BHA acids", "label_ja": "AHA/BHAピーリング"}, {"value": "none", "label_en": "None", "label_ja": "なし"}]},
    {"id": "S-06", "type": "radio", "required": True, "label_en": "Are you pregnant or breastfeeding?", "label_ja": "妊娠中または授乳中ですか？", "options": [{"value": "pregnant", "label_en": "Pregnant", "label_ja": "妊娠中"}, {"value": "breastfeeding", "label_en": "Breastfeeding", "label_ja": "授乳中"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}], "contraindication_trigger": "pregnant"},
    {"id": "S-07", "type": "radio", "required": True, "label_en": "Do you have known allergies to skincare ingredients?", "label_ja": "スキンケア成分へのアレルギーはありますか？", "options": [{"value": "yes", "label_en": "Yes", "label_ja": "はい"}, {"value": "no", "label_en": "No", "label_ja": "いいえ"}]},
    {"id": "S-08", "type": "text", "required": False, "label_en": "Any additional information for the doctor?", "label_ja": "医師への補足情報があればご記入ください", "placeholder_en": "Other notes...", "placeholder_ja": "その他の備考..."},
]

_VERTICAL_QUESTIONS: dict[str, list[dict]] = {
    "weight-loss": _WEIGHT_LOSS_QUESTIONS,
    "hair-care": _HAIR_CARE_QUESTIONS,
    "womens-health": _WOMENS_HEALTH_QUESTIONS,
    "skin-care": _SKIN_CARE_QUESTIONS,
}


@router.get("/{vertical_id}", response_model=list[Question])
async def get_questionnaire(vertical_id: str) -> list[Question]:
    """Return the list of category-specific questions for a vertical."""
    questions = _VERTICAL_QUESTIONS.get(vertical_id)
    if questions is None:
        raise HTTPException(status_code=404, detail=f"No questionnaire found for vertical: {vertical_id}")
    return [Question(**q) for q in questions]
