import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Sidebar from "./Sidebar";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-sidebar px-3 py-2 lg:hidden">
      <span className="font-semibold">Machining Helper</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" aria-label="Otwórz menu nawigacji">
            <Menu className="mr-2 h-4 w-4" aria-hidden="true" /> Menu
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined} className="left-0 top-0 h-dvh max-h-dvh w-72 max-w-[calc(100%-1rem)] translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 p-0 sm:rounded-none sm:p-0">
          <DialogTitle className="sr-only">Nawigacja aplikacji</DialogTitle>
          <Sidebar onNavigate={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
