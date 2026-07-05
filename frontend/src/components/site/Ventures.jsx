import React from "react";
import { ArrowUpRight } from "lucide-react";

const VENTURES = [
    {
        num: "V/01",
        name: "NowAgentAI",
        trademark: "™",
        tagline: "AI-powered customer engagement.",
        body: "Recover missed opportunities. Reconnect with customers. Turn conversations into revenue.",
        tags: ["AI Voice", "SMS", "Lead Recovery", "Follow-up Automation"],
        cta: "Visit NowAgentAI",
        href: "https://www.nowagentai.com",
        accent: "top",
        role: "Customer AI",
    },
    {
        num: "V/02",
        name: "NowMoveMe",
        trademark: "™",
        tagline: "The future of intelligent property discovery.",
        body: "Helping people make better property decisions through understanding, not endless searching.",
        tags: ["AI Property Search", "Customer Intent", "Intelligent Matching", "Trusted Guidance"],
        cta: "Visit NowMoveMe",
        href: "https://www.nowmoveme.co.uk/uk",
        accent: "bottom",
        role: "Property AI",
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
                        Two applied intelligence ventures, each engineered to
                        create tangible impact in industries with real
                        commercial gravity.
                    </p>
                </div>

                {/* Parent company structure diagram */}
                <div
                    data-testid="ventures-structure"
                    className="mb-24 lg:mb-28 border border-white/10 bg-[#0a0a0a] px-6 sm:px-10 py-10 lg:py-14 reveal"
                >
                    <div className="flex flex-col items-center text-center">
                        <span className="overline mb-3">Parent Company</span>
                        <div className="font-display text-3xl lg:text-5xl font-bold text-white tracking-tight leading-none">
                            IMKINDO<span className="text-[#e60000]">.</span>
                        </div>
                        <div className="mt-2 text-neutral-500 text-xs lg:text-sm font-mono uppercase tracking-[0.24em]">
                            Applied Intelligence Company
                        </div>

                        {/* vertical connector */}
                        <div className="my-8 h-10 w-px bg-white/15 relative">
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#e60000]" />
                        </div>

                        {/* horizontal branch */}
                        <div className="grid grid-cols-2 gap-6 sm:gap-16 lg:gap-32 relative w-full max-w-3xl">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-white/15" />
                            {[
                                {
                                    name: "NowAgentAI",
                                    role: "Customer AI",
                                },
                                {
                                    name: "NowMoveMe",
                                    role: "Property AI",
                                },
                            ].map((v) => (
                                <div
                                    key={v.name}
                                    className="flex flex-col items-center relative pt-8"
                                >
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-white/15" />
                                    <span className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#e60000]" />
                                    <div className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight mt-2">
                                        {v.name}
                                        <span className="text-[#e60000] text-xs align-super ml-0.5">
                                            ™
                                        </span>
                                    </div>
                                    <div className="mt-1 text-neutral-500 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em]">
                                        {v.role}
                                    </div>
                                </div>
                            ))}
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
                </div>
            </div>
        </section>
    );
}

function VentureGlyph({ accent }) {
    // Geometric abstract SVG unique to each venture
    if (accent === "top") {
        return (
            <div
                className="relative aspect-[4/3] w-full bg-[#0a0a0a] border border-white/10 overflow-hidden"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 400 300"
                    className="absolute inset-0 w-full h-full"
                >
                    {/* concentric arcs — "voice waves" */}
                    {[40, 80, 120, 160, 200, 240].map((r, i) => (
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
                    <line
                        x1="120"
                        y1="150"
                        x2="380"
                        y2="90"
                        stroke="rgba(230,0,0,0.5)"
                    />
                    <line
                        x1="120"
                        y1="150"
                        x2="380"
                        y2="210"
                        stroke="rgba(230,0,0,0.3)"
                    />
                </svg>
                <div className="absolute bottom-4 left-4 overline">
                    Voice · Agent · Data
                </div>
            </div>
        );
    }
    return (
        <div
            className="relative aspect-[4/3] w-full bg-[#0a0a0a] border border-white/10 overflow-hidden"
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 400 300"
                className="absolute inset-0 w-full h-full"
            >
                {/* grid of squares — property tiles */}
                {Array.from({ length: 6 }).map((_, i) =>
                    Array.from({ length: 8 }).map((_, j) => (
                        <rect
                            key={`${i}-${j}`}
                            x={30 + j * 45}
                            y={30 + i * 40}
                            width="34"
                            height="30"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                        />
                    ))
                )}
                {/* highlighted tile with red intent point */}
                <rect
                    x={30 + 4 * 45}
                    y={30 + 2 * 40}
                    width="34"
                    height="30"
                    fill="rgba(230,0,0,0.12)"
                    stroke="#e60000"
                />
                <circle cx={30 + 4 * 45 + 17} cy={30 + 2 * 40 + 15} r="4" fill="#e60000" />
                {/* trace path */}
                <path
                    d="M 60 250 Q 160 220 220 130 T 360 60"
                    fill="none"
                    stroke="rgba(230,0,0,0.5)"
                    strokeWidth="1.2"
                />
            </svg>
            <div className="absolute bottom-4 left-4 overline">
                Intent · Lifestyle · Match
            </div>
        </div>
    );
}
