import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Witaj w Machining Helper</CardTitle>
          <CardDescription>
            Aplikacja wspiera technologa obróbki skrawaniem w codziennej pracy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
          <p>
            Znajdziesz tutaj kalkulatory parametrów skrawania, bazę narzędzi oraz panel
            administracyjny dostępny dla uprawnionych użytkowników.
          </p>
          <p className="text-slate-400">
            Wybierz moduł z menu po lewej stronie, aby przejść dalej.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}