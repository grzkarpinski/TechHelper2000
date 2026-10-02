import { Link, useNavigate } from "react-router-dom";
import { Calculator, Drill, Gauge, LogIn, Shield, TableProperties } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import SidebarLink from "./SidebarLink";
import ThemeToggle from "./ThemeToggle";

const publicCalcLinks = [
  { to: "/calculators/milling", label: "Frezowanie", icon: Calculator },
  { to: "/calculators/drilling", label: "Wiercenie", icon: Drill },
];

const adminCalcLinks = [
  { to: "/calculators/cost", label: "Koszt obrobki", icon: Gauge },
];

const toolLinks = [
  { to: "/tools/milling-heads", label: "Glowice frezarskie", icon: TableProperties },
  { to: "/tools/milling-cutters", label: "Frezy", icon: TableProperties },
  { to: "/tools/drills", label: "Wiertla", icon: TableProperties },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-4 py-4">
        <Link to="/" className="block">
          <img
            src="/logo.png"
            alt="Machining Helper"
            className="mx-auto h-auto w-4/5 rounded-lg border border-border bg-graphic object-contain"
          />
          <p className="mt-2 text-center text-lg font-semibold text-foreground">Machining Helper</p>
          <p className="text-center text-sm text-muted-foreground">Pomocnik Technologa</p>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="mb-6">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Kalkulatory</p>
          {publicCalcLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
          {isAdmin ? adminCalcLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          )) : null}
        </div>
        {isAdmin ? (
          <div>
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Baza narzedzi</p>
            {toolLinks.map((link) => (
              <SidebarLink key={link.to} {...link} />
            ))}
            <SidebarLink to="/admin" label="Panel admina" icon={Shield} />
          </div>
        ) : null}
      </nav>
      <div className="space-y-3 border-t border-border p-4">
        <ThemeToggle />
        {user ? (
          <>
            <div>
              <p className="text-sm font-medium text-foreground">{user.username}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={logout}>
              Wyloguj
            </Button>
          </>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
            <LogIn className="mr-2 h-4 w-4" />
            Zaloguj
          </Button>
        )}
      </div>
      <p className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">by Grzegorz Karpiński 2026</p>
    </aside>
  );
}
