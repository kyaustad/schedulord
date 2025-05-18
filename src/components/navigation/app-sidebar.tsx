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
import { useCompanyData } from "@/hooks/use-company-data";
import { useSession } from "@/hooks/use-session";
import { removePlural } from "@/lib/utils";

export const AppSidebar = () => {
  const {
    session,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useSession();
  const {
    companyData,
    error: companyError,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useCompanyData(session?.user?.id ?? "", session?.user?.role ?? "user");

  const navAdmin = [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: House,
      isActive: true,
    },
    {
      title: "Admin Settings",
      url: "/admin/company",
      icon: Building2,
      isActive: false,
      items: [
        {
          title: "Company",
          url: "/admin/company",
        },
        {
          title: companyData?.preferences?.names?.location ?? "Locations",
          url: "/admin/locations",
        },
        {
          title: companyData?.preferences?.names?.team ?? "Teams",
          url: "/admin/teams",
        },
        {
          title: "Employees",
          url: "/admin/employees",
        },
      ],
    },
  ];
  const navManager = [
    {
      title: "Dashboard",
      url: "/dashboard/manager",
      icon: House,
      isActive: true,
    },
    {
      title: "Manager Settings",
      url: "/manager/settings",
      icon: Building2,
      isActive: false,
      items: [
        {
          title: removePlural(
            companyData?.preferences?.names?.location ?? "Location"
          ),
          url: "/manager/locations",
        },
        {
          title: companyData?.preferences?.names?.team ?? "Teams",
          url: "/admin/teams",
        },
        {
          title: "Employees",
          url: "/admin/employees",
        },
      ],
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
        {session?.user?.role === "admin" && <NavMain items={navAdmin} />}
        {session?.user?.role === "manager" && <NavMain items={navManager} />}
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
