import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitch } from "./ThemeSwitch";
import { NotificationsNav } from "./NotificationsNav";
import { UserNav } from "./UserNav";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function Header() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple breadcrumb logic
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/map":
        return "Live Monitoring";
      case "/alerts":
        return "Emergency Alerts";
      case "/settings":
        return "System Settings";
      default:
        return "Overview";
    }
  };

  return (
    <header className="relative z-[2000] bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
      {/* Left: Sidebar Trigger & Title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-semibold text-lg tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Date & Time Display */}
      <div className="hidden md:flex items-center gap-4 px-4 ml-4 border-l h-8">
        <div className="flex flex-col items-end leading-none">
          <span className="text-sm font-bold font-mono">
            {currentTime.format("HH:mm:ss")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {currentTime.format("ddd, DD MMM")}
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="ml-auto flex items-center gap-4">
        <ThemeSwitch />
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        <NotificationsNav />
        <UserNav />
      </div>
    </header>
  );
}
