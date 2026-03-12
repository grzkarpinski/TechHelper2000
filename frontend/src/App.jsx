import { Navigate, Route, Routes } from "react-router-dom";

import CostCalculator from "@/components/calculators/CostCalculator";
import DrillingCalculator from "@/components/calculators/DrillingCalculator";
import MillingCalculator from "@/components/calculators/MillingCalculator";
import { AdminRoute, PrivateRoute } from "@/components/layout/RouteGuards";
import LoginPage from "@/pages/LoginPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/calculators/milling" element={<MillingCalculator />} />
        <Route path="/calculators/drilling" element={<DrillingCalculator />} />
        <Route path="/calculators/cost" element={<CostCalculator />} />
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
