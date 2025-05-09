import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex-1 h-full w-full flex flex-col">
        <div className="h-14 border-b flex items-center px-4">
          <SidebarTrigger />
        </div>
        <div className="flex-1 p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
