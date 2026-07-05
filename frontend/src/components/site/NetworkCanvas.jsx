import React, { useEffect, useRef } from "react";

/**
 * Lightweight canvas network animation.
 * - Grey nodes drift slowly, connected by thin lines when close.
 * - Exactly ONE red "intelligence" node with pulsing glow.
 */
export default function NetworkCanvas() {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        let w = 0;
        let h = 0;
        let nodes = [];
        let redNode = null;
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

            const density = Math.min(90, Math.floor((w * h) / 14000));
            nodes = new Array(density).fill(0).map(() => ({
                x: rand(0, w),
                y: rand(0, h),
                vx: rand(-0.15, 0.15),
                vy: rand(-0.15, 0.15),
                r: rand(0.6, 1.4),
            }));

            redNode = {
                x: w * 0.62,
                y: h * 0.42,
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
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;

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
                        ctx.strokeStyle = `rgba(255,255,255,${a * 0.08})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(m.x, m.y);
                        ctx.stroke();
                    }
                }

                ctx.fillStyle = "rgba(200,200,200,0.55)";
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // red intelligence node — connects to nearest 8 grey nodes
            if (redNode) {
                redNode.x += redNode.vx;
                redNode.y += redNode.vy;
                if (redNode.x < 40 || redNode.x > w - 40) redNode.vx *= -1;
                if (redNode.y < 40 || redNode.y > h - 40) redNode.vy *= -1;

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
