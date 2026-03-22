import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function UserRow({ user, onEdit, onDelete }) {
  return (
    <TableRow className="hover:bg-slate-800/50">
      <TableCell className="whitespace-nowrap">{user.username}</TableCell>
      <TableCell className="whitespace-nowrap">
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role === "admin" ? "Admin" : "Uzytkownik"}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {user.is_active ? (
          <Badge className="bg-green-600 hover:bg-green-600">Aktywny</Badge>
        ) : (
          <Badge variant="destructive">Zablokowany</Badge>
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">{formatDate(user.created_at)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(user)}>
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
