import React from "react";
import { ArrowUpRight } from "lucide-react";

const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Partnerships() {
    return (
        <section
            id="partnerships"
            data-testid="partnerships-section"
            className="relative border-t border-white/10 py-24 lg:py-40 overflow-hidden"
        >
            {/* Background image with heavy overlay */}
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage:
                        "url('https://images.pexels.com/photos/18272053/pexels-photo-18272053.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(1) contrast(1.15)",
                }}
                aria-hidden="true"
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, #050505 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.9) 60%, #050505 100%)",
                }}
                aria-hidden="true"
            />

            <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-center gap-3 mb-12 reveal">
                    <span className="card-marker" />
                    <span className="overline">
                        05 // AI Innovation & Partnerships
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
                    <h2 className="lg:col-span-8 font-display text-4xl sm:text-5xl lg:text-[76px] font-bold text-white tracking-tight leading-[0.98] reveal">
                        Have an opportunity
                        <br />
                        where AI could
                        <br />
                        <span className="text-neutral-400 font-light">
                            create value
                        </span>
                        <span className="text-[#e60000]">?</span>
                    </h2>

                    <div className="lg:col-span-4 space-y-6 reveal">
                        <p className="text-neutral-400 leading-relaxed text-[15px]">
                            The greatest AI opportunities will come from
                            combining deep industry expertise with intelligent
                            technology.
                        </p>
                        <p className="text-neutral-400 leading-relaxed text-[15px]">
                            Imkindo collaborates with forward-thinking
                            businesses, innovators and strategic partners to
                            identify opportunities where artificial
                            intelligence can solve meaningful challenges.
                        </p>
                        <a
                            href="#contact"
                            onClick={scrollTo("#contact")}
                            className="imk-btn imk-btn-primary mt-4"
                            data-testid="partnerships-cta-button"
                        >
                            Start a Conversation
                            <ArrowUpRight size={18} strokeWidth={1.5} />
                        </a>
                    </div>
                </div>

                <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 border border-white/10">
                    {[
                        { k: "Investors", v: "VC · Family Office · Private" },
                        { k: "Enterprise", v: "SME · Corporate · Group" },
                        { k: "Industries", v: "Property · Hospitality · Travel" },
                        { k: "Technology", v: "AI Voice · Data · Platforms" },
                    ].map((it, i) => (
                        <div
                            key={it.k}
                            className={`p-6 lg:p-8 ${
                                i < 3 ? "lg:border-r border-white/10" : ""
                            } ${i < 2 ? "border-b lg:border-b-0 border-white/10" : ""} ${
                                i === 2 ? "border-r border-white/10 lg:border-r" : ""
                            }`}
                        >
                            <div className="overline mb-3">{it.k}</div>
                            <div className="text-white text-sm lg:text-base leading-relaxed">
                                {it.v}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
