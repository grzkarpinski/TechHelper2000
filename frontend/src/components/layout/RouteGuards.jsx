import { Navigate, Outlet, useLocation } from "react-router-dom";

import AppShell from "./AppShell";
import { useAuth } from "@/context/AuthContext";

export function PublicRoute() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Ladowanie...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/calculators/milling" replace />;
  }

  return <Outlet />;
}
