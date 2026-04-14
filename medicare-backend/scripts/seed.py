"""
시드 데이터 스크립트
실행: python scripts/seed.py
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.config import settings
from app.models import (
    Base, Vertical, Product, ProductVariant, FAQ, LegalContent, AgentConfiguration
)

engine = create_async_engine(settings.database_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

VERTICALS = [
    {
        "slug": "weight-loss",
        "name_en": "Weight Loss",
        "name_ja": "体重管理",
        "description_en": "Medically supervised weight management programs tailored to your goals.",
        "description_ja": "あなたの目標に合わせた医師監督による体重管理プログラム。",
        "icon": "scale",
        "sort_order": 1,
    },
    {
        "slug": "skin-care",
        "name_en": "Skin Care",
        "name_ja": "スキンケア",
        "description_en": "Prescription-strength skincare solutions for acne, aging, and more.",
        "description_ja": "ニキビ、エイジングケアなどに対応した処方強度のスキンケアソリューション。",
        "icon": "sparkles",
        "sort_order": 2,
    },
    {
        "slug": "hair-care",
        "name_en": "Hair Care",
        "name_ja": "ヘアケア",
        "description_en": "Clinically proven treatments to support hair health and growth.",
        "description_ja": "毛髪の健康と成長をサポートする臨床的に実証された治療法。",
        "icon": "wind",
        "sort_order": 3,
    },
    {
        "slug": "womens-health",
        "name_en": "Women's Health",
        "name_ja": "女性の健康",
        "description_en": "Personalized care for hormonal balance and reproductive wellness.",
        "description_ja": "ホルモンバランスと生殖器の健康のためのパーソナライズされたケア。",
        "icon": "heart",
        "sort_order": 4,
    },
]

AGENT_CONFIGS = [
    {"agent_type": "intake", "name_en": "Intake Agent", "model": "claude-haiku-4-5-20251001"},
    {"agent_type": "compliance_gate", "name_en": "Compliance Gate Agent", "model": "claude-sonnet-4-6"},
    {"agent_type": "review_cs", "name_en": "Review & CS Agent", "model": "claude-haiku-4-5-20251001"},
    {"agent_type": "retention", "name_en": "Retention Agent", "model": "claude-sonnet-4-6"},
    {"agent_type": "offer", "name_en": "Offer Agent", "model": "claude-haiku-4-5-20251001"},
    {"agent_type": "cross_sell", "name_en": "Cross-Sell Agent", "model": "claude-haiku-4-5-20251001"},
    {"agent_type": "ops_dashboard", "name_en": "Ops Dashboard Agent", "model": "claude-sonnet-4-6"},
]

LEGAL_CONTENTS = [
    {
        "page_type": "privacy_policy",
        "title_en": "Privacy Policy",
        "title_ja": "プライバシーポリシー",
        "content_en": "<!-- COMPLIANCE PLACEHOLDER: Full privacy policy to be drafted by legal team. -->",
        "content_ja": "<!-- COMPLIANCE PLACEHOLDER: 法務チームによるプライバシーポリシー草案が必要です。 -->",
        "is_draft": True,
        "version": "0.1",
    },
    {
        "page_type": "terms_of_use",
        "title_en": "Terms of Use",
        "title_ja": "利用規約",
        "content_en": "<!-- COMPLIANCE PLACEHOLDER: Terms of use to be drafted by legal team. -->",
        "content_ja": "<!-- COMPLIANCE PLACEHOLDER: 利用規約の草案が必要です。 -->",
        "is_draft": True,
        "version": "0.1",
    },
    {
        "page_type": "medical_disclaimer",
        "title_en": "Medical Disclaimer",
        "title_ja": "医療免責事項",
        "content_en": "<!-- COMPLIANCE PLACEHOLDER: Medical disclaimer content may help support wellness goals. This platform does not guarantee any specific results. Always consult a qualified healthcare professional. -->",
        "content_ja": "<!-- COMPLIANCE PLACEHOLDER: 医療免責事項の草案が必要です。 -->",
        "is_draft": True,
        "version": "0.1",
    },
    {
        "page_type": "consultation_notice",
        "title_en": "Consultation Notice",
        "title_ja": "相談に関するご案内",
        "content_en": "<!-- COMPLIANCE PLACEHOLDER: Consultation notice to be reviewed by medical and legal teams. -->",
        "content_ja": "<!-- COMPLIANCE PLACEHOLDER: 相談案内の草案が必要です。 -->",
        "is_draft": True,
        "version": "0.1",
    },
    {
        "page_type": "data_consent",
        "title_en": "Data Consent",
        "title_ja": "データ同意書",
        "content_en": "<!-- COMPLIANCE PLACEHOLDER: Data consent form to be drafted per applicable privacy regulations. -->",
        "content_ja": "<!-- COMPLIANCE PLACEHOLDER: データ同意書の草案が必要です。 -->",
        "is_draft": True,
        "version": "0.1",
    },
]


async def seed(session: AsyncSession) -> None:
    print("Seeding verticals and products...")
    vertical_objs = {}
    for v_data in VERTICALS:
        vertical = Vertical(**v_data)
        session.add(vertical)
        vertical_objs[v_data["slug"]] = vertical

    await session.flush()

    # 버티컬별 4개 상품
    for v_slug, vertical in vertical_objs.items():
        for i in range(1, 5):
            product = Product(
                vertical_id=vertical.id,
                slug=f"{v_slug}-product-{i}",
                name_en=f"{vertical.name_en} Treatment Plan {i}",
                name_ja=f"{vertical.name_ja} プラン {i}",
                description_en=f"<!-- COMPLIANCE PLACEHOLDER: Description for {vertical.name_en} plan {i}. May help support your goals. Consult a physician. -->",
                description_ja=f"<!-- COMPLIANCE PLACEHOLDER: {vertical.name_ja} プラン {i} の説明。 -->",
                base_price=9800 * i,
                currency="JPY",
                sort_order=i,
            )
            session.add(product)
            await session.flush()

            for j in range(1, 3):
                variant = ProductVariant(
                    product_id=product.id,
                    name_en=f"{j}-Month Supply",
                    name_ja=f"{j}ヶ月分",
                    price=product.base_price * j * 0.9,
                    duration_days=30 * j,
                )
                session.add(variant)

    print("Seeding FAQs...")
    platform_faqs = [
        ("How does the consultation process work?", "相談プロセスはどのように機能しますか？",
         "Complete our health questionnaire, and a licensed physician will review your information within 24-48 hours.",
         "健康アンケートに記入していただくと、認定医師が24〜48時間以内に確認します。"),
        ("Is my health information secure?", "健康情報は安全ですか？",
         "Yes. Your data is encrypted and handled per applicable privacy regulations.",
         "はい。データは暗号化され、適用されるプライバシー規制に従って管理されます。"),
        ("Do you ship to all regions of Japan?", "日本全国に配送しますか？",
         "We currently ship to most regions of Japan. Please check availability at checkout.",
         "現在、日本のほとんどの地域に配送しています。"),
        ("What happens after I submit my consultation?", "相談送信後はどうなりますか？",
         "A physician reviews your questionnaire. If appropriate, a treatment plan will be prepared.",
         "医師がアンケートを確認し、適切な場合は治療計画を作成します。"),
        ("Can I cancel my subscription?", "サブスクリプションはキャンセルできますか？",
         "Yes, you can cancel anytime from your account dashboard.",
         "はい、アカウントダッシュボードからいつでもキャンセルできます。"),
        ("Are the doctors licensed?", "医師は認定されていますか？",
         "All physicians on our platform are fully licensed in Japan.",
         "当プラットフォームのすべての医師は日本で完全に認定されています。"),
        ("How long does delivery take?", "配送にはどのくらいかかりますか？",
         "Typically 3-5 business days after prescription approval.",
         "処方承認後、通常3〜5営業日です。"),
        ("Is this a replacement for in-person medical care?", "これは対面診療の代替ですか？",
         "No. This platform connects you with physicians for online consultations. It does not replace in-person care.",
         "いいえ。このプラットフォームはオンライン相談のために医師とつなぎます。対面診療の代替ではありません。"),
    ]
    for i, (q_en, q_ja, a_en, a_ja) in enumerate(platform_faqs):
        faq = FAQ(question_en=q_en, question_ja=q_ja, answer_en=a_en, answer_ja=a_ja, sort_order=i)
        session.add(faq)

    print("Seeding legal content...")
    for lc_data in LEGAL_CONTENTS:
        lc = LegalContent(**lc_data)
        session.add(lc)

    print("Seeding agent configurations...")
    for ag_data in AGENT_CONFIGS:
        ag = AgentConfiguration(**ag_data, system_prompt="<!-- To be configured in Phase 3 -->", is_enabled=False)
        session.add(ag)

    await session.commit()
    print("Seed complete.")


async def main() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await seed(session)
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
