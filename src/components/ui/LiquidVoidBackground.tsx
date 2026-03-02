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

            {/* 3. Parallax Orbs (The Energy) */}
            {/* Orb 1: Electric Sabbath (Violet) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20 * durationMultiplier,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    x: x1,
                    y: y1,
                    opacity: isDashboard ? 0.03 : 0.3
                }}
                className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-600 blur-[120px] mix-blend-screen"
            />

            {/* Orb 2: Toxic Lime (Green) */}
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 25 * durationMultiplier,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    x: x2,
                    y: y2,
                    opacity: isDashboard ? 0.02 : 0.25
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-lime-500 blur-[120px] mix-blend-screen"
            />

            {/* Orb 3: Amber Ventures (Orange/Amber) */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: isDashboard ? [0.02, 0.03, 0.02] : [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 15 * durationMultiplier,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-amber-500 blur-[120px] mix-blend-screen"
            />
        </div>
    );
}
