"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface LiquidCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "deep" | "frosted" | "neon";
    hoverEffect?: boolean;
}

export function LiquidCard({
    children,
    className,
    variant = "default",
    hoverEffect = true,
    ...props
}: LiquidCardProps) {

    const variants = {
        default: "glass-obsidian",
        deep: "glass-obsidian shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
        frosted: "glass-panel bg-void-900/30 border-void-800/50",
        neon: "glass-panel border-teal-500/30 shadow-glow bg-void-950/80"
    };

    return (
        <motion.div
            className={cn(
                "relative overflow-hidden transition-all duration-700 ease-in-out", // Heavy CSS transition
                variants[variant],
                hoverEffect && "hover:border-teal-500/30 hover:bg-void-900/80 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.1),_2px_0_0_rgba(255,0,0,0.2),_-2px_0_0_rgba(0,255,255,0.2)]", // Obsidian Hover + Chromatic Aberration
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }} // Heavy Gravity Motion
            {...props}
        >
            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
