import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { calculateDrilling } from "@/api/calculators";
import { drillingSchema, numberField } from "@/components/calculators/calculatorSchemas";
import ResultRow from "@/components/calculators/ResultRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DrillingCalculator() {
  const [result, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(drillingSchema),
    defaultValues: { vc: undefined, n: undefined, fn: undefined, f: undefined, d: undefined },
  });

  const vc = watch("vc");
  const n = watch("n");
  const fn = watch("fn");
  const f = watch("f");

  useEffect(() => {
    if (vc != null && n != null) {
      setValue("n", undefined, { shouldValidate: true });
    }
  }, [vc, n, setValue]);

  useEffect(() => {
    if (fn != null && f != null) {
      setValue("f", undefined, { shouldValidate: true });
    }
  }, [fn, f, setValue]);

  async function onSubmit(values) {
    try {
      const response = await calculateDrilling(values);
      setResult(response);
    } catch (error) {
      toast.error(error.message || "Blad polaczenia z serwerem");
    }
  }

  function handleClear() {
    reset();
    setResult(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Kalkulator wiercenia</CardTitle>
          <CardDescription>Podaj dane i oblicz parametry wiercenia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vc">Vc *</Label>
                <Input id="vc" type="number" step="any" disabled={n != null} {...register("vc", numberField)} />
                {errors.vc ? <p className="mt-1 text-sm text-red-400">{errors.vc.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="n">n *</Label>
                <Input id="n" type="number" step="any" disabled={vc != null} {...register("n", numberField)} />
              </div>
              <div>
                <Label htmlFor="fn">fn *</Label>
                <Input id="fn" type="number" step="any" disabled={f != null} {...register("fn", numberField)} />
                {errors.fn ? <p className="mt-1 text-sm text-red-400">{errors.fn.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="f">F *</Label>
                <Input id="f" type="number" step="any" disabled={fn != null} {...register("f", numberField)} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="d">D *</Label>
                <Input id="d" type="number" step="any" {...register("d", numberField)} />
                {errors.d ? <p className="mt-1 text-sm text-red-400">{errors.d.message}</p> : null}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClear}>
                CLEAR
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                OBLICZ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wyniki</CardTitle>
          <CardDescription>Wyniki odswiezaja sie po zatwierdzeniu formularza.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div>
              <ResultRow label="Vc" value={result.vc} unit="m/min" />
              <ResultRow label="n" value={result.n} unit="obr/min" />
              <ResultRow label="fn" value={result.fn} unit="mm/obr" />
              <ResultRow label="F" value={result.f} unit="mm/min" />
            </div>
          ) : (
            <p className="text-sm text-slate-400">Brak wyniku. Wypelnij formularz i kliknij OBLICZ.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
