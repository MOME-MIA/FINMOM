"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, useMotionValue, useTransform, animate, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface LiquidButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "danger" | "neon" | "glass";
    size?: "sm" | "md" | "lg" | "icon";
    holdDuration?: number; // Time in ms to hold
    onHoldComplete?: () => void;
    isLoading?: boolean;
}

export interface LiquidButtonRef {
    reset: () => void;
}

export const LiquidButton = React.forwardRef<LiquidButtonRef, LiquidButtonProps>(({
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled,
    holdDuration = 0,
    onHoldComplete,
    onClick,
    ...props
}, ref) => {
    const [isHolding, setIsHolding] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Expose reset method
    React.useImperativeHandle(ref, () => ({
        reset: () => {
            setIsHolding(false);
            setIsCompleted(false);
            charge.set(0);
        }
    }));

    // Motion Values for Physics-based interaction
    const charge = useMotionValue(0);
    const controls = useAnimation();

    // Golden Ratio Transforms
    // Shake intensity increases exponentially with charge
    const shakeX = useTransform(charge, [0, 0.5, 1], [0, 1, 3]);
    const shakeY = useTransform(charge, [0, 0.5, 1], [0, 1, 3]);

    // Glow intensity
    const glowOpacity = useTransform(charge, [0, 1], [0, 0.8]);
    const glowScale = useTransform(charge, [0, 1], [0.8, 1.2]);

    // Fill effect
    const fillHeight = useTransform(charge, [0, 1], ["0%", "100%"]);

    const variants = {
        primary: "bg-white text-black shadow-[0_4px_16px_rgba(255,255,255,0.2)] hover:bg-white/90 border-transparent",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
        ghost: "bg-transparent text-white/50 hover:text-white hover:bg-white/10 border-transparent",
        danger: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300",
        neon: "bg-[#111111]/80 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/40", // Deprecated neon, switched to bright glass
        glass: "bg-white/5 backdrop-blur-[48px] border border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-[24px]"
    };

    // Golden Ratio Sizing (Phi ≈ 1.618)
    // We prioritize height and let width/padding follow Phi where possible or use standard tailwind classes that feel right.
    const sizes = {
        sm: "h-8 px-[13px] text-xs rounded-lg", // 8 * 1.618 ≈ 13
        md: "h-12 px-[20px] text-sm rounded-xl", // Increased for mobile touch target
        lg: "h-[64px] px-[40px] text-base rounded-[24px]", // Custom for Login
        icon: "h-12 w-12 p-0 flex items-center justify-center rounded-xl"
    };

    useEffect(() => {
        if (isHolding && holdDuration > 0 && !isCompleted && !disabled && !isLoading) {
            // Start Charging
            const animation = animate(charge, 1, {
                duration: holdDuration / 1000,
                ease: "linear", // Linear charge for predictability
                onComplete: () => {
                    setIsCompleted(true);
                    if (onHoldComplete) onHoldComplete();
                }
            });
            return () => animation.stop();
        } else if (!isHolding && !isCompleted) {
            // Rapid Discharge
            animate(charge, 0, {
                duration: 0.3,
                ease: "circOut"
            });
        }
    }, [isHolding, holdDuration, isCompleted, disabled, isLoading, onHoldComplete, charge]);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (disabled || isLoading || holdDuration === 0 || isCompleted) return;
        setIsHolding(true);
    };

    const handleMouseUp = () => {
        if (holdDuration === 0 || isCompleted) return;
        setIsHolding(false);
    };

    return (
        <motion.button
            className={cn(
                "relative inline-flex items-center justify-center font-bold tracking-widest uppercase transition-colors duration-500 border overflow-hidden group select-none",
                variants[variant],
                sizes[size],
                className
            )}
            style={{
                x: isHolding ? (Math.random() - 0.5) * charge.get() * 4 : 0, // Manual shake trigger in render for chaos
                y: isHolding ? (Math.random() - 0.5) * charge.get() * 4 : 0,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={disabled || isLoading}
            onClick={(e) => {
                if (holdDuration > 0) {
                    e.preventDefault();
                    return;
                }
                if (onClick) onClick(e);
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            {...props}
        >
            {/* 1. Background Fill (The Energy) */}
            {holdDuration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-lime-400/40 z-0 border-t border-lime-400/80 shadow-[0_-4px_20px_rgba(163,230,53,0.5)]"
                    style={{ height: fillHeight }}
                />
            )}

            {/* 2. Core Glow (Pulsing Center) */}
            {holdDuration > 0 && (
                <motion.div
                    className="absolute inset-0 z-0 rounded-[inherit]"
                    style={{
                        opacity: glowOpacity,
                        scale: glowScale,
                        boxShadow: "inset 0 0 40px 0px rgba(163, 230, 53, 0.6)"
                    }}
                />
            )}

            {/* 3. Scanline / Tech Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0 mix-blend-overlay" />

            {/* 4. Content */}
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin relative z-10 text-current" />
            ) : (
                <motion.span
                    className="relative z-10 flex items-center gap-3"
                    animate={{
                        color: isHolding ? "#ffffff" : "currentColor",
                        textShadow: isHolding ? "0 0 10px rgba(255,255,255,0.5)" : "none"
                    }}
                >
                    {children}
                    {holdDuration > 0 && isHolding && !isCompleted && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-lime-400"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                        </motion.span>
                    )}
                </motion.span>
            )}

            {/* 5. Success Ripple (Optional, handled by parent usually but good to have internal feedback) */}
            {isCompleted && (
                <motion.div
                    className="absolute inset-0 bg-lime-400 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.button>
    );
});

LiquidButton.displayName = "LiquidButton";
