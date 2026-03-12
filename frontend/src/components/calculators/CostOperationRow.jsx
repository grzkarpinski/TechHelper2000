import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CostOperationRow({ operation, index, groupOptions, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-3 rounded-lg border border-border p-3">
      <div className="col-span-5">
        <Label>Grupa *</Label>
        <select
          className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
      <div className="col-span-3">
        <Label>Tpz (min) *</Label>
        <Input type="number" step="any" value={operation.tpz} onChange={(event) => onChange(index, "tpz", event.target.value)} />
      </div>
      <div className="col-span-3">
        <Label>Tj (min) *</Label>
        <Input type="number" step="any" value={operation.tj} onChange={(event) => onChange(index, "tj", event.target.value)} />
      </div>
      <div className="col-span-1 flex items-end">
        <Button type="button" variant="outline" className="w-full" onClick={() => onRemove(index)}>
          -
        </Button>
      </div>
    </div>
  );
}
