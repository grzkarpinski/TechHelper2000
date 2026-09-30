import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function ToolsTableRows({ loading, items, columns, actions }) {
  if (loading || items.length === 0) {
    return (
      <TableBody><TableRow>
        <TableCell colSpan={columns.length + 1} className="text-center text-slate-400">
          {loading ? "Ładowanie..." : "Brak danych"}
        </TableCell>
      </TableRow></TableBody>
    );
  }
  return (
    <TableBody>{items.map((item) => (
      <TableRow key={item.id} className="hover:bg-slate-800/50">
        {columns.map((column) => (
          <TableCell key={column.key} className="whitespace-nowrap">
            {item[column.key] != null ? item[column.key] : "—"}
          </TableCell>
        ))}
        <TableCell className="text-right"><div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => actions.showDetails(item)}>
            <Eye className="h-4 w-4 text-blue-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => actions.edit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => actions.askToDelete(item)}>
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div></TableCell>
      </TableRow>
    ))}</TableBody>
  );
}
