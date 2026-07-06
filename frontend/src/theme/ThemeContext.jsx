import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({ theme: "dark", toggle: () => {} });

const STORAGE_KEY = "imk-theme";

function detectDefault() {
    if (typeof window === "undefined") return "dark";
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    // Mobile → light default; Desktop → dark default
    const isMobile =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 768px)").matches;
    return isMobile ? "light" : "dark";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => detectDefault());

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("light", theme === "light");
        root.classList.toggle("dark", theme === "dark");
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
