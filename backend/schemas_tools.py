from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# --- Głowice frezarskie ---

class MillingHeadCreate(BaseModel):
    srednica_D_mm: float = Field(gt=0)
    symbol_narzedzia: str = Field(min_length=1, max_length=100)
    producent: str | None = Field(default=None, max_length=100)
    symbol_plytki: str | None = Field(default=None, max_length=100)
    liczba_ostrzy: int = Field(gt=0)
    material: str | None = Field(default=None, max_length=100)
    posuw_na_zab_min: float | None = Field(default=None, gt=0)
    posuw_na_zab_max: float | None = Field(default=None, gt=0)
    predkosc_skrawania_min: float | None = Field(default=None, gt=0)
    predkosc_skrawania_max: float | None = Field(default=None, gt=0)
    obroty: float | None = Field(default=None, gt=0)
    posuw: float | None = Field(default=None, gt=0)
    glebokosc_skrawania_ap: float | None = Field(default=None, gt=0)
    uwagi: str | None = Field(default=None, max_length=500)


class MillingHeadResponse(MillingHeadCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# --- Frezy ---

class MillingCutterCreate(BaseModel):
    srednica_D_mm: float = Field(gt=0)
    symbol_narzedzia: str = Field(min_length=1, max_length=100)
    producent: str | None = Field(default=None, max_length=100)
    liczba_ostrzy: int = Field(gt=0)
    material: str | None = Field(default=None, max_length=100)
    posuw_na_zab_min: float | None = Field(default=None, gt=0)
    posuw_na_zab_max: float | None = Field(default=None, gt=0)
    predkosc_skrawania_min: float | None = Field(default=None, gt=0)
    predkosc_skrawania_max: float | None = Field(default=None, gt=0)
    obroty: float | None = Field(default=None, gt=0)
    posuw: float | None = Field(default=None, gt=0)
    glebokosc_skrawania_ap: float | None = Field(default=None, gt=0)
    szerokosc_skrawania_ae_pct: float | None = Field(default=None, gt=0)
    uwagi: str | None = Field(default=None, max_length=500)


class MillingCutterResponse(MillingCutterCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


# --- Wiertła ---

class DrillCreate(BaseModel):
    srednica_D_mm: float = Field(gt=0)
    symbol_narzedzia: str = Field(min_length=1, max_length=100)
    producent: str | None = Field(default=None, max_length=100)
    rodzaj_wiertla: Literal["HSS", "VHM", "1_plytka", "2_plytki"]
    symbol_plytki: str | None = Field(default=None, max_length=100)
    dlugosc_robocza_mm: float | None = Field(default=None, gt=0)
    liczba_ostrzy: int | None = Field(default=None, gt=0)
    posuw_fn_min: float | None = Field(default=None, gt=0)
    posuw_fn_max: float | None = Field(default=None, gt=0)
    predkosc_skrawania_min: float | None = Field(default=None, gt=0)
    predkosc_skrawania_max: float | None = Field(default=None, gt=0)
    obroty: float | None = Field(default=None, gt=0)
    posuw: float | None = Field(default=None, gt=0)
    uwagi: str | None = Field(default=None, max_length=500)


class DrillResponse(DrillCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
