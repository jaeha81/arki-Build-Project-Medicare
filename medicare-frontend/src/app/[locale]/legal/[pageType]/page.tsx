import { AlertTriangle } from "lucide-react";

interface LegalPageProps {
  params: Promise<{ locale: string; pageType: string }>;
}

interface LegalContent {
  page_type: string;
  title_en: string;
  title_ja: string;
  content_en: string;
  content_ja: string;
  is_draft: boolean;
  version: string;
}

const LEGAL_META: Record<string, { title_en: string; title_ja: string }> = {
  privacy_policy: {
    title_en: "Privacy Policy",
    title_ja: "プライバシーポリシー",
  },
  terms_of_use: {
    title_en: "Terms of Use",
    title_ja: "利用規約",
  },
  medical_disclaimer: {
    title_en: "Medical Disclaimer",
    title_ja: "医療免責事項",
  },
  consultation_notice: {
    title_en: "Consultation Notice",
    title_ja: "相談に関するご案内",
  },
  data_consent: {
    title_en: "Data Consent",
    title_ja: "データ同意書",
  },
};

async function fetchLegalContent(pageType: string): Promise<LegalContent | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${baseUrl}/api/v1/legal/${pageType}`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });
    if (!res.ok) return null;
    return res.json() as Promise<LegalContent>;
  } catch {
    return null;
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, pageType } = await params;
  const meta = LEGAL_META[pageType];

  if (!meta) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-[#64748b]">
          {locale === "ja" ? "ページが見つかりません" : "Page not found"}
        </p>
      </div>
    );
  }

  const content = await fetchLegalContent(pageType);
  const title = locale === "ja" ? meta.title_ja : meta.title_en;
  const isDraft = content?.is_draft ?? true;
  const bodyText = content
    ? locale === "ja"
      ? content.content_ja
      : content.content_en
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* DRAFT banner */}
      {isDraft && (
        <div className="flex items-start gap-3 bg-[#fef3c7] border border-[#fcd34d] rounded-lg p-4 mb-8">
          <AlertTriangle className="h-5 w-5 text-[#d97706] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#92400e] text-sm">
              {locale === "ja"
                ? "下書き — 法的審査中"
                : "DRAFT — Pending Legal Review"}
            </p>
            <p className="text-[#92400e] text-sm mt-0.5">
              {locale === "ja"
                ? "このドキュメントは現在法的審査中です。法的拘束力はありません。"
                : "This document is currently under legal review and is not legally binding."}
            </p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#1e293b] mb-8">{title}</h1>

      <div className="prose prose-slate max-w-none">
        {bodyText ? (
          <div className="text-[#334155] leading-relaxed whitespace-pre-wrap">
            {bodyText}
          </div>
        ) : (
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-8 text-center text-[#64748b]">
            <p className="font-medium mb-2">
              {locale === "ja" ? "コンテンツ準備中" : "Content Pending"}
            </p>
            <p className="text-sm">
              {locale === "ja"
                ? "このページのコンテンツは法務チームによって準備中です。"
                : "The content for this page is being prepared by our legal team."}
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-[#94a3b8] mt-8">
        {content
          ? locale === "ja"
            ? `最終更新: バージョン ${content.version}`
            : `Last updated: Version ${content.version}`
          : locale === "ja"
          ? "最終更新: 審査中 | バージョン: 0.1"
          : "Last updated: Pending review | Version: 0.1"}
      </p>
    </div>
  );
}
