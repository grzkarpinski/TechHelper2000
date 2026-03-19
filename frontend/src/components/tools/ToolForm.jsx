import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildToolSchema } from "@/constants/toolFields";

export default function ToolForm({ open, onOpenChange, fields, initialData, onSubmit, title }) {
  const schema = buildToolSchema(fields);
  const isEdit = initialData != null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Resetuj formularz przy otwarciu/zmianie danych
  useEffect(() => {
    if (open) {
      if (initialData) {
        const mapped = {};
        for (const field of fields) {
          const val = initialData[field.key];
          mapped[field.key] = val != null ? String(val) : "";
        }
        reset(mapped);
      } else {
        const empty = {};
        for (const field of fields) {
          empty[field.key] = "";
        }
        reset(empty);
      }
    }
  }, [open, initialData, reset, fields]);

  async function handleFormSubmit(values) {
    // Usuń puste stringi — zamień na null/undefined
    const cleaned = {};
    for (const field of fields) {
      const val = values[field.key];
      if (val === "" || val === undefined) {
        cleaned[field.key] = null;
      } else if (field.type === "number") {
        cleaned[field.key] = Number(val);
      } else {
        cleaned[field.key] = val;
      }
    }
    await onSubmit(cleaned);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edytuj: ${title}` : `Dodaj: ${title}`}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Zmien dane narzedzia i zapisz." : "Wypelnij dane nowego narzedzia."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>
                {field.type === "select" ? (
                  <Select
                    defaultValue={initialData?.[field.key] || ""}
                    onValueChange={(val) => setValue(field.key, val, { shouldValidate: true })}
                  >
                    <SelectTrigger id={field.key}>
                      <SelectValue placeholder="Wybierz..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    step={field.type === "number" ? "any" : undefined}
                    {...register(field.key)}
                  />
                )}
                {errors[field.key] ? (
                  <p className="mt-1 text-sm text-red-400">{errors[field.key].message}</p>
                ) : null}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
