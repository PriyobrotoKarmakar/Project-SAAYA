import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Map as MapIcon,
  Siren,
  FileText,
  Settings,
  Shield,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Menu Items
const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Live Map", url: "/map", icon: MapIcon },
  { title: "Alerts", url: "/alerts", icon: Siren },
  { title: "Data Logs", url: "/data", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1 font-semibold text-sidebar-foreground">
          <img src="/favicon.png" alt="Saaya Logo" className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">
            Project Saaya
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title} // Adds hover tooltip automatically in collapsed mode
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground bg-sidebar-accent/50 rounded-md">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">
            System Online
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
