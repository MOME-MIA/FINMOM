"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassIconProps {
    icon: LucideIcon;
    size?: number;
    className?: string;
    color?: string;
}

export function GlassIcon({ icon: Icon, size = 24, className, color = "currentColor" }: GlassIconProps) {
    return (
        <div className={cn("relative group", className)} style={{ width: size, height: size }}>
            {/* Liquid Filter Definition */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="glass-glow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            {/* Back Glow */}
            <div className="absolute inset-0 opacity-50 blur-md group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: color }}
            >
                <Icon size={size} />
            </div>

            {/* Main Icon with Glass Effect */}
            <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                <Icon
                    size={size}
                    className="text-white/90 group-hover:text-white transition-colors duration-300"
                    style={{ filter: "url(#glass-glow)" }}
                />

                {/* Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay mask-icon"
                    style={{ maskImage: `url('data:image/svg+xml;utf8,<svg ...>${Icon}</svg>')` }} // Simplified mask logic concept
                />
            </div>
        </div>
    );
}
