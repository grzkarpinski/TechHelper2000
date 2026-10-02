import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/layout/ThemeToggle";

const INITIAL_FORM = { username: "", password: "" };

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Logowanie</CardTitle>
          <CardDescription>Zaloguj sie, aby korzystac z aplikacji technologicznej.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
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
              <Label htmlFor="password">Hasło *</Label>
              <div className="flex items-center gap-2">
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                className="min-w-0 flex-1"
                value={form.password}
                onChange={updateField}
                placeholder="Wpisz hasło"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                aria-label={isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
                aria-pressed={isPasswordVisible}
                aria-controls="password"
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                {isPasswordVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </Button>
              </div>
            </div>
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Logowanie..." : "Zaloguj sie"}
            </Button>
          </form>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
