"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuantumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isError?: boolean;
    isCoolingDown?: boolean;
}

export function QuantumInput({
    className,
    value = "",
    onChange,
    isError,
    isCoolingDown,
    type = "text",
    ...props
}: QuantumInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="relative w-full group py-2">

            {/* The Input (Editorial and Native) */}
            <input
                ref={inputRef}
                className={cn(
                    "w-full bg-transparent text-white/90",
                    "font-sans text-[22px] md:text-[26px] tracking-[0.1em] text-center outline-none",
                    "cursor-text z-20 placeholder:text-white/20 placeholder:tracking-normal placeholder:font-light transition-all",
                    "py-4 px-2 h-16 md:h-20", // Epic proportions for a true premium feel
                    // Fix Google Chrome default light-blue autofill background
                    "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:rgba(255,255,255,0.9)] [&:-webkit-autofill]:[transition:background-color_50000s_ease-in-out_0s]",
                    className
                )}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                type={type}
                aria-invalid={isError}
                aria-disabled={isCoolingDown}
                placeholder={props.placeholder}
                style={type === "password" && !isFocused && String(value).length > 0 ? { WebkitTextSecurity: "disc" } as React.CSSProperties : {}}
                {...props}
            />

            {/* Sharp Center-Out Fill Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 overflow-hidden rounded-full">
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                        scaleX: isFocused ? 1 : 0,
                        opacity: isFocused ? 1 : 0,
                        backgroundColor: isError ? "#FF3B30" : isCoolingDown ? "#FF9F0A" : "#0A84FF" // Epic Apple Colors
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-[2px] origin-center"
                />
            </div>

            {/* Subtle Glow on Focus */}
            <AnimatePresence>
                {isFocused && !isError && !isCoolingDown && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[30px] bg-[#0A84FF]/20 blur-xl rounded-full pointer-events-none"
                    />
                )}
                {isError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[30px] bg-[#FF3B30]/30 blur-xl rounded-full pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
