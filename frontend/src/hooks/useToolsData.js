import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function useToolsData(fetchFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Blad ladowania danych");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Filtrowanie
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      const lower = value.toLowerCase();
      result = result.filter((item) => {
        const fieldValue = item[key];
        if (fieldValue == null) return false;
        return String(fieldValue).toLowerCase().includes(lower);
      });
    }

    // Sortowanie
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal), "pl");
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  return { data, loading, filteredData, sortConfig, handleSort, filters, setFilters, refetch: fetchData };
}
