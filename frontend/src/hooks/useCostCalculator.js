import { useMemo, useState } from "react";
import { toast } from "sonner";

import { calculateCost, calculateTimeFromCost } from "@/api/calculators";
import { createEmptyOperation, RATE_MAP } from "@/components/calculators/costConstants";

export default function useCostCalculator() {
  const [mode, setMode] = useState("time-to-cost");
  const [rateType, setRateType] = useState("old");
  const [operations, setOperations] = useState([createEmptyOperation()]);
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveValue = useMemo(() => operations.reduce((sum, operation) => {
    const rate = RATE_MAP[operation.group_id]?.[rateType];
    if (!rate) return sum;
    if (mode === "cost-to-time") {
      const cost = Number(operation.cost);
      return Number.isFinite(cost) && cost > 0 ? sum + (cost / rate) * 60 : sum;
    }
    const tpz = Number(operation.tpz);
    const tj = Number(operation.tj);
    return Number.isFinite(tpz) && tpz > 0 && Number.isFinite(tj) && tj > 0
      ? sum + ((tpz + tj) / 60) * rate
      : sum;
  }, 0), [mode, operations, rateType]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setResponse(null);
  }

  function changeRateType(nextRateType) {
    setRateType(nextRateType);
    setResponse(null);
  }

  function updateOperation(index, key, value) {
    setOperations((previous) => previous.map((operation, currentIndex) => (
      currentIndex === index ? { ...operation, [key]: value } : operation
    )));
    setResponse(null);
  }

  function addOperation() {
    if (operations.length < 10) setOperations((previous) => [...previous, createEmptyOperation()]);
    setResponse(null);
  }

  function removeOperation(index) {
    setOperations((previous) => previous.length === 1
      ? [createEmptyOperation()]
      : previous.filter((_, currentIndex) => currentIndex !== index));
    setResponse(null);
  }

  function clear() {
    setOperations([createEmptyOperation()]);
    setResponse(null);
  }

  async function calculate() {
    const payload = operations.map((operation) => mode === "time-to-cost"
      ? { group_id: operation.group_id, tpz: Number(operation.tpz), tj: Number(operation.tj) }
      : { group_id: operation.group_id, cost: Number(operation.cost) });
    const invalid = payload.some((operation) => !operation.group_id || Object.entries(operation)
      .some(([key, value]) => key !== "group_id" && (!Number.isFinite(value) || value <= 0)));
    if (invalid) {
      toast.error("Uzupełnij poprawnie wszystkie pola operacji");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = mode === "time-to-cost"
        ? await calculateCost(payload, rateType)
        : await calculateTimeFromCost(payload, rateType);
      setResponse(result);
    } catch (error) {
      toast.error(error.message || "Błąd połączenia z serwerem");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    mode, rateType, operations, response, isSubmitting, liveValue,
    changeMode, changeRateType, updateOperation, addOperation, removeOperation, clear, calculate,
  };
}
