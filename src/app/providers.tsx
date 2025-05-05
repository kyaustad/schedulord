"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
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
    </ThemeProvider>
  );
}
