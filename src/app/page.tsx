"use client";

import useSystemTheme from "@/hooks/use-system-theme";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export default function Home() {
  const { theme, setTheme } = useSystemTheme();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center flex flex-col items-center">
          <Image src="/logo_v1.png" alt="logo" width={200} height={200} />
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </Button>
        </div>
      </main>
    </div>
  );
}
