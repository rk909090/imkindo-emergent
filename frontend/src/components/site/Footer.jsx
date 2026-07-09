import React from "react";
import Logo from "@/components/site/Logo";

export default function Footer() {
    return (
        <footer
            data-testid="site-footer"
            className="relative border-t border-white/10 pt-20 pb-14"
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5">
                        <Logo size={44} />
                        <p className="mt-6 text-neutral-500 max-w-sm leading-relaxed text-sm">
                            Applied Intelligence. Building intelligent
                            solutions for industries ready for transformation.
                        </p>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="overline mb-4">Ventures</div>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://www.nowagentai.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-[#e60000] transition-colors text-sm"
                                    data-testid="footer-nowagentai-link"
                                >
                                    NowAgentAI™
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.nowmoveme.co.uk/uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-[#e60000] transition-colors text-sm"
                                    data-testid="footer-nowmoveme-link"
                                >
                                    NowMoveMe™
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="overline mb-4">Contact</div>
                        <a
                            href="mailto:mark@imkindo.com"
                            className="text-white hover:text-[#e60000] transition-colors text-sm block"
                            data-testid="footer-email-link"
                        >
                            mark@imkindo.com
                        </a>
                        <a
                            href="https://imkindo.com"
                            className="text-neutral-500 text-sm block mt-2"
                        >
                            imkindo.com
                        </a>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
                    <span data-testid="footer-copyright">
                        © {new Date().getFullYear()} Imkindo Ltd. All rights
                        reserved.
                    </span>
                    <span className="font-mono">
                        Applied Intelligence · NowAgentAI™ · NowMoveMe™
                    </span>
                </div>
            </div>
        </footer>
    );
}
