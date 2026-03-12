import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CostResultCard({ response }) {
  const totalTpz = response
    ? response.operations.reduce((sum, operation) => sum + Number(operation.tpz || 0), 0)
    : 0;
  const totalTj = response
    ? response.operations.reduce((sum, operation) => sum + Number(operation.tj || 0), 0)
    : 0;
  const totalCostTpz = response
    ? response.operations.reduce((sum, operation) => sum + Number(operation.cost_tpz || 0), 0)
    : 0;
  const totalCostTj = response
    ? response.operations.reduce((sum, operation) => sum + Number(operation.cost_tj || 0), 0)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wynik kosztu</CardTitle>
        <CardDescription>Szczegoly pojawiaja sie po kliknieciu OBLICZ.</CardDescription>
      </CardHeader>
      <CardContent>
        {response ? (
          <div className="space-y-2">
            {response.operations.map((operation, index) => (
              <div key={`${operation.group_id}-${index}`} className="space-y-1 rounded-md border border-border p-3 text-sm">
                <div className="text-slate-400">Grupa {operation.group_id}</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tpz</span>
                  <span className="text-green-400">{operation.cost_tpz.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tj</span>
                  <span className="text-green-400">{operation.cost_tj.toFixed(2)} PLN</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 font-medium">
                  <span>Razem</span>
                  <span className="text-green-400">{operation.total.toFixed(2)} PLN</span>
                </div>
              </div>
            ))}
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Suma Tpz</span>
                <span>{totalTpz.toFixed(2)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Suma Tj</span>
                <span>{totalTj.toFixed(2)} min</span>
              </div>
            </div>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-base font-semibold">
              <div className="flex justify-between">
                <span>Suma (Tpz)</span>
                <span className="text-green-400">{totalCostTpz.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between">
                <span>Suma (Tj)</span>
                <span className="text-green-400">{totalCostTj.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span>Suma razem</span>
                <span className="text-green-400">{response.total.toFixed(2)} PLN</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Brak wyniku. Dodaj operacje i kliknij OBLICZ.</p>
        )}
      </CardContent>
    </Card>
  );
}
