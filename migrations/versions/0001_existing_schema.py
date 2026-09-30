"""Bazowy schemat istniejacej aplikacji.

Revision ID: 0001_existing_schema
Revises:
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0001_existing_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def create_users() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=True)


def create_milling_heads() -> None:
    op.create_table(
        "milling_heads",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("srednica_D_mm", sa.Float(), nullable=False),
        sa.Column("symbol_narzedzia", sa.String(length=100), nullable=False),
        sa.Column("producent", sa.String(length=100), nullable=True),
        sa.Column("symbol_plytki", sa.String(length=100), nullable=True),
        sa.Column("liczba_ostrzy", sa.Integer(), nullable=False),
        sa.Column("material", sa.String(length=100), nullable=True),
        sa.Column("posuw_na_zab_min", sa.Float(), nullable=True),
        sa.Column("posuw_na_zab_max", sa.Float(), nullable=True),
        sa.Column("predkosc_skrawania_min", sa.Float(), nullable=True),
        sa.Column("predkosc_skrawania_max", sa.Float(), nullable=True),
        sa.Column("obroty", sa.Float(), nullable=True),
        sa.Column("posuw", sa.Float(), nullable=True),
        sa.Column("glebokosc_skrawania_ap", sa.Float(), nullable=True),
        sa.Column("uwagi", sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_milling_heads_id"), "milling_heads", ["id"], unique=False)


def create_milling_cutters() -> None:
    op.create_table(
        "milling_cutters",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("srednica_D_mm", sa.Float(), nullable=False),
        sa.Column("symbol_narzedzia", sa.String(length=100), nullable=False),
        sa.Column("producent", sa.String(length=100), nullable=True),
        sa.Column("liczba_ostrzy", sa.Integer(), nullable=False),
        sa.Column("material", sa.String(length=100), nullable=True),
        sa.Column("posuw_na_zab_min", sa.Float(), nullable=True),
        sa.Column("posuw_na_zab_max", sa.Float(), nullable=True),
        sa.Column("predkosc_skrawania_min", sa.Float(), nullable=True),
        sa.Column("predkosc_skrawania_max", sa.Float(), nullable=True),
        sa.Column("obroty", sa.Float(), nullable=True),
        sa.Column("posuw", sa.Float(), nullable=True),
        sa.Column("glebokosc_skrawania_ap", sa.Float(), nullable=True),
        sa.Column("szerokosc_skrawania_ae_pct", sa.Float(), nullable=True),
        sa.Column("uwagi", sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_milling_cutters_id"), "milling_cutters", ["id"], unique=False)


def create_drills() -> None:
    op.create_table(
        "drills",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("srednica_D_mm", sa.Float(), nullable=False),
        sa.Column("symbol_narzedzia", sa.String(length=100), nullable=False),
        sa.Column("producent", sa.String(length=100), nullable=True),
        sa.Column("rodzaj_wiertla", sa.String(length=20), nullable=False),
        sa.Column("symbol_plytki", sa.String(length=100), nullable=True),
        sa.Column("dlugosc_robocza_mm", sa.Float(), nullable=True),
        sa.Column("liczba_ostrzy", sa.Integer(), nullable=True),
        sa.Column("posuw_fn_min", sa.Float(), nullable=True),
        sa.Column("posuw_fn_max", sa.Float(), nullable=True),
        sa.Column("predkosc_skrawania_min", sa.Float(), nullable=True),
        sa.Column("predkosc_skrawania_max", sa.Float(), nullable=True),
        sa.Column("obroty", sa.Float(), nullable=True),
        sa.Column("posuw", sa.Float(), nullable=True),
        sa.Column("uwagi", sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_drills_id"), "drills", ["id"], unique=False)


def upgrade() -> None:
    create_users()
    create_milling_heads()
    create_milling_cutters()
    create_drills()


def downgrade() -> None:
    op.drop_index(op.f("ix_drills_id"), table_name="drills")
    op.drop_table("drills")
    op.drop_index(op.f("ix_milling_cutters_id"), table_name="milling_cutters")
    op.drop_table("milling_cutters")
    op.drop_index(op.f("ix_milling_heads_id"), table_name="milling_heads")
    op.drop_table("milling_heads")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
