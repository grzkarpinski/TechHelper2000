import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MODES = [
  { value: "time-to-cost", label: "CZAS → KOSZT" },
  { value: "cost-to-time", label: "KOSZT → CZAS" },
];

export default function CostModeToggle({ mode, onChange }) {
  return (
    <div>
      <Label>Tryb obliczeń</Label>
      <div className="mt-2 flex gap-2">
        {MODES.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={mode === option.value ? "default" : "outline"}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
