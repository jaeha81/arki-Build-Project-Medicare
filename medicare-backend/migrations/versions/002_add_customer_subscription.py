"""Add customers and subscriptions tables; add customer_id to consultation_requests.

Revision ID: 002
Revises: 001_initial
Create Date: 2026-04-14 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "002"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "customers",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("supabase_uid", sa.String(255), nullable=False, unique=True),
        sa.Column("email", sa.String(300), nullable=False, unique=True),
        sa.Column("full_name", sa.String(300), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "preferred_language",
            sa.String(10),
            nullable=False,
            server_default="en",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_customers_supabase_uid", "customers", ["supabase_uid"], unique=True)
    op.create_index("ix_customers_email", "customers", ["email"], unique=True)

    op.create_table(
        "subscriptions",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "customer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("customers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("vertical", sa.String(100), nullable=False),
        sa.Column("plan", sa.String(100), nullable=False, server_default="basic"),
        sa.Column("status", sa.String(50), nullable=False, server_default="active"),
        sa.Column("renewal_date", sa.String(20), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_subscriptions_customer_id", "subscriptions", ["customer_id"])

    # consultation_requests에 customer_id 컬럼 추가
    op.add_column(
        "consultation_requests",
        sa.Column(
            "customer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("customers.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index(
        "ix_consultation_requests_customer_id",
        "consultation_requests",
        ["customer_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_consultation_requests_customer_id", table_name="consultation_requests")
    op.drop_column("consultation_requests", "customer_id")
    op.drop_index("ix_subscriptions_customer_id", table_name="subscriptions")
    op.drop_table("subscriptions")
    op.drop_index("ix_customers_email", table_name="customers")
    op.drop_index("ix_customers_supabase_uid", table_name="customers")
    op.drop_table("customers")
