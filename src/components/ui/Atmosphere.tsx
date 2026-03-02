"use client";

import { cn } from "@/lib/utils";

export function Atmosphere({ className }: { className?: string }) {
    return (
        <div className={cn("fixed inset-0 z-[-1] pointer-events-none", className)}>
            {/* Base Gradient (Deep Carbon) */}
            <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-[#0A0A0A] to-void-950" />

            {/* High Quality Noise Grain (SVG Filter) */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
                <svg className="w-full h-full">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* Vignette (Focus Attention) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}
