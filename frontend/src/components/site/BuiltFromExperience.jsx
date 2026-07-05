import React from "react";
import {
    LineChart,
    Users,
    Globe2,
    FlaskConical,
    Target,
} from "lucide-react";

const PILLARS = [
    {
        icon: LineChart,
        title: "25+ years digital marketing",
        body: "Built and grown commercial engines across sectors, funnels and channels.",
    },
    {
        icon: Users,
        title: "Customer acquisition expertise",
        body: "Deep experience turning traffic and data into paying customers.",
    },
    {
        icon: Globe2,
        title: "International business experience",
        body: "Operated across markets, currencies and regulatory environments.",
    },
    {
        icon: FlaskConical,
        title: "AI tested in real commercial environments",
        body: "Ventures built and validated with live customers, not in a lab.",
    },
    {
        icon: Target,
        title: "Technology designed around business outcomes",
        body: "Every system is measured by revenue, retention and conversion.",
    },
];

export default function BuiltFromExperience() {
    return (
        <section
            id="experience"
            data-testid="built-from-experience-section"
            className="relative border-t border-white/10 py-24 lg:py-40"
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-end justify-between flex-wrap gap-6 mb-16 reveal">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="card-marker" />
                            <span className="overline">
                                02 // Trust
                            </span>
                        </div>
                        <h2
                            data-testid="experience-headline"
                            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[0.98]"
                        >
                            Built from
                            <br />
                            experience
                            <span className="text-[#e60000]">.</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-neutral-400 text-[15px] leading-relaxed">
                        Imkindo is not another AI startup. It is a team of
                        commercial operators applying artificial intelligence
                        to the challenges we have solved with people for over
                        two decades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/10">
                    {PILLARS.map((p, i) => {
                        const Icon = p.icon;
                        const isRightCol = (i + 1) % 3 === 0;
                        const isLastRow = i >= PILLARS.length - (PILLARS.length % 3 || 3);
                        return (
                            <div
                                key={p.title}
                                className={`p-8 lg:p-10 bg-[#0a0a0a] border-white/10 ${
                                    !isRightCol ? "lg:border-r" : ""
                                } ${
                                    !isLastRow ? "border-b lg:border-b" : ""
                                } md:border-b`}
                                data-testid={`experience-pillar-${i}`}
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={1.25}
                                    className="text-[#e60000] mb-6"
                                />
                                <h3 className="font-display text-xl lg:text-2xl font-bold text-white leading-snug tracking-tight">
                                    {p.title}
                                </h3>
                                <p className="mt-3 text-neutral-500 text-[14px] leading-relaxed">
                                    {p.body}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center reveal">
                    <div className="lg:col-span-8">
                        <p className="statement text-white text-2xl sm:text-3xl lg:text-4xl">
                            <span className="text-neutral-400 font-light">
                                Experienced business builders
                            </span>{" "}
                            <span className="font-semibold">
                                using AI to create the next generation of
                                intelligent companies.
                            </span>
                        </p>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="border-l border-white/10 pl-6">
                            <div className="overline mb-2">
                                Target sectors
                            </div>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Investors · Property · Hospitality · Business
                                owners · Strategic partners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
