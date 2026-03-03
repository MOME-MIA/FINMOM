"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export type LogoVariant = "default" | "pulse" | "glitch" | "fluid" | "typing";

interface FinmomLogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    variant?: LogoVariant;
}

const glitchVariants: Variants = {
    hidden: { opacity: 1, x: 0 },
    visible: {
        x: [-2, 2, -2, 2, 0],
        y: [-1, 1, -1, 1, 0],
        filter: [
            "hue-rotate(0deg)",
            "hue-rotate(90deg) contrast(1.5)",
            "hue-rotate(-90deg) contrast(1.5)",
            "hue-rotate(0deg)"
        ],
        transition: {
            duration: 0.4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear"
        }
    }
};

const pulseVariants: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.05,
        filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
        transition: {
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse"
        }
    }
};

const fluidVariants: Variants = {
    initial: { color: "#8B5CF6" }, // Violet
    fluid: {
        color: ["#8B5CF6", "#A3E635", "#F59E0B", "#8B5CF6"], // Violet -> Lime -> Amber -> Violet
        transition: {
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            times: [0, 0.33, 0.66, 1]
        }
    }
};

const typingVariants: Variants = {
    initial: { scale: 1, filter: "brightness(1)" },
    typing: {
        scale: [1, 1.1, 1],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
        transition: {
            duration: 0.15,
            ease: "easeOut"
        }
    }
};

export function FinmomLogo({ className, variant = "default", ...props }: FinmomLogoProps) {
    const isGlitch = variant === "glitch";
    const isPulse = variant === "pulse";
    const isTyping = variant === "typing";

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 666 253.17"
            className={cn("fill-current", className)}
            initial="initial"
            animate={isGlitch ? "visible" : variant === "fluid" ? "fluid" : isTyping ? "typing" : "initial"}
            whileHover={isPulse ? "hover" : undefined}
            variants={
                isGlitch ? glitchVariants :
                    variant === "fluid" ? fluidVariants :
                        isTyping ? typingVariants :
                            pulseVariants
            }
            {...props as any}
        >
            <path d="M4.23,105.07l77.83-29.68c3.29-1.26,2.6-6.1-.91-6.39L3.04,62.63c-1.72-.14-3.04-1.57-3.04-3.3V3.31C0,1.36,1.67-.16,3.61.01l203.39,18.6c1.7.16,3.01,1.58,3.01,3.29v54.74c0,1.35-.82,2.57-2.08,3.07l-109.63,43.8c-2.77,1.11-2.77,5.04,0,6.15l109.63,43.8c1.26.5,2.08,1.72,2.08,3.07v54.74c0,1.71-1.3,3.14-3.01,3.29L3.61,253.16c-1.94.18-3.61-1.35-3.61-3.29v-56.03c0-1.72,1.32-3.16,3.04-3.3l78.11-6.37c3.51-.29,4.2-5.13.91-6.39L4.23,148.1c-1.28-.49-2.13-1.72-2.13-3.09v-36.84c0-1.37.85-2.6,2.13-3.09Z" />
            <path d="M219.6,126.59c0-58.5,42.6-108.3,113.4-108.3s113.4,49.8,113.4,108.3-42.6,108.3-113.4,108.3-113.4-49.8-113.4-108.3ZM383.4,126.59c0-29.4-18.3-54.3-50.4-54.3s-50.4,24.9-50.4,54.3,18.3,54.3,50.4,54.3,50.4-24.9,50.4-54.3Z" />
            <path d="M661.77,148.1l-77.83,29.69c-3.29,1.26-2.6,6.1.91,6.39l78.11,6.37c1.72.14,3.04,1.57,3.04,3.3v56.03c0,1.95-1.67,3.47-3.61,3.29l-203.39-18.6c-1.7-.16-3.01-1.58-3.01-3.29v-54.74c0-1.35.82-2.57,2.08-3.07l109.63-43.8c2.77-1.11,2.77-5.04,0-6.15l-109.63-43.8c-1.26-.5-2.08-1.72-2.08-3.07V21.9c0-1.71,1.3-3.14,3.01-3.29L662.39.01c1.94-.18,3.61,1.35,3.61,3.29v56.03c0,1.72-1.32,3.16-3.04,3.3l-78.11,6.37c-3.51.29-4.2,5.13-.91,6.39l77.83,29.68c1.28.49,2.13,1.72,2.13,3.09v36.84c0,1.37-.85,2.6-2.13,3.09Z" />
        </motion.svg>
    );
}
