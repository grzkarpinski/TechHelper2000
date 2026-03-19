import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteConfirmDialog({ open, onOpenChange, onConfirm, itemName }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Potwierdzenie usuniecia</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunac <span className="font-medium text-foreground">{itemName}</span>?
            Tej operacji nie mozna cofnac.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Usun
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
