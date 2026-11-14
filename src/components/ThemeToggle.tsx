import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

type Mode = "light" | "dark"

const STORAGE_KEY = "theme"

function currentMode(): Mode {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function applyMode(mode: Mode) {
  document.documentElement.classList.toggle("dark", mode === "dark")
}

/**
 * Sun/moon button that switches the site between light and dark mode.
 * The first visit follows the visitor's system setting; once they click,
 * their choice is remembered in this browser.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>(() =>
    typeof document === "undefined" ? "light" : currentMode()
  )

  // Follow system changes until the visitor picks a mode themselves.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try { saved = localStorage.getItem(STORAGE_KEY) } catch {}
      if (saved) return
      const next: Mode = e.matches ? "dark" : "light"
      applyMode(next)
      setMode(next)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark"
    applyMode(next)
    setMode(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  const isDark = mode === "dark"
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        "border border-brand-line bg-brand-surface text-brand-sage600",
        "hover:bg-brand-sage50 transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky300",
        className,
      ].join(" ")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
