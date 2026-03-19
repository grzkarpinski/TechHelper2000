from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MillingHead(Base):
    __tablename__ = "milling_heads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    srednica_D_mm: Mapped[float] = mapped_column(Float, nullable=False)
    symbol_narzedzia: Mapped[str] = mapped_column(String(100), nullable=False)
    producent: Mapped[str | None] = mapped_column(String(100), nullable=True)
    symbol_plytki: Mapped[str | None] = mapped_column(String(100), nullable=True)
    liczba_ostrzy: Mapped[int] = mapped_column(Integer, nullable=False)
    material: Mapped[str | None] = mapped_column(String(100), nullable=True)
    posuw_na_zab_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    posuw_na_zab_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    predkosc_skrawania_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    predkosc_skrawania_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    obroty: Mapped[float | None] = mapped_column(Float, nullable=True)
    posuw: Mapped[float | None] = mapped_column(Float, nullable=True)
    glebokosc_skrawania_ap: Mapped[float | None] = mapped_column(Float, nullable=True)
    uwagi: Mapped[str | None] = mapped_column(String(500), nullable=True)


class MillingCutter(Base):
    __tablename__ = "milling_cutters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    srednica_D_mm: Mapped[float] = mapped_column(Float, nullable=False)
    symbol_narzedzia: Mapped[str] = mapped_column(String(100), nullable=False)
    producent: Mapped[str | None] = mapped_column(String(100), nullable=True)
    liczba_ostrzy: Mapped[int] = mapped_column(Integer, nullable=False)
    material: Mapped[str | None] = mapped_column(String(100), nullable=True)
    posuw_na_zab_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    posuw_na_zab_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    predkosc_skrawania_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    predkosc_skrawania_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    obroty: Mapped[float | None] = mapped_column(Float, nullable=True)
    posuw: Mapped[float | None] = mapped_column(Float, nullable=True)
    glebokosc_skrawania_ap: Mapped[float | None] = mapped_column(Float, nullable=True)
    szerokosc_skrawania_ae_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    uwagi: Mapped[str | None] = mapped_column(String(500), nullable=True)


class Drill(Base):
    __tablename__ = "drills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    srednica_D_mm: Mapped[float] = mapped_column(Float, nullable=False)
    symbol_narzedzia: Mapped[str] = mapped_column(String(100), nullable=False)
    producent: Mapped[str | None] = mapped_column(String(100), nullable=True)
    rodzaj_wiertla: Mapped[str] = mapped_column(String(20), nullable=False)
    symbol_plytki: Mapped[str | None] = mapped_column(String(100), nullable=True)
    dlugosc_robocza_mm: Mapped[float | None] = mapped_column(Float, nullable=True)
    liczba_ostrzy: Mapped[int | None] = mapped_column(Integer, nullable=True)
    posuw_fn_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    posuw_fn_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    predkosc_skrawania_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    predkosc_skrawania_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    obroty: Mapped[float | None] = mapped_column(Float, nullable=True)
    posuw: Mapped[float | None] = mapped_column(Float, nullable=True)
    uwagi: Mapped[str | None] = mapped_column(String(500), nullable=True)
