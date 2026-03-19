import { z } from "zod";

// --- Definicje pól per typ narzędzia ---
// Każde pole: { key, label, type, required, unit?, options? }

const positiveNumber = z.coerce.number().positive("Wartosc musi byc wieksza od 0");
const optionalPositiveNumber = z.coerce
  .number()
  .positive("Wartosc musi byc wieksza od 0")
  .optional()
  .or(z.literal("").transform(() => undefined));

const requiredString = z.string().min(1, "Pole wymagane");
const optionalString = z
  .string()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const MILLING_HEAD_FIELDS = [
  { key: "srednica_D_mm", label: "Srednica D (mm)", type: "number", required: true },
  { key: "symbol_narzedzia", label: "Symbol narzedzia", type: "text", required: true },
  { key: "producent", label: "Producent", type: "text", required: false },
  { key: "symbol_plytki", label: "Symbol plytki", type: "text", required: false },
  { key: "liczba_ostrzy", label: "Liczba ostrzy (z)", type: "number", required: true },
  { key: "material", label: "Material obrabiany", type: "text", required: false },
  { key: "posuw_na_zab_min", label: "Fz min (mm/zab)", type: "number", required: false },
  { key: "posuw_na_zab_max", label: "Fz max (mm/zab)", type: "number", required: false },
  { key: "predkosc_skrawania_min", label: "Vc min (m/min)", type: "number", required: false },
  { key: "predkosc_skrawania_max", label: "Vc max (m/min)", type: "number", required: false },
  { key: "obroty", label: "n (obr/min)", type: "number", required: false },
  { key: "posuw", label: "F (mm/min)", type: "number", required: false },
  { key: "glebokosc_skrawania_ap", label: "ap (mm)", type: "number", required: false },
  { key: "uwagi", label: "Uwagi", type: "text", required: false },
];

export const MILLING_CUTTER_FIELDS = [
  { key: "srednica_D_mm", label: "Srednica D (mm)", type: "number", required: true },
  { key: "symbol_narzedzia", label: "Symbol narzedzia", type: "text", required: true },
  { key: "producent", label: "Producent", type: "text", required: false },
  { key: "liczba_ostrzy", label: "Liczba ostrzy (z)", type: "number", required: true },
  { key: "material", label: "Material obrabiany", type: "text", required: false },
  { key: "posuw_na_zab_min", label: "Fz min (mm/zab)", type: "number", required: false },
  { key: "posuw_na_zab_max", label: "Fz max (mm/zab)", type: "number", required: false },
  { key: "predkosc_skrawania_min", label: "Vc min (m/min)", type: "number", required: false },
  { key: "predkosc_skrawania_max", label: "Vc max (m/min)", type: "number", required: false },
  { key: "obroty", label: "n (obr/min)", type: "number", required: false },
  { key: "posuw", label: "F (mm/min)", type: "number", required: false },
  { key: "glebokosc_skrawania_ap", label: "ap (mm)", type: "number", required: false },
  { key: "szerokosc_skrawania_ae_pct", label: "ae (% D)", type: "number", required: false },
  { key: "uwagi", label: "Uwagi", type: "text", required: false },
];

export const DRILL_FIELDS = [
  { key: "srednica_D_mm", label: "Srednica D (mm)", type: "number", required: true },
  { key: "symbol_narzedzia", label: "Symbol narzedzia", type: "text", required: true },
  { key: "producent", label: "Producent", type: "text", required: false },
  { key: "rodzaj_wiertla", label: "Rodzaj wiertla", type: "select", required: true, options: [
    { value: "HSS", label: "HSS" },
    { value: "VHM", label: "VHM" },
    { value: "1_plytka", label: "1 plytka" },
    { value: "2_plytki", label: "2 plytki" },
  ]},
  { key: "symbol_plytki", label: "Symbol plytki", type: "text", required: false },
  { key: "dlugosc_robocza_mm", label: "Dlugosc robocza (mm)", type: "number", required: false },
  { key: "liczba_ostrzy", label: "Liczba ostrzy", type: "number", required: false },
  { key: "posuw_fn_min", label: "fn min (mm/obr)", type: "number", required: false },
  { key: "posuw_fn_max", label: "fn max (mm/obr)", type: "number", required: false },
  { key: "predkosc_skrawania_min", label: "Vc min (m/min)", type: "number", required: false },
  { key: "predkosc_skrawania_max", label: "Vc max (m/min)", type: "number", required: false },
  { key: "obroty", label: "n (obr/min)", type: "number", required: false },
  { key: "posuw", label: "F (mm/min)", type: "number", required: false },
  { key: "uwagi", label: "Uwagi", type: "text", required: false },
];

// Kolumny widoczne w tabeli (skrócona lista najważniejszych)
export const MILLING_HEAD_COLUMNS = [
  { key: "srednica_D_mm", label: "D (mm)" },
  { key: "symbol_narzedzia", label: "Symbol" },
  { key: "producent", label: "Producent" },
  { key: "liczba_ostrzy", label: "z" },
  { key: "material", label: "Material" },
  { key: "predkosc_skrawania_min", label: "Vc min" },
  { key: "predkosc_skrawania_max", label: "Vc max" },
  { key: "obroty", label: "n" },
  { key: "posuw", label: "F" },
];

export const MILLING_CUTTER_COLUMNS = [
  { key: "srednica_D_mm", label: "D (mm)" },
  { key: "symbol_narzedzia", label: "Symbol" },
  { key: "producent", label: "Producent" },
  { key: "liczba_ostrzy", label: "z" },
  { key: "material", label: "Material" },
  { key: "predkosc_skrawania_min", label: "Vc min" },
  { key: "predkosc_skrawania_max", label: "Vc max" },
  { key: "obroty", label: "n" },
  { key: "posuw", label: "F" },
];

export const DRILL_COLUMNS = [
  { key: "srednica_D_mm", label: "D (mm)" },
  { key: "symbol_narzedzia", label: "Symbol" },
  { key: "producent", label: "Producent" },
  { key: "rodzaj_wiertla", label: "Rodzaj" },
  { key: "liczba_ostrzy", label: "z" },
  { key: "predkosc_skrawania_min", label: "Vc min" },
  { key: "predkosc_skrawania_max", label: "Vc max" },
  { key: "obroty", label: "n" },
  { key: "posuw", label: "F" },
];

// Funkcja budująca schemat zod na podstawie definicji pól
export function buildToolSchema(fields) {
  const shape = {};
  for (const field of fields) {
    if (field.type === "number") {
      shape[field.key] = field.required ? positiveNumber : optionalPositiveNumber;
    } else if (field.type === "select") {
      const values = field.options.map((o) => o.value);
      shape[field.key] = field.required
        ? z.enum(values, { errorMap: () => ({ message: "Wybierz wartosc" }) })
        : z.enum(values).optional().or(z.literal("").transform(() => undefined));
    } else {
      shape[field.key] = field.required ? requiredString : optionalString;
    }
  }
  return z.object(shape);
}
