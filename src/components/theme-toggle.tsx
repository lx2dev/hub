"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({
  className,
}: React.ComponentProps<typeof Button>) {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <Button
      className={cn("group/toggle extend-touch-target size-8", className)}
      onClick={toggleTheme}
      size="icon"
      title="Toggle theme"
      variant="ghost"
    >
      <Sun className="dark:-rotate-90 size-4 rotate-0 scale-100 fill-current transition-all dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 fill-current transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
