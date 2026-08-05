import React from "react";
import { ArrowUpRight } from "lucide-react";

const VENTURES = [
    {
        num: "V/01",
        name: "NowAgentAI",
        trademark: "™",
        tagline: "AI-powered customer engagement designed to ensure valuable opportunities are never lost because conversations stopped.",
        body: "Customer conversations, lead recovery and intelligent follow-up — turning connection into revenue.",
        tags: ["Customer Conversations", "Lead Recovery", "Intelligent Follow-up", "Revenue Opportunities"],
        cta: "Visit NowAgentAI",
        href: "https://www.nowagentai.com",
        accent: "waves",
        role: "Customer AI",
    },
    {
        num: "V/02",
        name: "NowDealSheet",
        trademark: "™",
        tagline: "Private introductions in off-market commercial real estate — verified sellers, verified buyers, NDA-gated.",
        body: "Anonymised deals, human-reviewed listings, AI-assisted drafting. Introducer only — never in the trade, no success fees, no client funds.",
        tags: ["Off-Market CRE", "NDA-Gated", "AI-Assisted", "Human-Reviewed"],
        cta: "Visit NowDealSheet",
        href: "https://www.nowdealsheet.com",
        accent: "board",
        role: "CRE Platform",
    },
];

// In-development ventures — muted styling, no external CTA.
const IN_DEVELOPMENT = [
    {
        num: "V/03",
        name: "NowMoveMe",
        subtitle: "In Development",
        description:
            "Intelligent property discovery designed to help people move with confidence by understanding what really matters — better decisions through AI-powered matching, not endless searching.",
        tags: ["Better Decisions", "Customer Intent", "AI-powered Matching"],
        note: null,
    },
    {
        num: "V/04",
        name: "NowInspect",
        subtitle: "In Development",
        description:
            "An AI property inspection application — bringing applied intelligence to residential and commercial property surveys, so decisions are grounded in clearer, faster, more consistent data.",
        tags: ["Property Inspection", "AI Surveys", "Applied AI"],
        note: "Website to follow",
    },
];

export default function Ventures() {
    return (
        <section
            id="ventures"
            data-testid="ventures-section"
            className="relative border-t border-white/10 py-24 lg:py-40"
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-end justify-between flex-wrap gap-6 mb-16 reveal">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="card-marker" />
                            <span className="overline">04 // Our Ventures</span>
                        </div>
                        <h2 className="font-display text-4xl lg:text-6xl font-bold text-white max-w-3xl tracking-tight">
                            Building the future,
                            <br />
                            today.
                        </h2>
                    </div>
                    <p className="max-w-md text-neutral-400 text-[15px] leading-relaxed">
                        Imkindo identifies opportunities, creates AI-powered
                        ventures and builds solutions around real commercial
                        challenges. Two currently live, more in development.
                    </p>
                </div>

                {/* Parent company structure diagram */}
                <div
                    data-testid="ventures-structure"
                    className="mb-24 lg:mb-28 border border-white/10 bg-[#0a0a0a] px-6 sm:px-10 py-10 lg:py-14 reveal"
                >
                    <div className="flex flex-col items-center text-center">
                        <span className="overline mb-3">Applied Intelligence</span>
                        <div className="font-display text-3xl lg:text-5xl font-bold text-white tracking-tight leading-none">
                            IMKINDO<span className="text-[#e60000]">.</span>
                        </div>
                        <div className="mt-2 text-neutral-500 text-xs lg:text-sm font-mono uppercase tracking-[0.24em]">
                            Identifies · Creates · Builds
                        </div>

                        {/* vertical connector */}
                        <div className="my-8 h-10 w-px bg-white/15 relative">
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#e60000]" />
                        </div>

                        {/* horizontal branch */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-4 sm:gap-6 lg:gap-10 relative w-full max-w-4xl">
                            {/* Desktop-only horizontal connector line spanning the 4 columns.
                                Hidden on mobile because 2x2 stacking would leave it dangling. */}
                            <div
                                className="hidden sm:block absolute top-0 left-[12.5%] right-[12.5%] h-px bg-white/15"
                                aria-hidden="true"
                            />
                            {[
                                {
                                    name: "NowAgentAI",
                                    role: "Customer AI",
                                    live: true,
                                },
                                {
                                    name: "NowDealSheet",
                                    role: "CRE Platform",
                                    live: true,
                                },
                                {
                                    name: "NowMoveMe",
                                    role: "In Development",
                                    live: false,
                                },
                                {
                                    name: "NowInspect",
                                    role: "In Development",
                                    live: false,
                                },
                            ].map((v) => (
                                <div
                                    key={v.name}
                                    data-testid={`ventures-structure-item-${v.name.toLowerCase()}`}
                                    className="flex flex-col items-center relative pt-6 sm:pt-8"
                                >
                                    {/* Vertical stub — desktop only (would dangle on mobile) */}
                                    <span
                                        className={`hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 ${
                                            v.live
                                                ? "bg-white/15"
                                                : "bg-white/10 border-l border-dashed border-white/20"
                                        }`}
                                        aria-hidden="true"
                                    />
                                    {/* Dot — sits on the connector on desktop, sits above the name on mobile */}
                                    <span
                                        className={`absolute top-0 sm:top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                                            v.live
                                                ? "bg-[#e60000]"
                                                : "bg-transparent border border-neutral-500"
                                        }`}
                                        aria-hidden="true"
                                    />
                                    <div
                                        className={`font-display text-base sm:text-lg lg:text-2xl font-bold tracking-tight mt-3 sm:mt-2 whitespace-nowrap ${
                                            v.live ? "text-white" : "text-neutral-500"
                                        }`}
                                    >
                                        {v.name}
                                        {v.live && (
                                            <span className="text-[#e60000] text-xs align-super ml-0.5">
                                                ™
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 text-neutral-500 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-center">
                                        {v.role}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Caption — current ventures + room for more */}
                        <div className="mt-10 flex items-center gap-4 text-neutral-500 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em]">
                            <span className="h-px w-8 bg-white/15" aria-hidden="true" />
                            <span data-testid="ventures-caption">
                                Current ventures powered by Imkindo
                            </span>
                            <span className="text-[#e60000]">+</span>
                            <span className="text-neutral-600">more to follow</span>
                            <span className="h-px w-8 bg-white/15" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <div className="space-y-24 lg:space-y-32">
                    {VENTURES.map((v, idx) => (
                        <article
                            key={v.name}
                            className="reveal"
                            data-testid={`venture-${v.name.toLowerCase()}`}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                                <div className="lg:col-span-5">
                                    <VentureGlyph accent={v.accent} />
                                </div>

                                <div className="lg:col-span-7">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="venture-index">
                                            {v.num}
                                        </span>
                                        <span className="h-px flex-1 bg-white/10" />
                                    </div>

                                    <h3 className="font-display text-5xl lg:text-7xl font-bold text-white tracking-tight leading-none">
                                        {v.name}
                                        <span className="text-[#e60000] text-2xl align-super ml-1">
                                            {v.trademark}
                                        </span>
                                    </h3>
                                    <div className="mt-3 overline">
                                        {v.role}
                                    </div>

                                    <p className="mt-6 text-white text-lg lg:text-xl font-light max-w-xl leading-snug">
                                        {v.tagline}
                                    </p>

                                    <p className="mt-6 text-neutral-400 leading-relaxed text-[15px] max-w-xl">
                                        {v.body}
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {v.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="venture-tag"
                                                data-testid={`venture-tag-${v.name.toLowerCase()}-${t.toLowerCase().replace(/\s+/g, "-")}`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-10">
                                        <a
                                            href={v.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="imk-btn imk-btn-secondary group"
                                            data-testid={`venture-${v.name.toLowerCase()}-cta`}
                                        >
                                            {v.cta}
                                            <ArrowUpRight
                                                size={18}
                                                strokeWidth={1.5}
                                                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-[#e60000]"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}

                    {/* Ventures in development — muted, no external CTA */}
                    {IN_DEVELOPMENT.map((v) => (
                        <article
                            key={v.name}
                            className="reveal imk-muted"
                            data-testid={`venture-${v.name.toLowerCase()}`}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                                <div className="lg:col-span-5">
                                    <PlaceholderGlyph />
                                </div>

                                <div className="lg:col-span-7">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="venture-index">
                                            {v.num}
                                        </span>
                                        <span className="h-px flex-1 bg-white/10" />
                                    </div>

                                    <h3 className="font-display text-5xl lg:text-7xl font-bold text-neutral-500 tracking-tight leading-none">
                                        {v.name}
                                    </h3>
                                    <div className="mt-3 overline text-neutral-500">
                                        {v.subtitle}
                                    </div>

                                    <p className="mt-6 text-neutral-300 text-lg lg:text-xl font-light max-w-xl leading-snug">
                                        {v.description}
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {v.tags.map((t) => (
                                            <span
                                                key={t}
                                                className="venture-tag opacity-80"
                                                data-testid={`venture-tag-${v.name.toLowerCase()}-${t.toLowerCase().replace(/\s+/g, "-")}`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    {v.note && (
                                        <div
                                            className="mt-8 inline-flex items-center gap-3 text-neutral-500 text-[11px] font-mono uppercase tracking-[0.22em]"
                                            data-testid={`venture-${v.name.toLowerCase()}-note`}
                                        >
                                            <span className="h-px w-6 bg-white/15" aria-hidden="true" />
                                            {v.note}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function VentureGlyph({ accent }) {
    // Geometric abstract SVG unique to each venture

    // NowAgentAI — concentric voice waves + agent hub
    if (accent === "waves") {
        return (
            <div
                className="relative aspect-[4/3] w-full bg-[#0a0a0a] border border-white/10 overflow-hidden"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 400 300"
                    className="venture-glyph-svg absolute inset-0 w-full h-full"
                >
                    {/* concentric arcs — "voice waves" */}
                    {[40, 80, 120, 160, 200, 240].map((r) => (
                        <circle
                            key={r}
                            cx="120"
                            cy="150"
                            r={r}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                        />
                    ))}
                    <circle cx="120" cy="150" r="6" fill="#e60000" />
                    <circle
                        cx="120"
                        cy="150"
                        r="18"
                        fill="none"
                        stroke="#e60000"
                        strokeWidth="1"
                        opacity="0.4"
                    />
                    {/* right vertical grid */}
                    {[260, 290, 320, 350, 380].map((x) => (
                        <line
                            key={x}
                            x1={x}
                            y1="40"
                            x2={x}
                            y2="260"
                            stroke="rgba(255,255,255,0.06)"
                        />
                    ))}
                    <line x1="120" y1="150" x2="380" y2="90"
                        stroke="rgba(230,0,0,0.5)" />
                    <line x1="120" y1="150" x2="380" y2="210"
                        stroke="rgba(230,0,0,0.3)" />
                </svg>
                <div className="absolute bottom-4 left-4 overline">
                    Voice · Agent · Data
                </div>
            </div>
        );
    }

    // NowDealSheet — CRE deal-board: listing rows on the left,
    // stylised city skyline on the right, one highlighted "live" row.
    if (accent === "board") {
        const rows = [40, 65, 90, 115, 140, 165, 190, 215, 240];
        const highlightY = 115;
        // City skyline heights (right cluster)
        const buildings = [
            { x: 250, w: 22, h: 90 },
            { x: 275, w: 28, h: 130 },
            { x: 306, w: 18, h: 70 },
            { x: 327, w: 34, h: 155 },
            { x: 364, w: 22, h: 100 },
        ];
        return (
            <div
                className="relative aspect-[4/3] w-full bg-[#0a0a0a] border border-white/10 overflow-hidden"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 400 300"
                    className="venture-glyph-svg absolute inset-0 w-full h-full"
                >
                    {/* Listing rows — data-table feel */}
                    {rows.map((y) => (
                        <line
                            key={y}
                            x1="30"
                            y1={y}
                            x2="220"
                            y2={y}
                            stroke="rgba(255,255,255,0.08)"
                        />
                    ))}
                    {/* Row labels — short + long "cells" */}
                    {rows.map((y) => (
                        <g key={`c-${y}`}>
                            <rect x="30" y={y - 5} width="22" height="2"
                                fill="rgba(255,255,255,0.15)" />
                            <rect x="60" y={y - 5} width="110" height="2"
                                fill="rgba(255,255,255,0.06)" />
                            <rect x="180" y={y - 5} width="30" height="2"
                                fill="rgba(255,255,255,0.10)" />
                        </g>
                    ))}
                    {/* Highlighted live listing */}
                    <rect
                        x="26"
                        y={highlightY - 12}
                        width="198"
                        height="18"
                        fill="rgba(230,0,0,0.10)"
                        stroke="#e60000"
                    />
                    <circle
                        cx="20"
                        cy={highlightY - 3}
                        r="3"
                        fill="#e60000"
                    />
                    {/* Divider between rows + skyline */}
                    <line x1="235" y1="30" x2="235" y2="270"
                        stroke="rgba(255,255,255,0.08)" />
                    {/* Baseline for buildings */}
                    <line x1="240" y1="245" x2="390" y2="245"
                        stroke="rgba(255,255,255,0.14)" />
                    {/* Skyline */}
                    {buildings.map((b, i) => (
                        <rect
                            key={i}
                            x={b.x}
                            y={245 - b.h}
                            width={b.w}
                            height={b.h}
                            fill="none"
                            stroke="rgba(255,255,255,0.18)"
                        />
                    ))}
                    {/* Signal light on tallest building */}
                    <circle cx={327 + 34 / 2} cy={245 - 155 + 6} r="2.5"
                        fill="#e60000" />
                </svg>
                <div className="absolute bottom-4 left-4 overline">
                    Deals · NDA · Introduce
                </div>
            </div>
        );
    }

    // Fallback (defensive) — should not happen for current data set
    return (
        <div
            className="relative aspect-[4/3] w-full bg-[#0a0a0a] border border-white/10"
            aria-hidden="true"
        />
    );
}

function PlaceholderGlyph() {
    // Muted, exploratory — sparse dots suggesting possibilities being mapped
    return (
        <div
            className="relative aspect-[4/3] w-full bg-[#080808] border border-dashed border-white/10 overflow-hidden"
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 400 300"
                className="venture-glyph-svg absolute inset-0 w-full h-full"
            >
                {/* faint scan grid */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <line
                        key={`h${i}`}
                        x1="0"
                        y1={30 + i * 45}
                        x2="400"
                        y2={30 + i * 45}
                        stroke="rgba(255,255,255,0.04)"
                    />
                ))}
                {Array.from({ length: 9 }).map((_, i) => (
                    <line
                        key={`v${i}`}
                        x1={30 + i * 45}
                        y1="0"
                        x2={30 + i * 45}
                        y2="300"
                        stroke="rgba(255,255,255,0.04)"
                    />
                ))}
                {/* scattered exploratory dots */}
                {[
                    [80, 90],
                    [140, 210],
                    [230, 70],
                    [290, 180],
                    [340, 120],
                    [180, 150],
                ].map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2.5"
                        fill="rgba(180,180,180,0.5)"
                    />
                ))}
                {/* single red seed dot — the "opportunity being explored" */}
                <circle cx="215" cy="150" r="4" fill="#e60000" opacity="0.55" />
                <circle
                    cx="215"
                    cy="150"
                    r="14"
                    fill="none"
                    stroke="#e60000"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    opacity="0.5"
                />
            </svg>
            <div className="absolute bottom-4 left-4 overline text-neutral-500">
                Exploring · Applied AI
            </div>
        </div>
    );
}
