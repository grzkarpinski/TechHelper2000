import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";

export default function AppShell({ children }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:flex-row bg-background dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,1),_rgba(2,6,23,1))]">
      <div className="hidden lg:flex"><Sidebar /></div>
      <MobileNavigation />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto p-3 sm:p-6">{children}</main>
    </div>
  );
}
