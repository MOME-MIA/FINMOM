"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface FinmomLogoProps {
    className?: string;
    showText?: boolean;
    animate?: boolean;
}

export function FinmomLogo({ className = "w-12 h-12", showText = false, animate = true }: FinmomLogoProps) {
    const glowVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: [0.5, 0.8, 0.5],
            scale: [0.95, 1.05, 0.95],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Glow Effect behind logo */}
                {animate && (
                    <motion.div
                        variants={glowVariants as any}
                        initial="hidden"
                        animate="visible"
                        className="absolute inset-[-20%] bg-white/10 blur-2xl rounded-full pointer-events-none"
                    />
                )}

                {/* Spiral Logo - Requiere public/logo.png */}
                <div className="relative w-full h-full z-10 flex items-center justify-center">
                    <img
                        src="/logo.svg"
                        alt="Finmom Vortex Logo"
                        className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    />
                </div>
            </div>

            {showText && (
                <motion.div
                    initial={animate ? { opacity: 0, y: 10, letterSpacing: "0.1em" } : { opacity: 1, y: 0, letterSpacing: "0.2em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-white text-xl font-sans tracking-[0.2em] font-medium uppercase">
                        Finmom
                    </h1>
                </motion.div>
            )}
        </div>
    );
}
