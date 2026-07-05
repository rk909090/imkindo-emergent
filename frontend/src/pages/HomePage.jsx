import React from "react";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Positioning from "@/components/site/Positioning";
import ValueCreation from "@/components/site/ValueCreation";
import Ventures from "@/components/site/Ventures";
import BuiltFromExperience from "@/components/site/BuiltFromExperience";
import Partnerships from "@/components/site/Partnerships";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function HomePage() {
    return (
        <div
            data-testid="home-page"
            className="min-h-screen bg-[#050505] text-white"
        >
            <Header />
            <main>
                <Hero />
                <Positioning />
                <ValueCreation />
                <Ventures />
                <BuiltFromExperience />
                <Partnerships />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}
