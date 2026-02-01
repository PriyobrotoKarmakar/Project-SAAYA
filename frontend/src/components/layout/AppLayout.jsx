import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <AppSidebar />

        <main className="flex-1 flex flex-col h-full min-h-0 overflow-hidden text-foreground">
          {/* Top Navigation */}
          <Header />

          {/* Main Page Content - No padding here, allow pages to control it */}
          <div className="flex-1 overflow-hidden bg-muted/20">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
