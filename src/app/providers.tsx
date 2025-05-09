"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { showPersistentToasts } from "@/lib/persistent-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  useEffect(() => {
    showPersistentToasts();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
    >
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
