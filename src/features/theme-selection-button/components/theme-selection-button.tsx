"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useSystemTheme from "@/hooks/use-system-theme";

interface ThemeSelectionButtonProps {
  position?: "absolute" | "relative";
}

export default function ThemeSelectionButton({
  position = "absolute",
}: ThemeSelectionButtonProps) {
  const { theme, setTheme } = useSystemTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={`${
            position === "absolute" ? "absolute right-4 top-4" : ""
          } aspect-square`}
        >
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("light")}
            className={theme === "light" ? "bg-accent" : ""}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "bg-accent" : ""}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
