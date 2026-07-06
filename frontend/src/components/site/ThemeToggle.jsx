import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/theme/ThemeContext";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggle } = useTheme();
    const isDark = theme === "dark";
    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            data-testid="theme-toggle"
            className={`relative inline-flex items-center justify-center w-10 h-10 border border-white/15 dark:border-white/15 light:border-black/15 hover:border-[#e60000] transition-colors ${className}`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun size={16} strokeWidth={1.5} className="text-white" />
            ) : (
                <Moon size={16} strokeWidth={1.5} className="text-black" />
            )}
        </button>
    );
}
