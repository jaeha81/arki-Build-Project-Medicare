"""Initial schema — all core tables.

Revision ID: 001_initial
Revises: None
Create Date: 2026-04-14 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── catalog: verticals ────────────────────────────────────────────────
    op.create_table(
        "verticals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
        sa.Column("name_en", sa.String(200), nullable=False),
        sa.Column("name_ja", sa.String(200), nullable=False),
        sa.Column("description_en", sa.Text, nullable=False, server_default=""),
        sa.Column("description_ja", sa.Text, nullable=False, server_default=""),
        sa.Column("icon", sa.String(100), nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── catalog: products ─────────────────────────────────────────────────
    op.create_table(
        "products",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "vertical_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("verticals.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("slug", sa.String(200), unique=True, nullable=False),
        sa.Column("name_en", sa.String(300), nullable=False),
        sa.Column("name_ja", sa.String(300), nullable=False),
        sa.Column("description_en", sa.Text, nullable=False, server_default=""),
        sa.Column("description_ja", sa.Text, nullable=False, server_default=""),
        sa.Column("base_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="JPY"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── catalog: product_variants ─────────────────────────────────────────
    op.create_table(
        "product_variants",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "product_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("products.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name_en", sa.String(200), nullable=False),
        sa.Column("name_ja", sa.String(200), nullable=False),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("duration_days", sa.Integer, nullable=True),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── catalog: faqs ─────────────────────────────────────────────────────
    op.create_table(
        "faqs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "vertical_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("verticals.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("question_en", sa.Text, nullable=False),
        sa.Column("question_ja", sa.Text, nullable=False),
        sa.Column("answer_en", sa.Text, nullable=False),
        sa.Column("answer_ja", sa.Text, nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── consultation: consultation_requests ───────────────────────────────
    op.create_table(
        "consultation_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "vertical_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("verticals.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("name", sa.String(300), nullable=False),
        sa.Column("email", sa.String(300), nullable=False),
        sa.Column("age_range", sa.String(50), nullable=True),
        sa.Column("preferred_language", sa.String(10), nullable=False, server_default="en"),
        sa.Column("health_survey", postgresql.JSONB, nullable=True),
        sa.Column("product_interest", postgresql.JSONB, nullable=True),
        sa.Column("consent_terms", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("consent_privacy", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("consent_medical", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("ip_address", sa.String(50), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── agents: agent_configurations ──────────────────────────────────────
    op.create_table(
        "agent_configurations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("agent_type", sa.String(100), unique=True, nullable=False),
        sa.Column("name_en", sa.String(200), nullable=False),
        sa.Column("system_prompt", sa.Text, nullable=False, server_default=""),
        sa.Column("model", sa.String(100), nullable=False, server_default="claude-sonnet-4-6"),
        sa.Column("is_enabled", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("config", postgresql.JSONB, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── agents: admin_approvals ───────────────────────────────────────────
    op.create_table(
        "admin_approvals",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("agent_id", sa.String(200), nullable=False),
        sa.Column("action", sa.String(200), nullable=False),
        sa.Column("details", postgresql.JSONB, nullable=False, server_default="{}"),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("review_note", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── agents: agent_action_logs (append-only) ───────────────────────────
    op.create_table(
        "agent_action_logs",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("agent_id", sa.String(200), nullable=False),
        sa.Column("action", sa.String(200), nullable=False),
        sa.Column("status", sa.String(50), nullable=False),
        sa.Column("result", postgresql.JSONB, nullable=True),
        sa.Column("error", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── compliance: prohibited_phrases ────────────────────────────────────
    op.create_table(
        "prohibited_phrases",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("phrase", sa.String(500), nullable=False),
        sa.Column("pattern", sa.String(500), nullable=True),
        sa.Column("severity", sa.String(50), nullable=False, server_default="warning"),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("suggestion", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── legal: legal_contents ─────────────────────────────────────────────
    op.create_table(
        "legal_contents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("page_type", sa.String(100), unique=True, nullable=False),
        sa.Column("title_en", sa.String(300), nullable=False),
        sa.Column("title_ja", sa.String(300), nullable=False),
        sa.Column("content_en", sa.Text, nullable=False),
        sa.Column("content_ja", sa.Text, nullable=False),
        sa.Column("is_draft", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("version", sa.String(20), nullable=False, server_default="0.1"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── review: reviews ───────────────────────────────────────────────────
    op.create_table(
        "reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "product_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("products.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("customer_name", sa.String(200), nullable=False),
        sa.Column("customer_email", sa.String(300), nullable=False),
        sa.Column("rating", sa.Integer, nullable=False),
        sa.Column("body", sa.Text, nullable=True),
        sa.Column("is_approved", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("is_flagged", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── indexes ───────────────────────────────────────────────────────────
    op.create_index("ix_products_vertical_id", "products", ["vertical_id"])
    op.create_index("ix_product_variants_product_id", "product_variants", ["product_id"])
    op.create_index("ix_consultation_requests_status", "consultation_requests", ["status"])
    op.create_index("ix_consultation_requests_email", "consultation_requests", ["email"])
    op.create_index("ix_agent_action_logs_agent_id", "agent_action_logs", ["agent_id"])
    op.create_index("ix_agent_action_logs_status", "agent_action_logs", ["status"])
    op.create_index("ix_admin_approvals_status", "admin_approvals", ["status"])
    op.create_index("ix_reviews_product_id", "reviews", ["product_id"])
    op.create_index("ix_reviews_status", "reviews", ["status"])


def downgrade() -> None:
    # Drop indexes first
    op.drop_index("ix_reviews_status", table_name="reviews")
    op.drop_index("ix_reviews_product_id", table_name="reviews")
    op.drop_index("ix_admin_approvals_status", table_name="admin_approvals")
    op.drop_index("ix_agent_action_logs_status", table_name="agent_action_logs")
    op.drop_index("ix_agent_action_logs_agent_id", table_name="agent_action_logs")
    op.drop_index("ix_consultation_requests_email", table_name="consultation_requests")
    op.drop_index("ix_consultation_requests_status", table_name="consultation_requests")
    op.drop_index("ix_product_variants_product_id", table_name="product_variants")
    op.drop_index("ix_products_vertical_id", table_name="products")

    # Drop tables in reverse dependency order
    op.drop_table("reviews")
    op.drop_table("legal_contents")
    op.drop_table("prohibited_phrases")
    op.drop_table("agent_action_logs")
    op.drop_table("admin_approvals")
    op.drop_table("agent_configurations")
    op.drop_table("consultation_requests")
    op.drop_table("faqs")
    op.drop_table("product_variants")
    op.drop_table("products")
    op.drop_table("verticals")
