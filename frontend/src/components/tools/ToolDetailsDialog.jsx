import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ToolDetailsDialog({ open, onOpenChange, fields, item, title }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>Szczegóły: {title}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-2">
          {fields.map((field) => {
            const value = item[field.key];
            const display = field.options?.find((option) => option.value === value)?.label
              ?? (value != null && value !== "" ? String(value) : "—");
            return (
              <div key={field.key}>
                <p className="text-xs font-medium text-slate-400">{field.label}</p>
                <p className="text-sm text-white">{display}</p>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zamknij</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
