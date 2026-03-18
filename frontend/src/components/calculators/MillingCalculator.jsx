import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { calculateMilling } from "@/api/calculators";
import { millingSchema, numberField } from "@/components/calculators/calculatorSchemas";
import ResultRow from "@/components/calculators/ResultRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MillingCalculator() {
  const [result, setResult] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(millingSchema),
    defaultValues: { vc: undefined, n: undefined, fz: undefined, f: undefined, d: undefined, z: undefined, ap: undefined, ae: undefined },
  });

  const vc = watch("vc");
  const n = watch("n");
  const fz = watch("fz");
  const f = watch("f");

  useEffect(() => {
    if (vc != null && n != null) {
      setValue("n", undefined, { shouldValidate: true });
    }
  }, [vc, n, setValue]);

  useEffect(() => {
    if (fz != null && f != null) {
      setValue("f", undefined, { shouldValidate: true });
    }
  }, [fz, f, setValue]);

  async function onSubmit(values) {
    try {
      const response = await calculateMilling(values);
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
          <CardTitle className="text-2xl font-semibold">Kalkulator frezowania</CardTitle>
          <CardDescription>Podaj dane i oblicz parametry skrawania.</CardDescription>
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
                <Label htmlFor="fz">Fz *</Label>
                <Input id="fz" type="number" step="any" disabled={f != null} {...register("fz", numberField)} />
                {errors.fz ? <p className="mt-1 text-sm text-red-400">{errors.fz.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="f">F *</Label>
                <Input id="f" type="number" step="any" disabled={fz != null} {...register("f", numberField)} />
              </div>
              <div>
                <Label htmlFor="d">D *</Label>
                <Input id="d" type="number" step="any" {...register("d", numberField)} />
                {errors.d ? <p className="mt-1 text-sm text-red-400">{errors.d.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="z">z *</Label>
                <Input id="z" type="number" step="1" {...register("z", numberField)} />
                {errors.z ? <p className="mt-1 text-sm text-red-400">{errors.z.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="ap">Ap</Label>
                <Input id="ap" type="number" step="any" {...register("ap", numberField)} />
              </div>
              <div>
                <Label htmlFor="ae">Ae</Label>
                <Input id="ae" type="number" step="any" {...register("ae", numberField)} />
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
              <ResultRow label="Vc" value={Math.round(result.vc)} unit="m/min" />
              <ResultRow label="Fz" value={Number(result.fz).toFixed(2)} unit="mm/zab" />
              <div className="my-2" />
              <ResultRow label="n" value={Math.round(result.n)} unit="obr/min" />
              <ResultRow label="F" value={Math.round(result.f)} unit="mm/min" />
              {result.q != null ? <ResultRow label="Q" value={Number(result.q).toFixed(2)} unit="cm³/min" /> : null}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Brak wyniku. Wypelnij formularz i kliknij OBLICZ.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
