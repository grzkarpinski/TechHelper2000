import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ToolsTableHeader({ columns, sortConfig, onSort }) {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((col) => {
          const isActive = sortConfig.key === col.key;
          return (
            <TableHead
              key={col.key}
              className="cursor-pointer select-none whitespace-nowrap"
              onClick={() => onSort(col.key)}
            >
              <span className="inline-flex items-center gap-1">
                {col.label}
                {isActive ? (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </span>
            </TableHead>
          );
        })}
        <TableHead className="text-right">Akcje</TableHead>
      </TableRow>
    </TableHeader>
  );
}
