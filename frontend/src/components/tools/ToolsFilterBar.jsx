import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ToolsFilterBar({ fields, filters, setFilters }) {
  // Pola filtrujace: srednica, symbol, producent + selecty
  const filterableFields = fields.filter(
    (f) => f.key === "srednica_D_mm" || f.key === "symbol_narzedzia" || f.key === "producent" || f.type === "select",
  );

  function handleChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      {filterableFields.map((field) =>
        field.type === "select" ? (
          <div key={field.key} className="w-40">
            <label className="mb-1 block text-xs font-medium text-slate-400">{field.label}</label>
            <Select value={filters[field.key] || ""} onValueChange={(val) => handleChange(field.key, val === "all" ? "" : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div key={field.key} className="w-40">
            <label className="mb-1 block text-xs font-medium text-slate-400">{field.label}</label>
            <Input
              placeholder={`Filtruj ${field.label.toLowerCase()}...`}
              value={filters[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          </div>
        ),
      )}
    </div>
  );
}
