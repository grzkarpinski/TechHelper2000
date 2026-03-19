import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createDrill, deleteDrill, getDrills, updateDrill } from "@/api/drills";
import DeleteConfirmDialog from "@/components/tools/DeleteConfirmDialog";
import ToolForm from "@/components/tools/ToolForm";
import ToolsFilterBar from "@/components/tools/ToolsFilterBar";
import ToolsTableHeader from "@/components/tools/ToolsTableHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DRILL_COLUMNS, DRILL_FIELDS } from "@/constants/toolFields";
import useToolsData from "@/hooks/useToolsData";

export default function DrillsTable() {
  const { loading, filteredData, sortConfig, handleSort, filters, setFilters, refetch } =
    useToolsData(getDrills);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  function handleAdd() {
    setEditItem(null);
    setFormOpen(true);
  }

  function handleEdit(item) {
    setEditItem(item);
    setFormOpen(true);
  }

  function handleDeleteClick(item) {
    setDeleteItem(item);
    setDeleteOpen(true);
  }

  async function handleFormSubmit(data) {
    try {
      if (editItem) {
        await updateDrill(editItem.id, data);
        toast.success("Zapisano pomyslnie");
      } else {
        await createDrill(data);
        toast.success("Zapisano pomyslnie");
      }
      setFormOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.message || "Blad zapisu");
    }
  }

  async function handleDeleteConfirm() {
    try {
      await deleteDrill(deleteItem.id);
      toast.success("Usunieto pomyslnie");
      setDeleteOpen(false);
      setDeleteItem(null);
      refetch();
    } catch (error) {
      toast.error(error.message || "Blad usuwania");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Wiertla</CardTitle>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Dodaj wiertlo
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ToolsFilterBar fields={DRILL_FIELDS} filters={filters} setFilters={setFilters} />
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <ToolsTableHeader columns={DRILL_COLUMNS} sortConfig={sortConfig} onSort={handleSort} />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={DRILL_COLUMNS.length + 1} className="text-center text-slate-400">
                    Ladowanie...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={DRILL_COLUMNS.length + 1} className="text-center text-slate-400">
                    Brak danych
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-800/50">
                    {DRILL_COLUMNS.map((col) => (
                      <TableCell key={col.key} className="whitespace-nowrap">
                        {item[col.key] != null ? item[col.key] : "—"}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ToolForm
        open={formOpen}
        onOpenChange={setFormOpen}
        fields={DRILL_FIELDS}
        initialData={editItem}
        onSubmit={handleFormSubmit}
        title="Wiertlo"
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        itemName={deleteItem?.symbol_narzedzia || ""}
      />
    </Card>
  );
}
