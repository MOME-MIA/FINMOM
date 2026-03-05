"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Atmosphere } from "./Atmosphere";
import { useEffect } from "react";

interface LiquidVoidBackgroundProps {
    variant?: "login" | "dashboard";
}

export function LiquidVoidBackground({ variant = "login" }: LiquidVoidBackgroundProps) {
    const { isSolidMode } = useTheme();
    const isDashboard = variant === "dashboard";

    // Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 50, stiffness: 400 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    // Reduced Parallax Range (2% instead of 5%)
    const x1 = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);
    const y1 = useTransform(mouseYSpring, [-0.5, 0.5], ["-2%", "2%"]);

    const x2 = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
    const y2 = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const xPct = e.clientX / innerWidth - 0.5;
            const yPct = e.clientY / innerHeight - 0.5;
            mouseX.set(xPct);
            mouseY.set(yPct);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Solid Metal Mode: Return null to disable animations (Static background in layout.tsx takes over)
    if (isSolidMode) return null;

    // Tuned Opacity:
    // Dashboard: 3-5% opacity (Subtle)
    // Login: 30-40% opacity (Balanced, down from 60%)
    const opacity = isDashboard ? 0.05 : 0.35;
    const durationMultiplier = isDashboard ? 2 : 1; // Slower on dashboard

    return (
        <div className={cn("fixed inset-0 w-full h-full overflow-hidden", isDashboard ? "z-[-50]" : "z-0")}>
            {/* 1. Unified Atmosphere (Base + Grain + Vignette) */}
            <Atmosphere />

            {/* 2. The Grid (Perspective Floor) - Reduced Opacity */}
            <div className="absolute inset-0 perspective-[1000px] pointer-events-none opacity-[0.02]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_scale(2)] origin-bottom" />
            </div>

            {/* 3. Parallax Orbs (The Energy) - Refined Premium Apple Aesthetic */}
            {/* Orb 1: Deep Indigo (Professional & Trust) */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: isDashboard ? [0.03, 0.05, 0.03] : [0.15, 0.25, 0.15],
                }}
                transition={{
                    duration: 40 * durationMultiplier,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    x: x1,
                    y: y1,
                }}
                className="absolute top-[-15%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/40 blur-[180px] mix-blend-screen"
            />

            {/* Orb 2: Subtle Cyan/Teal (Wealth & Growth) */}
            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    opacity: isDashboard ? [0.02, 0.04, 0.02] : [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 50 * durationMultiplier,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    x: x2,
                    y: y2,
                }}
                className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-cyan-900/30 blur-[160px] mix-blend-screen"
            />

            {/* Orb 3: Dark Slate/Violet (Depth & Sophistication) */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: isDashboard ? [0.01, 0.03, 0.01] : [0.08, 0.15, 0.08],
                }}
                transition={{
                    duration: 45 * durationMultiplier,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[20%] left-[30%] w-[60vw] h-[60vw] rounded-full bg-slate-800/50 blur-[200px] mix-blend-screen"
            />
        </div>
    );
}
