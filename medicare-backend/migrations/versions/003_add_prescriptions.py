"""Add prescriptions table.

Revision ID: 003
Revises: 002
Create Date: 2026-04-20 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "prescriptions",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "consultation_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("consultation_requests.id"),
            nullable=False,
        ),
        sa.Column(
            "customer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("customers.id"),
            nullable=False,
        ),
        sa.Column("doctor_id", sa.String(255), nullable=False),
        sa.Column("drug_name", sa.String(500), nullable=False),
        sa.Column("dosage", sa.String(200), nullable=False),
        sa.Column("instructions", sa.Text(), nullable=True),
        sa.Column("inkan_number", sa.String(100), nullable=True),
        sa.Column("issued_at", sa.String(50), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="issued"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_prescriptions_customer_id", "prescriptions", ["customer_id"])
    op.create_index(
        "ix_prescriptions_consultation_id", "prescriptions", ["consultation_id"]
    )


def downgrade() -> None:
    op.drop_index("ix_prescriptions_consultation_id", table_name="prescriptions")
    op.drop_index("ix_prescriptions_customer_id", table_name="prescriptions")
    op.drop_table("prescriptions")
