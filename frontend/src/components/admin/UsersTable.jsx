import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createUser, deleteUser, getUsers, updateUser } from "@/api/admin";
import UserForm from "@/components/admin/UserForm";
import UserRow from "@/components/admin/UserRow";
import DeleteConfirmDialog from "@/components/tools/DeleteConfirmDialog";
import ToolsTableHeader from "@/components/tools/ToolsTableHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import useToolsData from "@/hooks/useToolsData";

const COLUMNS = [
  { key: "username", label: "Nazwa uzytkownika" },
  { key: "role", label: "Rola" },
  { key: "is_active", label: "Status" },
  { key: "created_at", label: "Data utworzenia" },
];

export default function UsersTable() {
  const { loading, filteredData, sortConfig, handleSort, refetch } = useToolsData(getUsers);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  async function handleFormSubmit(data) {
    try {
      if (editItem) {
        const updateData = {};
        if (data.role !== editItem.role) updateData.role = data.role;
        if (data.is_active !== editItem.is_active) updateData.is_active = data.is_active;
        if (data.password) updateData.password = data.password;
        await updateUser(editItem.id, updateData);
      } else {
        await createUser(data);
      }
      toast.success("Zapisano pomyslnie");
      setFormOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.message || "Blad zapisu");
    }
  }

  async function handleDeleteConfirm() {
    try {
      await deleteUser(deleteItem.id);
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
        <CardTitle className="text-2xl font-semibold">Uzytkownicy</CardTitle>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Dodaj uzytkownika
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <ToolsTableHeader columns={COLUMNS} sortConfig={sortConfig} onSort={handleSort} />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} className="text-center text-slate-400">
                    Ladowanie...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} className="text-center text-slate-400">
                    Brak danych
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <UserRow
                    key={item.id}
                    user={item}
                    onEdit={(u) => { setEditItem(u); setFormOpen(true); }}
                    onDelete={(u) => { setDeleteItem(u); setDeleteOpen(true); }}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <UserForm open={formOpen} onOpenChange={setFormOpen} initialData={editItem} onSubmit={handleFormSubmit} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        itemName={deleteItem?.username || ""}
      />
    </Card>
  );
}
