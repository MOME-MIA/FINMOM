"use client";

import { motion } from "framer-motion";

interface StepProgressProps {
    currentStep: number;
    totalSteps: number;
    /** Labels for each step */
    labels?: string[];
}

export function StepProgress({ currentStep, totalSteps, labels }: StepProgressProps) {
    return (
        <div className="flex items-center justify-center gap-1 w-full max-w-[280px] mx-auto">
            {Array.from({ length: totalSteps }).map((_, i) => {
                const isCompleted = i < currentStep;
                const isActive = i === currentStep;
                const isFuture = i > currentStep;

                return (
                    <div key={i} className="flex items-center gap-1 flex-1">
                        {/* Dot */}
                        <motion.div
                            animate={{
                                scale: isActive ? 1 : 0.85,
                                backgroundColor: isCompleted
                                    ? "#30D158"
                                    : isActive
                                        ? "#0A84FF"
                                        : "rgba(255, 255, 255, 0.1)",
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-2 h-2 rounded-full shrink-0 relative"
                        >
                            {isActive && (
                                <motion.div
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-full bg-[#0A84FF]"
                                />
                            )}
                        </motion.div>

                        {/* Connector line (not after last) */}
                        {i < totalSteps - 1 && (
                            <div className="flex-1 h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                    className="w-full h-full bg-[#30D158] origin-left"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
