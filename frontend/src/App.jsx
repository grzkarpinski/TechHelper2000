import { Navigate, Route, Routes } from "react-router-dom";

import { AdminRoute, PrivateRoute } from "@/components/layout/RouteGuards";
import LoginPage from "@/pages/LoginPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/calculators/milling" element={<PlaceholderPage title="Kalkulator frezowania" description="Tutaj pojawi sie kalkulator parametrow frezowania w fazie 2." />} />
        <Route path="/calculators/drilling" element={<PlaceholderPage title="Kalkulator wiercenia" description="Tutaj pojawi sie kalkulator parametrow wiercenia w fazie 2." />} />
        <Route path="/calculators/cost" element={<PlaceholderPage title="Kalkulator kosztu" description="Tutaj pojawi sie kalkulator kosztu obrobki w fazie 2." />} />
        <Route path="/tools/milling-heads" element={<PlaceholderPage title="Glowice frezarskie" description="Modul katalogu narzedzi zostanie uzupelniony w fazie 3." />} />
        <Route path="/tools/milling-cutters" element={<PlaceholderPage title="Frezy" description="Modul katalogu narzedzi zostanie uzupelniony w fazie 3." />} />
        <Route path="/tools/drills" element={<PlaceholderPage title="Wiertla" description="Modul katalogu narzedzi zostanie uzupelniony w fazie 3." />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<PlaceholderPage title="Panel admina" description="Zarzadzanie kontami pojawi sie w fazie 4." />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/calculators/milling" replace />} />
    </Routes>
  );
}
