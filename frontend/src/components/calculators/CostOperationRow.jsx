import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CostOperationRow({ operation, index, groupOptions, mode, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-3 rounded-lg border border-border p-3">
      <div className="col-span-12 flex lg:col-span-5 min-w-0 flex-col gap-1">
        <Label>Grupa *</Label>
        <select
          className="h-11 min-w-0 w-full rounded-md border border-input bg-field-background px-3 text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          value={operation.group_id}
          onChange={(event) => onChange(index, "group_id", event.target.value)}
        >
          <option value="">Wybierz grupe</option>
          {groupOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {mode === "time-to-cost" ? (
        <>
          <div className="col-span-6 flex lg:col-span-3 min-w-0 flex-col gap-1">
            <Label>Tpz (min) *</Label>
            <Input type="number" min="0" step="any" value={operation.tpz} onChange={(event) => onChange(index, "tpz", event.target.value)} />
          </div>
          <div className="col-span-6 flex lg:col-span-3 min-w-0 flex-col gap-1">
            <Label>Tj (min) *</Label>
            <Input type="number" min="0" step="any" value={operation.tj} onChange={(event) => onChange(index, "tj", event.target.value)} />
          </div>
        </>
      ) : (
        <div className="col-span-12 flex min-w-0 flex-col gap-1 lg:col-span-6">
          <Label>Koszt operacji (PLN) *</Label>
          <Input type="number" min="0" step="any" value={operation.cost} onChange={(event) => onChange(index, "cost", event.target.value)} />
        </div>
      )}
      <div className="col-span-12 flex items-end lg:col-span-1">
        <Button type="button" variant="outline" aria-label={`Usuń operację ${index + 1}`} className="w-full" onClick={() => onRemove(index)}>
          -
        </Button>
      </div>
    </div>
  );
}
