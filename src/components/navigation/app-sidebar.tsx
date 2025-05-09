import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { House, CalendarDays, Building2 } from "lucide-react";

import { NavMain } from "./nav-main";
import ThemeSelectionButton from "@/features/theme-selection-button/components/theme-selection-button";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { env } from "@/env/env";
export const AppSidebar = () => {
  const navAdmin = [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: House,
      isActive: true,
    },
    {
      title: "Company",
      url: "/admin/company",
      icon: Building2,
      isActive: false,
      items: [
        {
          title: "Company Settings",
          url: "/admin/company",
        },
        {
          title: "Locations",
          url: "/admin/locations",
        },
        {
          title: "Teams",
          url: "/admin/teams",
        },
        {
          title: "Employees",
          url: "/admin/employees",
        },
      ],
    },
    {
      title: "Schedule",
      url: "/admin/schedule",
      icon: CalendarDays,
      isActive: false,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row justify-start gap-1 items-center align-middle">
          <Image
            src={env.NEXT_PUBLIC_APP_ICON_URL}
            alt="logo"
            className="rounded-xl"
            width={60}
            height={60}
          />
          <h1 className="text-2xl font-bold">Schedulord</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navAdmin} />
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full flex justify-end">
          <ThemeSelectionButton position="relative" />
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
