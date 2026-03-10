import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const INITIAL_FORM = { username: "", password: "" };

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/calculators/milling" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(form);
    } catch (error) {
      toast.error(error.message || "Blad logowania");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Logowanie</CardTitle>
          <CardDescription>Zaloguj sie, aby korzystac z aplikacji technologicznej.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Login *</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={updateField}
                placeholder="np. admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Haslo *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="Wpisz haslo"
                required
              />
            </div>
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Logowanie..." : "Zaloguj sie"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
