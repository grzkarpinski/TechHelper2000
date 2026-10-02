import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils.js";

export default function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink to={to} className={({ isActive }) => cn(
      "flex items-center gap-3 border-l-2 px-4 py-2 text-sm transition-colors",
      isActive
        ? "border-l-primary bg-accent text-accent-foreground"
        : "border-l-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    )}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}
