"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FINMOM Liquid Void Splash Screen
 * 
 * Cinematographic boot sequence inspired by Apple Vision Pro.
 * The logo emerges from a liquid black void, then the screen
 * dissipates revealing the application underneath.
 * 
 * Shows only once per session (sessionStorage).
 */

const SESSION_KEY = "finmom_splash_shown";

export function SplashScreen({ children }: { children: React.ReactNode }) {
    const [phase, setPhase] = useState<"loading" | "logo" | "text" | "exit" | "done">("loading");
    const [skipSplash, setSkipSplash] = useState(false);

    useEffect(() => {
        // Only show once per browser session
        if (typeof window !== "undefined") {
            const shown = sessionStorage.getItem(SESSION_KEY);
            if (shown) {
                setSkipSplash(true);
                setPhase("done");
                return;
            }
        }

        // Phase timing: void → logo → text → exit
        const t1 = setTimeout(() => setPhase("logo"), 400);
        const t2 = setTimeout(() => setPhase("text"), 1600);
        const t3 = setTimeout(() => setPhase("exit"), 2800);
        const t4 = setTimeout(() => {
            setPhase("done");
            sessionStorage.setItem(SESSION_KEY, "1");
        }, 3600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    if (skipSplash) return <>{children}</>;

    return (
        <>
            {/* App content always renders underneath */}
            <div
                style={{
                    opacity: phase === "done" ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    pointerEvents: phase === "done" ? "auto" : "none",
                }}
            >
                {children}
            </div>

            {/* Splash Overlay */}
            <AnimatePresence>
                {phase !== "done" && (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
                        style={{ willChange: "opacity" }}
                    >
                        {/* Liquid Void Ripple Effects */}
                        <LiquidRipples phase={phase} />

                        {/* Central Logo Container */}
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            {/* Orbital Logo */}
                            <AnimatePresence>
                                {(phase === "logo" || phase === "text" || phase === "exit") && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.3, filter: "blur(20px)" }}
                                        animate={{
                                            opacity: phase === "exit" ? 0 : 1,
                                            scale: phase === "exit" ? 1.2 : 1,
                                            filter: phase === "exit" ? "blur(10px)" : "blur(0px)",
                                        }}
                                        transition={{
                                            duration: phase === "exit" ? 0.6 : 1.2,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="relative"
                                    >
                                        {/* Outer Glow Ring */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity: [0, 0.3, 0.15, 0.3],
                                                scale: [0.8, 1.15, 1.1, 1.15],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute inset-[-40%] rounded-full bg-white/[0.06] blur-3xl pointer-events-none"
                                        />

                                        {/* Inner Pulse */}
                                        <motion.div
                                            animate={{
                                                boxShadow: [
                                                    "0 0 0px rgba(255,255,255,0)",
                                                    "0 0 40px rgba(255,255,255,0.15)",
                                                    "0 0 0px rgba(255,255,255,0)",
                                                ],
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full flex items-center justify-center"
                                        >
                                            <img
                                                src="/logos/LOGO FINMOM APP.svg"
                                                alt="FINMOM"
                                                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                            />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Brand Text */}
                            <AnimatePresence>
                                {(phase === "text" || phase === "exit") && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: phase === "exit" ? 0 : 1,
                                            y: phase === "exit" ? -10 : 0,
                                        }}
                                        transition={{
                                            duration: phase === "exit" ? 0.4 : 0.8,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="flex flex-col items-center gap-3"
                                    >
                                        <motion.h1
                                            initial={{ letterSpacing: "0.05em" }}
                                            animate={{ letterSpacing: "0.25em" }}
                                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="text-white text-xl sm:text-2xl font-sans font-medium uppercase tracking-[0.25em]"
                                        >
                                            FINMOM
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.4 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-mono"
                                        >
                                            Financial Intelligence
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom Watermark */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: phase === "text" ? 0.2 : 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute bottom-8 sm:bottom-12 text-white/20 text-[9px] uppercase tracking-[0.5em] font-mono"
                        >
                            by Momentum
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/**
 * Liquid Void Ripple Effects
 * Concentric ripples that expand from center, creating the
 * "emerging from the void" illusion.
 */
function LiquidRipples({ phase }: { phase: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Ripple 1 - Innermost */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: phase === "exit" ? 0 : [0, 0.08, 0.03, 0.08],
                    scale: phase === "exit" ? 3 : [0, 1.5, 2, 2.5],
                }}
                transition={{
                    duration: phase === "exit" ? 0.8 : 4,
                    repeat: phase === "exit" ? 0 : Infinity,
                    ease: "easeOut",
                }}
                className="absolute w-[200px] h-[200px] rounded-full border border-white/[0.06]"
            />

            {/* Ripple 2 */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: phase === "exit" ? 0 : [0, 0.06, 0.02, 0.06],
                    scale: phase === "exit" ? 4 : [0, 2, 3, 3.5],
                }}
                transition={{
                    duration: phase === "exit" ? 0.8 : 5,
                    delay: 0.5,
                    repeat: phase === "exit" ? 0 : Infinity,
                    ease: "easeOut",
                }}
                className="absolute w-[200px] h-[200px] rounded-full border border-white/[0.04]"
            />

            {/* Ripple 3 - Outermost */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: phase === "exit" ? 0 : [0, 0.04, 0.01, 0.04],
                    scale: phase === "exit" ? 5 : [0, 2.5, 4, 5],
                }}
                transition={{
                    duration: phase === "exit" ? 0.8 : 6,
                    delay: 1,
                    repeat: phase === "exit" ? 0 : Infinity,
                    ease: "easeOut",
                }}
                className="absolute w-[200px] h-[200px] rounded-full border border-white/[0.03]"
            />

            {/* Ambient Void Particles */}
            {phase !== "exit" && (
                <>
                    {[...Array(6)].map((_, i) => {
                        // Deterministic positions to avoid SSR/CSR hydration mismatch
                        const angles = [0.2, 0.85, 1.4, 2.1, 2.7, 3.5];
                        const radii = [120, 90, 140, 100, 130, 110];
                        const durations = [3.5, 4.2, 3.8, 4.5, 3.2, 4.0];
                        const initX = Math.cos(angles[i]) * radii[i];
                        const initY = Math.sin(angles[i]) * radii[i];
                        const animX = Math.cos(angles[i] + 1) * (radii[i] * 0.4);
                        const animY = Math.sin(angles[i] + 1) * (radii[i] * 0.4);

                        return (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 0,
                                    x: initX,
                                    y: initY,
                                    scale: 0,
                                }}
                                animate={{
                                    opacity: [0, 0.3, 0],
                                    x: animX,
                                    y: animY,
                                    scale: [0, 1, 0.5],
                                }}
                                transition={{
                                    duration: durations[i],
                                    delay: 0.8 + i * 0.3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute w-1 h-1 rounded-full bg-white/30"
                            />
                        );
                    })}
                </>
            )}

            {/* Central Void Gradient */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: phase === "logo" || phase === "text" ? 0.15 : 0,
                    scale: phase === "exit" ? 3 : 1,
                }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full bg-radial-[circle] from-white/[0.08] via-white/[0.02] to-transparent blur-xl"
            />
        </div>
    );
}
