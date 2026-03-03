"use client";

import { motion } from "framer-motion";

interface FinmomLogoProps {
    className?: string;
    showText?: boolean;
    animate?: boolean;
}

export function FinmomLogo({ className = "w-12 h-12", showText = false, animate = true }: FinmomLogoProps) {
    const iconVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 0.5 }
            }
        }
    };

    const glowVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: [0.5, 1, 0.5],
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
            <div className="relative w-full aspect-square max-w-[120px]">
                {/* Glow Effect behind logo */}
                {animate && (
                    <motion.div
                        variants={glowVariants as any}
                        initial="hidden"
                        animate="visible"
                        className="absolute inset-[-20%] bg-blue-500/20 blur-2xl rounded-full pointer-events-none"
                    />
                )}

                {/* SVG Logo */}
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                    <motion.path
                        d="M20 80 V30 L50 60 L80 30 V80"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={(animate ? iconVariants : {}) as any}
                        initial={animate ? "hidden" : "visible"}
                        animate="visible"
                    />
                    {/* Inner detail lines for 'high-tech' feel */}
                    <motion.path
                        d="M35 55 V35 M65 55 V35"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={(animate ? iconVariants : {}) as any}
                        initial={animate ? "hidden" : "visible"}
                        animate="visible"
                        transition={{ delay: 0.5 }}
                    />
                </svg>
            </div>

            {showText && (
                <motion.div
                    initial={animate ? { opacity: 0, y: 10, letterSpacing: "0.1em" } : { opacity: 1, y: 0, letterSpacing: "0.3em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-white text-xl font-mono tracking-[0.3em] font-light">
                        MOMENTUM<span className="font-bold">OS</span>
                    </h1>
                </motion.div>
            )}
        </div>
    );
}
