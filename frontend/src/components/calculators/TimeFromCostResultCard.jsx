import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TimeFromCostResultCard({ response }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wynik czasu obróbki</CardTitle>
        <CardDescription>Łączny czas obejmuje całą podaną wartość operacji.</CardDescription>
      </CardHeader>
      <CardContent>
        {response ? (
          <div className="space-y-2">
            {response.operations.map((operation, index) => (
              <div key={`${operation.group_id}-${index}`} className="rounded-md border border-border p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Grupa {operation.group_id} · {operation.cost.toFixed(2)} PLN</span>
                  <span className="text-green-400">{operation.time_minutes.toFixed(1)} min</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Łącznie ({response.total_cost.toFixed(2)} PLN)</span>
              <span className="text-green-400">{response.total_time_minutes.toFixed(1)} min</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Brak wyniku. Dodaj operacje i kliknij OBLICZ.</p>
        )}
      </CardContent>
    </Card>
  );
}
