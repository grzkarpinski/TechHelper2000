import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";

function buildSchema(isEdit) {
  return z.object({
    username: z.string().min(3, "Min. 3 znaki").max(50, "Max. 50 znakow"),
    password: isEdit
      ? z.string().max(128).optional().refine((v) => !v || v.length >= 8, { message: "Min. 8 znakow" })
      : z.string().min(8, "Min. 8 znakow").max(128, "Max. 128 znakow"),
    role: z.enum(["admin", "user"]),
    is_active: z.boolean(),
  });
}

export default function UserForm({ open, onOpenChange, initialData, onSubmit }) {
  const isEdit = initialData != null;
  const schema = buildSchema(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", role: "user", is_active: true },
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          username: initialData.username || "",
          password: "",
          role: initialData.role || "user",
          is_active: initialData.is_active ?? true,
        });
      } else {
        reset({ username: "", password: "", role: "user", is_active: true });
      }
    }
  }, [open, initialData, reset]);

  async function handleFormSubmit(values) {
    const cleaned = { username: values.username, role: values.role, is_active: values.is_active };
    if (values.password) {
      cleaned.password = values.password;
    }
    await onSubmit(cleaned);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edytuj uzytkownika" : "Dodaj uzytkownika"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Zmien dane uzytkownika i zapisz." : "Wypelnij dane nowego uzytkownika."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">Nazwa uzytkownika *</Label>
            <Input id="username" {...register("username")} disabled={isEdit} />
            {errors.username ? <p className="mt-1 text-sm text-red-400">{errors.username.message}</p> : null}
          </div>
          <div>
            <Label htmlFor="password">
              Haslo {isEdit ? "(pozostaw puste aby nie zmieniac)" : "*"}
            </Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password ? <p className="mt-1 text-sm text-red-400">{errors.password.message}</p> : null}
          </div>
          <div>
            <Label>Rola *</Label>
            <Select
              value={watch("role")}
              onValueChange={(val) => setValue("role", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Uzytkownik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(val) => setValue("is_active", val)}
            />
            <Label htmlFor="is_active">Konto aktywne</Label>
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
