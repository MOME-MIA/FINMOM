"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid/LiquidButton";

interface SingularityButtonProps extends Omit<React.ComponentProps<typeof LiquidButton>, "children"> {
    isUnlocked: boolean;
    isLoading: boolean;
    onAuthenticate: () => void;
    children?: React.ReactNode;
    customIdleText?: string;
    customSuccessText?: string;
}

export function SingularityButton({
    isUnlocked,
    isLoading,
    onAuthenticate,
    className,
    disabled,
    customIdleText = "Continuar",
    customSuccessText = "Verificado",
    ...props
}: SingularityButtonProps) {
    return (
        <div className={cn("relative w-full h-[56px] group", className)}>
            {/* Ambient Background Glow */}
            <div className={cn(
                "absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none",
                isUnlocked ? "bg-[#30D158]/40" : "bg-white/20"
            )} />

            <button
                {...props as any}
                onClick={onAuthenticate}
                disabled={disabled || isLoading || isUnlocked}
                className={cn(
                    "relative overflow-hidden w-full h-full rounded-full flex items-center justify-center",
                    "transition-all duration-500 ease-[0.16,1,0.3,1] outline-none",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                    isUnlocked
                        ? "bg-[#30D158] text-white shadow-[0_0_40px_rgba(48,209,88,0.4)] scale-[1.02] border border-[#30D158]"
                        : "bg-gradient-to-r from-[#0A84FF] to-[#0A64FF] text-white shadow-[0_8px_30px_rgba(10,132,255,0.25)] hover:shadow-[0_8px_40px_rgba(10,132,255,0.5)] hover:scale-[1.02] border border-white/10"
                )}
            >
                {/* Magnetic Hover Effect Background inside button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none opacity-50" />

                <div className="relative z-10 flex items-center justify-center gap-3 w-full pointer-events-none">
                    <AnimatePresence mode="wait">
                        {isUnlocked ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="font-semibold tracking-[0.1em] uppercase text-[13px] flex items-center gap-2"
                            >
                                <span>{customSuccessText}</span>
                            </motion.div>
                        ) : isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2 font-semibold tracking-[0.1em] uppercase text-[13px] text-white"
                            >
                                <Loader2 className="w-4 h-4 text-black/70 animate-[spin_1s_linear_infinite]" />
                                <span>Validando</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-2 font-bold tracking-[0.15em] uppercase text-[13px] text-white transition-colors duration-300"
                            >
                                <span>{customIdleText}</span>
                                <ArrowRight className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-400 ease-[0.16,1,0.3,1]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>
        </div>
    );
}
