import CostModeToggle from "@/components/calculators/CostModeToggle";
import CostOperationRow from "@/components/calculators/CostOperationRow";
import CostResultCard from "@/components/calculators/CostResultCard";
import { GROUP_OPTIONS, RATE_TYPE_OPTIONS } from "@/components/calculators/costConstants";
import TimeFromCostResultCard from "@/components/calculators/TimeFromCostResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useCostCalculator from "@/hooks/useCostCalculator";

export default function CostCalculator() {
  const calculator = useCostCalculator();
  const isTimeToCost = calculator.mode === "time-to-cost";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Kalkulator kosztu obróbki</CardTitle>
          <CardDescription>
            {isTimeToCost ? "Podaj czasy, aby obliczyć koszt." : "Podaj koszt, aby obliczyć łączny czas obróbki."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CostModeToggle mode={calculator.mode} onChange={calculator.changeMode} />
          <div>
            <Label>Typ stawki *</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {RATE_TYPE_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-slate-300">
                  <input
                    type="radio"
                    name="rateType"
                    value={option.value}
                    checked={calculator.rateType === option.value}
                    onChange={(event) => calculator.changeRateType(event.target.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {calculator.operations.map((operation, index) => (
              <CostOperationRow
                key={`${index}-${calculator.operations.length}`}
                operation={operation}
                index={index}
                groupOptions={GROUP_OPTIONS}
                mode={calculator.mode}
                onChange={calculator.updateOperation}
                onRemove={calculator.removeOperation}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-300">
              {isTimeToCost ? "Koszt na żywo: " : "Czas na żywo: "}
              <span className="font-semibold text-green-400">
                {calculator.liveValue.toFixed(isTimeToCost ? 2 : 1)} {isTimeToCost ? "PLN" : "min"}
              </span>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={calculator.addOperation} disabled={calculator.operations.length >= 10}>Dodaj operację</Button>
              <Button type="button" variant="outline" onClick={calculator.clear}>CLEAR</Button>
              <Button type="button" onClick={calculator.calculate} disabled={calculator.isSubmitting}>OBLICZ</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isTimeToCost
        ? <CostResultCard response={calculator.response} />
        : <TimeFromCostResultCard response={calculator.response} />}
    </div>
  );
}
