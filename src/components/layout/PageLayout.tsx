"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function PageLayout({
    children,
    className,
    title,
    subtitle,
    actions
}: PageLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn("space-y-6", className)}
        >
            {(title || actions) && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        {title && (
                            <h1 className="text-3xl font-bold tracking-tight text-gradient-obsidian">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-void-300 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-3">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className="w-full">
                {children}
            </div>
        </motion.div>
    );
}
