export const GROUP_OPTIONS = [
  { value: "1", label: "1 - Frezarki konwencjonalne" },
  { value: "2", label: "2 - Frezarki konwencjonalne" },
  { value: "17", label: "17 - Slusarze" },
  { value: "4", label: "4 - Tokarka CNC" },
  { value: "6", label: "6 - Frezarka 3-osie" },
  { value: "7", label: "7 - Soraluce" },
  { value: "8", label: "8 - You Ji" },
  { value: "10", label: "10 - Frezarko-wytaczarki" },
  { value: "16", label: "16 - Frezarka bramowa" },
  { value: "18", label: "18 - Frezarka bramowa duza ZAYER" },
  { value: "KJ", label: "KJ - Ramie pomiarowe, laser Tracker" },
];

export const RATE_TYPE_OPTIONS = [
  { value: "old", label: "Stare stawki" },
  { value: "new_2026", label: "Nowe stawki 2026" },
  { value: "external_2026", label: "Uslugi zewnetrzne 2026" },
];

export const RATE_MAP = {
  "1": { old: 110, new_2026: 140, external_2026: 161 },
  "2": { old: 120, new_2026: 140, external_2026: 161 },
  "17": { old: 90, new_2026: 110, external_2026: 150 },
  "4": { old: 120, new_2026: 185, external_2026: 210 },
  "6": { old: 140, new_2026: 185, external_2026: 210 },
  "7": { old: 220, new_2026: 310, external_2026: 420 },
  "8": { old: 180, new_2026: 185, external_2026: 210 },
  "10": { old: 220, new_2026: 410, external_2026: 600 },
  "16": { old: 220, new_2026: 300, external_2026: 400 },
  "18": { old: 800, new_2026: 500, external_2026: 700 },
  KJ: { old: 100, new_2026: 150, external_2026: 185 },
};

export function createEmptyOperation() {
  return { group_id: "", tpz: "", tj: "" };
}
