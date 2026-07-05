import React, { useEffect, useState } from "react";
import Logo from "@/components/site/Logo";
import { Menu, X } from "lucide-react";

const NAV = [
    { label: "About", href: "#about" },
    { label: "Ventures", href: "#ventures" },
    { label: "Partnerships", href: "#partnerships" },
    { label: "Contact", href: "#contact" },
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const jump = (e, href) => {
        e.preventDefault();
        setOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <header
            data-testid="site-header"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
                <a
                    href="#top"
                    onClick={(e) => jump(e, "#top")}
                    data-testid="header-logo-link"
                    className="flex items-center"
                >
                    <Logo size={28} />
                </a>

                <nav className="hidden md:flex items-center gap-10">
                    {NAV.map((n) => (
                        <a
                            key={n.href}
                            href={n.href}
                            onClick={(e) => jump(e, n.href)}
                            className="nav-link"
                            data-testid={`nav-${n.label.toLowerCase()}-link`}
                        >
                            {n.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex">
                    <a
                        href="#contact"
                        onClick={(e) => jump(e, "#contact")}
                        className="imk-btn imk-btn-primary"
                        data-testid="header-cta-button"
                    >
                        Start a Conversation
                    </a>
                </div>

                <button
                    type="button"
                    className="md:hidden text-white p-2 -mr-2"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    data-testid="mobile-menu-toggle"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {open && (
                <div
                    className="md:hidden bg-[#050505] border-t border-white/10"
                    data-testid="mobile-menu"
                >
                    <div className="px-6 py-6 flex flex-col gap-5">
                        {NAV.map((n) => (
                            <a
                                key={n.href}
                                href={n.href}
                                onClick={(e) => jump(e, n.href)}
                                className="text-white text-lg font-display"
                                data-testid={`mobile-nav-${n.label.toLowerCase()}-link`}
                            >
                                {n.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={(e) => jump(e, "#contact")}
                            className="imk-btn imk-btn-primary mt-2 justify-center"
                            data-testid="mobile-header-cta-button"
                        >
                            Start a Conversation
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
