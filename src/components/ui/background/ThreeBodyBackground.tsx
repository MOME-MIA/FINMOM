"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThreeBodyBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax Spring
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX / innerWidth - 0.5);
        mouseY.set(clientY / innerHeight - 0.5);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-black z-[-1]">
            {/* Deep Space Void */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a2e_0%,_#000000_100%)] opacity-80" />

            {/* Starfield (Static + Twinkle) */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay" />

            {/* Chaotic Suns (The Three Bodies) */}

            {/* Body 1: Teal Sun (Massive, Slow) */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-900/20 blur-[100px]"
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.2, 0.9, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                style={{ x: useTransform(springX, (val) => val * 50), y: useTransform(springY, (val) => val * 50) }}
            />

            {/* Body 2: Lime Planet (Agile, Elliptical) */}
            <motion.div
                className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-lime-900/20 blur-[80px]"
                animate={{
                    x: [0, -150, 50, 0],
                    y: [0, 100, -100, 0],
                    scale: [1, 0.8, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{ x: useTransform(springX, (val) => val * -80), y: useTransform(springY, (val) => val * -80) }}
            />

            {/* Body 3: Amber Comet (Fast, Erratic) */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full bg-amber-900/20 blur-[60px]"
                animate={{
                    x: [0, 200, -200, 0],
                    y: [0, -150, 150, 0],
                    scale: [1, 1.5, 0.5, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{ x: useTransform(springX, (val) => val * 120), y: useTransform(springY, (val) => val * 120) }}
            />

            {/* Gravitational Lensing Grid (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

        </div>
    );
}
