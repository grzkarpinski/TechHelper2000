import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const Icon = isLight ? Moon : Sun;

  return (
    <Button type="button" variant="outline" className="w-full gap-2" onClick={toggleTheme}
      aria-label={isLight ? "Włącz tryb ciemny" : "Włącz tryb jasny"}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {isLight ? "Tryb ciemny" : "Tryb jasny"}
    </Button>
  );
}
