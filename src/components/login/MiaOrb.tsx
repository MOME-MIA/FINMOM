"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MiaOrbProps {
    size?: number;
    state?: "idle" | "thinking" | "success" | "error" | "speaking";
    className?: string;
}

// ─── Reactive Universe Particle System ───────────────────
const UniverseCanvas = ({ state, size }: { state: string; size: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // High DPI Support
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const center = size / 2;
        // Minimalist count (80 stars)
        const stars = Array.from({ length: 80 }, () => ({
            x: Math.random() * size,
            y: Math.random() * size,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.2 + 0.2, // Small, subtle
            alpha: Math.random() * 0.5 + 0.1,
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * (size / 2)
        }));

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.02;
            ctx.clearRect(0, 0, size, size);

            stars.forEach((star) => {
                // Base Physics based on State
                if (state === "thinking") {
                    // Vortex / Spiral: Swirl inwards
                    star.angle += 0.03;
                    star.dist -= 0.3;
                    if (star.dist < 2) {
                        star.dist = size / 2; // Respawn at edges
                        star.angle = Math.random() * Math.PI * 2;
                    }

                    const targetX = center + Math.cos(star.angle) * star.dist;
                    const targetY = center + Math.sin(star.angle) * star.dist;

                    // Smooth lerp to target
                    star.x += (targetX - star.x) * 0.15;
                    star.y += (targetY - star.y) * 0.15;

                } else if (state === "speaking") {
                    // Audio wave / Vibration: Faster drift + vertical sine wave
                    const wave = Math.sin(time * 15 + star.x * 0.05) * 1.5;
                    star.x += star.vx * 2;
                    star.y += (star.vy * 2) + wave;

                } else if (state === "success") {
                    // Nova Burst: Explode outwards fast
                    star.dist += 3;
                    star.x = center + Math.cos(star.angle) * star.dist;
                    star.y = center + Math.sin(star.angle) * star.dist;
                    // Respawn near center gradually
                    if (star.dist > size * 0.8) {
                        star.dist = Math.random() * 10;
                    }

                } else if (state === "error") {
                    // Glitch / Chaos: Jitter heavily horizontally
                    star.x += star.vx + (Math.random() - 0.5) * 8;
                    star.y += star.vy + (Math.random() - 0.5) * 2;

                } else {
                    // IDLE: Slow, elegant drift (dust in space)
                    star.x += star.vx;
                    star.y += star.vy;
                }

                // Wrap-around logic for non-radial states
                if (state === "idle" || state === "speaking" || state === "error") {
                    if (star.x < 0) star.x = size;
                    if (star.x > size) star.x = 0;
                    if (star.y < 0) star.y = size;
                    if (star.y > size) star.y = 0;

                    // Keep angular data synced for smooth transitions back to "thinking"
                    const dx = star.x - center;
                    const dy = star.y - center;
                    star.dist = Math.sqrt(dx * dx + dy * dy);
                    star.angle = Math.atan2(dy, dx);
                }

                // Draw Star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

                // Twinkling effect
                const twinkle = Math.sin(time * 3 + star.x) * 0.5 + 0.5;
                const currentAlpha = Math.max(0.1, star.alpha * twinkle);

                // State-reactive iridescent colors
                let hue = 220; // Default cool blue-white
                let sat = 10;
                if (state === 'thinking') {
                    hue = 200 + Math.sin(time * 2 + star.angle) * 60; // Cyan to teal shift
                    sat = 70;
                } else if (state === 'success') {
                    hue = 140 + Math.sin(time + star.x * 0.1) * 20; // Green spectrum
                    sat = 60;
                } else if (state === 'error') {
                    hue = 0 + Math.sin(time * 5) * 15; // Red flicker
                    sat = 80;
                } else if (state === 'speaking') {
                    hue = 40 + Math.sin(time * 1.5 + star.y * 0.05) * 20; // Warm amber-white
                    sat = 30;
                }
                ctx.fillStyle = `hsla(${hue}, ${sat}%, 85%, ${currentAlpha})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [state, size]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none rounded-full"
            style={{ width: size, height: size, mixBlendMode: 'screen' }}
        />
    );
};


/**
 * M.I.A. Alive Orb — Reactive Minimalist Universe Edition
 * An autonomous AI entity that breathes, tracks the user's cursor,
 * and features a living, state-reactive HTML5 Canvas universe within.
 */
export function MiaOrb({ size = 88, state = "idle", className }: MiaOrbProps) {
    const orbRef = useRef<HTMLDivElement>(null);

    // ─── Eye Tracking ──────────────────────────────────
    useEffect(() => {
        let animationFrameId: number;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (!orbRef.current) return;
            const rect = orbRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX);
            const maxDist = size * 0.08; // Proportional tracking distance
            const distance = Math.min(Math.hypot(deltaX, deltaY) / 25, maxDist);
            targetX = Math.cos(angle) * distance;
            targetY = Math.sin(angle) * distance;
        };

        const renderLoop = () => {
            if (orbRef.current) {
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
                orbRef.current.style.setProperty("--eye-x", `${currentX}px`);
                orbRef.current.style.setProperty("--eye-y", `${currentY}px`);
            }
            animationFrameId = requestAnimationFrame(renderLoop);
        };

        window.addEventListener("mousemove", handleMouseMove);
        renderLoop();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [size]);

    // ─── State-based colors ────────────────────────────
    const stateConfig = {
        idle: {
            glowColor: "rgba(255,255,255,0.08)",
            eyeColor: "#ffffff",
            eyeShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 30px rgba(100,150,255,0.4)",
        },
        thinking: {
            glowColor: "rgba(10,132,255,0.25)",
            eyeColor: "#ffffff",
            eyeShadow: "0 0 15px rgba(255,255,255,0.9), 0 0 40px rgba(10,132,255,0.8), 0 0 80px rgba(191,90,242,0.6)",
        },
        success: {
            glowColor: "rgba(48,209,88,0.2)",
            eyeColor: "#ffffff",
            eyeShadow: "0 0 15px rgba(255,255,255,0.9), 0 0 40px rgba(48,209,88,0.8), 0 0 70px rgba(48,209,88,0.5)",
        },
        error: {
            glowColor: "rgba(255,69,58,0.2)",
            eyeColor: "#ffffff",
            eyeShadow: "0 0 15px rgba(255,255,255,0.9), 0 0 40px rgba(255,69,58,0.8), 0 0 70px rgba(255,69,58,0.5)",
        },
        speaking: {
            glowColor: "rgba(255,255,255,0.15)",
            eyeColor: "#ffffff",
            eyeShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 35px rgba(255,255,255,0.6)",
        },
    };

    const config = stateConfig[state];

    // Proportional dimensions — scale cleanly even at small sizes
    // INCREASED for more presence and personality (per user request)
    const eyeWidth = Math.max(Math.floor(size * 0.16), 4);
    const eyeHeight = Math.max(Math.floor(size * 0.35), 8);
    const eyeGap = Math.max(Math.floor(size * 0.14), 4);

    return (
        <div
            ref={orbRef}
            className={cn("relative flex items-center justify-center shrink-0", className)}
            style={{ width: size, height: size }}
        >
            <style jsx>{`
                @keyframes mia-orb-breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                @keyframes mia-orb-blink {
                    0%, 92%, 96%, 100% { transform: scaleY(1); }
                    94% { transform: scaleY(0.05); }
                }
                @keyframes mia-orb-think {
                    0%, 100% { transform: scaleY(0.8) scaleX(1.1); }
                    50% { transform: scaleY(1.05) scaleX(0.95); }
                }
                @keyframes speak-wave {
                    0% { transform: scaleY(0.5); }
                    100% { transform: scaleY(1.4); }
                }
                .mia-orb-shell {
                    animation: mia-orb-breathe 4s ease-in-out infinite;
                }
                .deep-space-bg {
                    background: radial-gradient(circle at 60% 30%, rgba(30, 30, 45, 0.5) 0%, rgba(5, 5, 10, 1) 80%);
                }
                .glass-reflection {
                    box-shadow: 
                        inset 0 ${size * 0.15}px ${size * 0.25}px ${-size * 0.1}px rgba(255, 255, 255, 0.65),
                        inset 0 ${-size * 0.15}px ${size * 0.35}px ${-size * 0.1}px rgba(10, 132, 255, 0.5),
                        inset 0 0 ${size * 0.08}px rgba(255, 255, 255, 0.3),
                        0 0 ${size * 0.25}px rgba(0, 0, 0, 0.8);
                    background: radial-gradient(circle at 50% 10%, rgba(255,255,255,0.25) 0%, transparent 45%);
                }
                .mia-orb-eye-track {
                    transform: translate(var(--eye-x, 0px), var(--eye-y, 0px));
                    will-change: transform;
                }
                .mia-orb-eye {
                    border-radius: 9999px;
                    will-change: width, height, transform;
                    transition: all 0.5s cubic-bezier(0.87, 0, 0.13, 1);
                }
                .state-idle .mia-orb-eye {
                    animation: mia-orb-blink 5s infinite;
                }
                .state-thinking .mia-orb-eye {
                    animation: mia-orb-think 1s ease-in-out infinite;
                }
                .state-speaking .mia-orb-eye {
                    border-radius: 12px;
                    animation: speak-wave 0.3s ease-in-out infinite alternate;
                }
                .state-speaking .mia-orb-eye-track:nth-child(2) .mia-orb-eye {
                    animation-delay: 0.15s;
                }
                .state-success .mia-orb-eye {
                    transform: scaleY(1.1);
                }
                .state-error .mia-orb-eye {
                    transform: scaleY(0.7);
                    border-radius: 8px; /* Slightly squarer for error */
                }
            `}</style>

            {/* Main Orb Shell */}
            <div className="mia-orb-shell relative w-full h-full rounded-full border border-white/[0.1] overflow-hidden bg-[#050505]">

                {/* 1. Deep Space Gradient */}
                <div className="deep-space-bg absolute inset-0 rounded-full pointer-events-none" />

                {/* 2. Reactive Universe Canvas */}
                <UniverseCanvas state={state} size={size} />

                {/* 3. Eyes Container (placed centrally inside) */}
                <div className={`absolute inset-0 z-10 flex items-center justify-center state-${state}`} style={{ gap: eyeGap }}>
                    <div className="mia-orb-eye-track flex items-center justify-center">
                        <div
                            className="mia-orb-eye"
                            style={{
                                width: eyeWidth,
                                height: eyeHeight,
                                backgroundColor: config.eyeColor,
                                boxShadow: config.eyeShadow,
                            }}
                        />
                    </div>
                    <div className="mia-orb-eye-track flex items-center justify-center">
                        <div
                            className="mia-orb-eye"
                            style={{
                                width: eyeWidth,
                                height: eyeHeight,
                                backgroundColor: config.eyeColor,
                                boxShadow: config.eyeShadow,
                            }}
                        />
                    </div>
                </div>

                {/* 4. Glass Architectural Reflection overlay */}
                <div className="glass-reflection absolute inset-0 rounded-full pointer-events-none z-20 mix-blend-screen" />
            </div>
        </div>
    );
}
