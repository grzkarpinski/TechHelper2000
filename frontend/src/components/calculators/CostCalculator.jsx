import { useMemo, useState } from "react";
import { toast } from "sonner";

import { calculateCost } from "@/api/calculators";
import CostOperationRow from "@/components/calculators/CostOperationRow";
import CostResultCard from "@/components/calculators/CostResultCard";
import { createEmptyOperation, GROUP_OPTIONS, RATE_MAP, RATE_TYPE_OPTIONS } from "@/components/calculators/costConstants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CostCalculator() {
  const [rateType, setRateType] = useState("old");
  const [operations, setOperations] = useState([createEmptyOperation()]);
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveTotal = useMemo(() => {
    return operations.reduce((sum, operation) => {
      const rate = RATE_MAP[operation.group_id]?.[rateType];
      const tpz = Number(operation.tpz);
      const tj = Number(operation.tj);
      if (!rate || !Number.isFinite(tpz) || !Number.isFinite(tj) || tpz <= 0 || tj <= 0) {
        return sum;
      }
      return sum + (tpz / 60) * rate + (tj / 60) * rate;
    }, 0);
  }, [operations, rateType]);

  function updateOperation(index, key, value) {
    setOperations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
    setResponse(null);
  }

  function addOperation() {
    if (operations.length >= 10) {
      return;
    }
    setOperations((prev) => [...prev, createEmptyOperation()]);
    setResponse(null);
  }

  function removeOperation(index) {
    setOperations((prev) => {
      if (prev.length === 1) {
        return [createEmptyOperation()];
      }
      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
    setResponse(null);
  }

  function handleClear() {
    setRateType("old");
    setOperations([createEmptyOperation()]);
    setResponse(null);
  }

  async function handleCalculate() {
    const payload = operations.map((operation) => ({
      group_id: operation.group_id,
      tpz: Number(operation.tpz),
      tj: Number(operation.tj),
    }));

    const hasInvalid = payload.some(
      (operation) => !operation.group_id || !Number.isFinite(operation.tpz) || !Number.isFinite(operation.tj) || operation.tpz <= 0 || operation.tj <= 0,
    );

    if (hasInvalid) {
      toast.error("Uzupelnij poprawnie wszystkie pola operacji");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await calculateCost(payload, rateType);
      setResponse(result);
    } catch (error) {
      toast.error(error.message || "Blad polaczenia z serwerem");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Kalkulator kosztu obrobki</CardTitle>
          <CardDescription>Dodaj operacje i wybierz typ stawki.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Typ stawki *</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {RATE_TYPE_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-slate-300">
                  <input
                    type="radio"
                    name="rateType"
                    value={option.value}
                    checked={rateType === option.value}
                    onChange={(event) => {
                      setRateType(event.target.value);
                      setResponse(null);
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {operations.map((operation, index) => (
              <CostOperationRow
                key={`${index}-${operations.length}`}
                operation={operation}
                index={index}
                groupOptions={GROUP_OPTIONS}
                onChange={updateOperation}
                onRemove={removeOperation}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-300">
              Suma na zywo: <span className="font-semibold text-green-400">{liveTotal.toFixed(2)} PLN</span>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={addOperation} disabled={operations.length >= 10}>
                Dodaj operacje
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                CLEAR
              </Button>
              <Button type="button" onClick={handleCalculate} disabled={isSubmitting}>
                OBLICZ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CostResultCard response={response} />
    </div>
  );
}
