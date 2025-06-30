"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
    >
      {theme === "light" ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
      <span className="sr-only">Przełącz motyw</span>
    </Button>
  );
}

interface ThemeButtonProps {
  targetTheme: "light" | "dark";
  children: React.ReactNode;
  className?: string;
}

export function ThemeButton({
  targetTheme,
  children,
  className,
}: ThemeButtonProps) {
  const { setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(targetTheme)}
      className={className}
    >
      {children}
    </Button>
  );
}
