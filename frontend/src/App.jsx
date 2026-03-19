import { Navigate, Route, Routes } from "react-router-dom";

import CostCalculator from "@/components/calculators/CostCalculator";
import DrillingCalculator from "@/components/calculators/DrillingCalculator";
import MillingCalculator from "@/components/calculators/MillingCalculator";
import { AdminRoute, PrivateRoute } from "@/components/layout/RouteGuards";
import DrillsTable from "@/components/tools/DrillsTable";
import MillingCuttersTable from "@/components/tools/MillingCuttersTable";
import MillingHeadsTable from "@/components/tools/MillingHeadsTable";
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
        <Route path="/tools/milling-heads" element={<MillingHeadsTable />} />
        <Route path="/tools/milling-cutters" element={<MillingCuttersTable />} />
        <Route path="/tools/drills" element={<DrillsTable />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<PlaceholderPage title="Panel admina" description="Zarzadzanie kontami pojawi sie w fazie 4." />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/calculators/milling" replace />} />
    </Routes>
  );
}
