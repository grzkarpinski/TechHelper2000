import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaceholderPage({ title, description }) {
  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed border-border bg-slate-950/40 p-10 text-center text-slate-400">
          Ten modul jest przygotowany w fazie 1 jako placeholder na dalsza implementacje.
        </div>
      </CardContent>
    </Card>
  );
}
