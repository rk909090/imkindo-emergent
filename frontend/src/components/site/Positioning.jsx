import React from "react";

export default function Positioning() {
    return (
        <section
            id="about"
            data-testid="positioning-section"
            className="relative border-t border-white/10 py-24 lg:py-40"
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-center gap-3 mb-16 reveal">
                    <span className="card-marker" />
                    <span className="overline">01 // Positioning</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
                    <h2
                        data-testid="positioning-headline"
                        className="statement text-white text-4xl sm:text-5xl lg:text-7xl xl:text-[84px] col-span-1 lg:col-span-8 reveal"
                    >
                        <strong>Human insight.</strong>
                        <br />
                        <span className="accent">Artificial intelligence.</span>
                        <br />
                        <strong>Real-world impact.</strong>
                    </h2>

                    <div className="lg:col-span-4 lg:pt-6 space-y-6 reveal">
                        <p className="text-neutral-400 leading-relaxed text-base lg:text-[17px]">
                            Technology alone does not create transformation.
                            Understanding people, industries and opportunities
                            does.
                        </p>
                        <p className="text-neutral-400 leading-relaxed text-base lg:text-[17px]">
                            With over 25 years of experience in customer
                            acquisition, marketing, sales and business growth,
                            Imkindo bridges the gap between business challenges
                            and intelligent AI solutions.
                        </p>
                        <p className="text-white leading-relaxed text-base lg:text-[17px] pt-2">
                            We don&apos;t build AI because it is possible.
                            <br />
                            <span className="text-[#e60000]">
                                We build AI where it creates value.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
