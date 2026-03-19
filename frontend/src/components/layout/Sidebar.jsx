import { Link, NavLink, useNavigate } from "react-router-dom";
import { Calculator, Drill, Gauge, LogIn, Shield, TableProperties } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

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

function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 border-l-2 px-4 py-2 text-sm transition-colors",
          isActive
            ? "border-l-blue-500 bg-slate-800 text-white"
            : "border-l-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white",
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-slate-950/80">
      <div className="border-b border-border px-6 py-5">
        <Link to="/calculators/milling" className="text-lg font-semibold text-white">
          Machining Helper
        </Link>
        <p className="mt-1 text-sm text-slate-400">Pomocnik Technologa</p>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="mb-6">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kalkulatory</p>
          {publicCalcLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
          {isAdmin ? adminCalcLinks.map((link) => (
            <SidebarLink key={link.to} {...link} />
          )) : null}
        </div>
        {isAdmin ? (
          <div>
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Baza narzedzi</p>
            {toolLinks.map((link) => (
              <SidebarLink key={link.to} {...link} />
            ))}
            <SidebarLink to="/admin" label="Panel admina" icon={Shield} />
          </div>
        ) : null}
      </nav>
      <div className="space-y-3 border-t border-border p-4">
        {user ? (
          <>
            <div>
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{user.role}</p>
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
      <p className="border-t border-border px-4 py-2 text-center text-xs text-slate-500">by Grzegorz Karpiński 2026</p>
    </aside>
  );
}
