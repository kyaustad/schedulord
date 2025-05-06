"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { showPersistentToasts } from "@/lib/persistent-toast";

export default function Providers({ children }: { children: ReactNode }) {
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
      <div className="min-h-screen bg-background text-foreground transition-colors duration-[1000ms]">
        {children}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
