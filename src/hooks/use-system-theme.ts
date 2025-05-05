"use client";

import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type SetTheme = Dispatch<SetStateAction<Theme>>;

export default function useSystemTheme() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return {
      theme: "system",
      setTheme: () => {},
    };
  }

  return {
    theme: theme === "system" ? systemTheme : theme,
    setTheme,
  } as { theme: Theme; setTheme: SetTheme };
}
