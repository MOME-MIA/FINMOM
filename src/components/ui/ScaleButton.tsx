"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface ScaleButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
}

export const ScaleButton = React.forwardRef<HTMLButtonElement, ScaleButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn("cursor-pointer", className)}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

ScaleButton.displayName = "ScaleButton";
