import React from "react";
import { useTheme } from "@/theme/ThemeContext";

/**
 * imk. wordmark — uses white-letter logo for dark theme,
 * dark-letter logo for light theme. Both have transparent backgrounds.
 */
export default function Logo({ size = 32, className = "" }) {
    const { theme } = useTheme();
    const src = theme === "light" ? "/imk-logo-dark.png" : "/imk-logo-white.png";
    return (
        <img
            src={src}
            alt="imk."
            data-testid="imk-logo"
            className={`imk-logo-img ${className}`}
            style={{ height: `${size}px`, width: "auto" }}
            draggable={false}
        />
    );
}
