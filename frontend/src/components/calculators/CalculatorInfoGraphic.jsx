import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CalculatorInfoGraphic({ title, src, alt }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Kliknij grafikę, aby otworzyć powiększenie.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="block w-full overflow-hidden rounded-md border border-border transition hover:border-blue-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`${title} - otworz powiekszenie`}
            >
              <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-contain"
              />
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-5xl overflow-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{alt}</DialogDescription>
            </DialogHeader>
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-md border border-border object-contain"
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
