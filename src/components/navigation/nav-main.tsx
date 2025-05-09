"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { type Route } from "next";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  showLabel = true,
  items,
}: {
  showLabel?: boolean;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { state } = useSidebar();

  // Validate that a URL is safe to use
  const isValidUrl = (url: string) => {
    return (
      url &&
      typeof url === "string" &&
      url.startsWith("/") &&
      !url.includes("null") &&
      !url.includes("undefined")
    );
  };

  return (
    <SidebarGroup>
      {showLabel && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          // Skip invalid items
          if (!isValidUrl(item.url)) {
            console.warn(`Invalid URL for menu item: ${item.title}`);
            return null;
          }

          // If there are no sub-items, render a simple link
          if (!item.items?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url as Route}>
                  <SidebarMenuButton
                    className="border-1 hover:cursor-pointer hover:scale-95 transition-all duration-200 border-muted-foreground my-2"
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          }

          // If there are sub-items, validate them first
          const validSubItems = item.items.filter((subItem) =>
            isValidUrl(subItem.url)
          );
          if (validSubItems.length === 0) {
            console.warn(`No valid sub-items for menu item: ${item.title}`);
            return null;
          }

          // If there are sub-items, render the collapsible dropdown
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger
                  asChild
                  className="border-1 hover:cursor-pointer hover:scale-95 transition-all duration-200 border-muted-foreground my-2"
                >
                  {state === "collapsed" ? (
                    <Link href={item.url as Route}>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </Link>
                  ) : (
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {validSubItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url as Route}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
