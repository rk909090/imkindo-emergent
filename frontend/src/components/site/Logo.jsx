import React from "react";

/**
 * imk. wordmark — uses the real Imkindo logo asset (transparent PNG,
 * white letters + red dots) processed from the client-supplied file.
 */
export default function Logo({ size = 32, className = "" }) {
    // size represents the target rendered height in px
    const height = size;
    return (
        <img
            src="/imk-logo-white.png"
            alt="imk."
            data-testid="imk-logo"
            className={`imk-logo-img ${className}`}
            style={{ height: `${height}px`, width: "auto" }}
            draggable={false}
        />
    );
}
