import React from "react";

/**
 * imk. wordmark — recreation of the Imkindo logo.
 * Two red dots: one above the "i" and the period after "k".
 * The default lowercase "i" dot is masked by rendering "ı" (dotless i)
 * and layering a red circle above it.
 */
export default function Logo({ size = 32, className = "" }) {
    const style = { fontSize: `${size}px`, lineHeight: 1 };
    return (
        <span
            className={`imk-logo ${className}`}
            style={style}
            aria-label="imk."
            data-testid="imk-logo"
        >
            <span className="i" aria-hidden="true">
                <span className="i-letter">ı</span>
            </span>
            <span aria-hidden="true">mk</span>
            <span className="dot" aria-hidden="true">
                .
            </span>
        </span>
    );
}
