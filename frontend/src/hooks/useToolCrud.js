import { useState } from "react";
import { toast } from "sonner";

export default function useToolCrud({ createItem, updateItem, deleteItem, refetch }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  function add() { setEditItem(null); setFormOpen(true); }
  function edit(item) { setEditItem(item); setFormOpen(true); }
  function showDetails(item) { setDetailItem(item); setDetailOpen(true); }
  function askToDelete(item) { setSelectedDeleteItem(item); setDeleteOpen(true); }

  async function save(data) {
    try {
      if (editItem) await updateItem(editItem.id, data);
      else await createItem(data);
      toast.success("Zapisano pomyślnie");
      setFormOpen(false);
      await refetch();
    } catch (error) {
      toast.error(error.message || "Błąd zapisu");
    }
  }

  async function confirmDelete() {
    try {
      await deleteItem(selectedDeleteItem.id);
      toast.success("Usunięto pomyślnie");
      setDeleteOpen(false);
      setSelectedDeleteItem(null);
      await refetch();
    } catch (error) {
      toast.error(error.message || "Błąd usuwania");
    }
  }

  return {
    formOpen, setFormOpen, editItem, deleteOpen, setDeleteOpen,
    selectedDeleteItem, detailOpen, setDetailOpen, detailItem,
    add, edit, showDetails, askToDelete, save, confirmDelete,
  };
}
