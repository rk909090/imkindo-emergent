import React, { useEffect, useRef } from "react";
import { useTheme } from "@/theme/ThemeContext";

/**
 * Lightweight canvas network animation.
 * - Grey nodes drift slowly, connected by thin lines when close.
 * - Exactly ONE red "intelligence" node with pulsing glow.
 */
export default function NetworkCanvas() {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const { theme } = useTheme();
    const themeRef = useRef(theme);
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        let w = 0;
        let h = 0;
        let nodes = [];
        let redNode = null;
        let region = { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
        let redNodeBounds = { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
        let mouse = { x: -9999, y: -9999 };
        const LINK_DIST = 140;

        const rand = (a, b) => a + Math.random() * (b - a);

        const init = () => {
            const rect = canvas.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * DPR;
            canvas.height = h * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

            // The animation should only live in the top-right quadrant of the
            // hero — to the right of the headline text and above the stats row.
            // On stacked/mobile layouts (< 768px) there is no "right column",
            // so we fall back to the full canvas.
            const isNarrow = w < 768;
            region = isNarrow
                ? { xMin: 0, xMax: w, yMin: 0, yMax: h }
                : {
                      xMin: w * 0.5,
                      xMax: w * 0.98,
                      yMin: h * 0.05,
                      yMax: h * 0.72,
                  };
            const regionW = region.xMax - region.xMin;
            const regionH = region.yMax - region.yMin;

            const density = Math.min(70, Math.floor((regionW * regionH) / 14000));
            nodes = new Array(density).fill(0).map(() => ({
                x: rand(region.xMin, region.xMax),
                y: rand(region.yMin, region.yMax),
                vx: rand(-0.15, 0.15),
                vy: rand(-0.15, 0.15),
                r: rand(0.6, 1.4),
            }));

            // Red intelligence node roams inside the region, kept a little
            // away from the edges so its glow never gets clipped.
            const pad = 32;
            redNodeBounds = {
                xMin: region.xMin + pad,
                xMax: region.xMax - pad,
                yMin: region.yMin + pad,
                yMax: region.yMax - pad,
            };
            redNode = {
                x: region.xMin + regionW * 0.55,
                y: region.yMin + regionH * 0.55,
                vx: rand(-0.05, 0.05),
                vy: rand(-0.05, 0.05),
                r: 3.2,
                phase: 0,
            };
        };

        const step = () => {
            ctx.clearRect(0, 0, w, h);

            // draw grey nodes and links
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < region.xMin || n.x > region.xMax) {
                    n.vx *= -1;
                    n.x = Math.min(Math.max(n.x, region.xMin), region.xMax);
                }
                if (n.y < region.yMin || n.y > region.yMax) {
                    n.vy *= -1;
                    n.y = Math.min(Math.max(n.y, region.yMin), region.yMax);
                }

                // subtle mouse repulsion
                const mdx = n.x - mouse.x;
                const mdy = n.y - mouse.y;
                const md2 = mdx * mdx + mdy * mdy;
                if (md2 < 12000) {
                    const f = (12000 - md2) / 12000;
                    n.x += (mdx / Math.sqrt(md2 || 1)) * f * 0.6;
                    n.y += (mdy / Math.sqrt(md2 || 1)) * f * 0.6;
                }

                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const dx = n.x - m.x;
                    const dy = n.y - m.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < LINK_DIST * LINK_DIST) {
                        const a = 1 - Math.sqrt(d2) / LINK_DIST;
                        const linkAlpha = themeRef.current === "light" ? a * 0.08 : a * 0.08;
                        const linkColor = themeRef.current === "light" ? "0,0,0" : "255,255,255";
                        ctx.strokeStyle = `rgba(${linkColor},${linkAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(m.x, m.y);
                        ctx.stroke();
                    }
                }

                ctx.fillStyle =
                    themeRef.current === "light"
                        ? "rgba(120,120,120,0.35)"
                        : "rgba(200,200,200,0.55)";
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // red intelligence node — connects to nearest 8 grey nodes
            if (redNode) {
                redNode.x += redNode.vx;
                redNode.y += redNode.vy;
                if (redNode.x < redNodeBounds.xMin || redNode.x > redNodeBounds.xMax) {
                    redNode.vx *= -1;
                    redNode.x = Math.min(
                        Math.max(redNode.x, redNodeBounds.xMin),
                        redNodeBounds.xMax
                    );
                }
                if (redNode.y < redNodeBounds.yMin || redNode.y > redNodeBounds.yMax) {
                    redNode.vy *= -1;
                    redNode.y = Math.min(
                        Math.max(redNode.y, redNodeBounds.yMin),
                        redNodeBounds.yMax
                    );
                }

                const distances = nodes
                    .map((n, idx) => {
                        const dx = n.x - redNode.x;
                        const dy = n.y - redNode.y;
                        return { idx, d: Math.sqrt(dx * dx + dy * dy) };
                    })
                    .sort((a, b) => a.d - b.d)
                    .slice(0, 8);

                for (const { idx, d } of distances) {
                    const n = nodes[idx];
                    const a = Math.max(0, 1 - d / 260);
                    ctx.strokeStyle = `rgba(230,0,0,${a * 0.55})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(redNode.x, redNode.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                }

                redNode.phase += 0.03;
                const pulse = 3.2 + Math.sin(redNode.phase) * 0.6;

                // glow
                const glow = ctx.createRadialGradient(
                    redNode.x,
                    redNode.y,
                    0,
                    redNode.x,
                    redNode.y,
                    36
                );
                glow.addColorStop(0, "rgba(230,0,0,0.55)");
                glow.addColorStop(1, "rgba(230,0,0,0)");
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(redNode.x, redNode.y, 36, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#ff2020";
                ctx.beginPath();
                ctx.arc(redNode.x, redNode.y, pulse, 0, Math.PI * 2);
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(step);
        };

        const onMouse = (e) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        };
        const onLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };
        const onResize = () => {
            cancelAnimationFrame(rafRef.current);
            init();
            step();
        };

        init();
        step();
        window.addEventListener("resize", onResize);
        window.addEventListener("mousemove", onMouse);
        window.addEventListener("mouseleave", onLeave);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
