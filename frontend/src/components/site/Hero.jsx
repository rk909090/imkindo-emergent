import React from "react";
import NetworkCanvas from "@/components/site/NetworkCanvas";
import { ArrowUpRight } from "lucide-react";

const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Hero() {
    return (
        <section
            id="top"
            data-testid="hero-section"
            className="relative min-h-[100svh] flex items-end overflow-hidden pt-24 lg:pt-20 2xl:pt-28 pb-8 lg:pb-8 2xl:pb-14"
        >
            <NetworkCanvas />
            {/* Vignette overlay (dark mode only) */}
            <div
                className="hero-vignette absolute inset-0 z-[1] pointer-events-none"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(80% 60% at 50% 40%, transparent 0%, rgba(5,5,5,0.65) 70%, #050505 100%)",
                }}
            />

            <div className="relative z-[2] w-full max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="max-w-5xl">
                    <div className="flex items-center gap-3 mb-6 lg:mb-4 2xl:mb-6 fade-up">
                        <span className="red-pulse" aria-hidden="true" />
                        <span className="overline">
                            Imkindo // Applied Intelligence
                        </span>
                    </div>

                    <h1
                        data-testid="hero-headline"
                        className="hero-headline text-white text-[42px] sm:text-6xl lg:text-[64px] xl:text-[68px] 2xl:text-[92px] fade-up fade-up-delay-1"
                    >
                        Where decades of
                        <br />
                        human insight meet
                        <br />
                        <em>artificial intelligence.</em>
                    </h1>

                    <p
                        data-testid="hero-subheadline"
                        className="mt-5 lg:mt-5 2xl:mt-8 max-w-2xl text-[15px] sm:text-base lg:text-[15px] 2xl:text-lg leading-relaxed text-neutral-400 fade-up fade-up-delay-2"
                    >
                        For over 25 years we&apos;ve helped businesses create
                        opportunities, improve customer journeys and drive
                        commercial growth. Today, we combine that experience
                        with artificial intelligence to build practical
                        solutions that solve real-world challenges.
                    </p>

                    <div className="mt-6 lg:mt-6 2xl:mt-10 flex flex-wrap items-center gap-4 fade-up fade-up-delay-3">
                        <a
                            href="#ventures"
                            onClick={scrollTo("#ventures")}
                            className="imk-btn imk-btn-primary"
                            data-testid="hero-explore-ventures-button"
                        >
                            Explore Ventures
                            <ArrowUpRight size={18} strokeWidth={1.5} />
                        </a>
                        <a
                            href="#contact"
                            onClick={scrollTo("#contact")}
                            className="imk-btn imk-btn-secondary"
                            data-testid="hero-start-conversation-button"
                        >
                            Start a Conversation
                        </a>
                    </div>

                    <div className="mt-8 lg:mt-8 2xl:mt-14 flex items-start justify-between gap-6 fade-up fade-up-delay-4">
                        <div className="flex flex-col gap-2 max-w-[260px]">
                            <span className="overline">Est. Experience</span>
                            <span className="font-display text-3xl lg:text-4xl text-white">
                                25<span className="text-[#e60000]">+</span>{" "}
                                years
                            </span>
                            <span className="text-xs text-neutral-500 leading-relaxed">
                                Marketing, customer acquisition, sales & growth.
                            </span>
                        </div>
                        <div className="hidden sm:flex flex-col gap-2 max-w-[260px]">
                            <span className="overline">Ventures Live</span>
                            <span className="font-display text-3xl lg:text-4xl text-white">
                                02
                            </span>
                            <span className="text-xs text-neutral-500 leading-relaxed">
                                NowAgentAI™ · NowDealSheet™
                            </span>
                        </div>
                        <div className="hidden lg:flex flex-col gap-2 max-w-[260px]">
                            <span className="overline">Outcome</span>
                            <span className="font-display text-3xl lg:text-4xl text-white">
                                Commercial
                            </span>
                            <span className="text-xs text-neutral-500 leading-relaxed">
                                Impact — AI applied where it creates value.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
