import React from "react";
import { Compass, Hammer, Rocket } from "lucide-react";

const ITEMS = [
    {
        num: "01",
        title: "Discover",
        icon: Compass,
        body: "We identify industries, processes and opportunities where intelligent technology can create meaningful, measurable change.",
    },
    {
        num: "02",
        title: "Build",
        icon: Hammer,
        body: "We design and develop AI-powered platforms, intelligent workflows and applied research prototypes.",
    },
    {
        num: "03",
        title: "Scale",
        icon: Rocket,
        body: "We work with operators, partners and investors to bring innovation to market and grow it responsibly.",
    },
];

export default function ValueCreation() {
    const onMove = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    return (
        <section
            data-testid="value-creation-section"
            className="relative border-t border-white/10 py-24 lg:py-32"
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-end justify-between flex-wrap gap-6 mb-16 reveal">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="card-marker" />
                            <span className="overline">
                                02 // How We Create Value
                            </span>
                        </div>
                        <h2 className="font-display text-4xl lg:text-6xl font-bold text-white max-w-2xl tracking-tight">
                            Three disciplines.
                            <br />
                            One end-to-end model.
                        </h2>
                    </div>
                    <p className="max-w-md text-neutral-400 text-[15px] leading-relaxed">
                        Discover, build and scale — a disciplined system for
                        turning industry expertise into intelligent products
                        that make money and matter.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10">
                    {ITEMS.map((it, idx) => {
                        const Icon = it.icon;
                        return (
                            <div
                                key={it.num}
                                onMouseMove={onMove}
                                className={`grid-tile group reveal ${
                                    idx < ITEMS.length - 1
                                        ? "md:border-r md:border-white/10"
                                        : ""
                                }`}
                                style={{ animationDelay: `${idx * 0.08}s` }}
                                data-testid={`value-card-${it.title.toLowerCase()}`}
                            >
                                <div className="relative z-[1] flex flex-col gap-8 min-h-[280px]">
                                    <div className="flex items-center justify-between">
                                        <span className="venture-index">
                                            {it.num}
                                        </span>
                                        <Icon
                                            size={22}
                                            strokeWidth={1.25}
                                            className="text-neutral-500 group-hover:text-[#e60000] transition-colors"
                                        />
                                    </div>
                                    <h3 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight">
                                        {it.title}
                                        <span className="text-[#e60000]">
                                            .
                                        </span>
                                    </h3>
                                    <p className="text-neutral-400 leading-relaxed text-[15px] max-w-sm">
                                        {it.body}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
