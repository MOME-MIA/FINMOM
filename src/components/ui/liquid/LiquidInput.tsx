"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

interface LiquidInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const LiquidInput = React.forwardRef<HTMLInputElement, LiquidInputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-xs font-medium text-void-300 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-void-400 group-focus-within:text-violet-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full rounded-xl border border-white/10 bg-void-900/50 backdrop-blur-md px-4 py-2 text-sm text-void-50 placeholder:text-void-400",
                            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]", // Carved Effect
                            "focus:outline-none focus:ring-0 focus:border-violet-500/50 focus:bg-void-900/80 focus:shadow-glow transition-all duration-300",
                            icon && "pl-10",
                            error && "border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-red-400 ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);

LiquidInput.displayName = "LiquidInput";
