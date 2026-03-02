"use client";

import React from "react";
import { motion } from "framer-motion";

export function CinematicOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">

            {/* 1. Global Film Grain (Analog Noise) */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    filter: "contrast(150%) brightness(100%)"
                }}
            />

            {/* 2. Scanlines (Digital Texture) */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
                style={{ backgroundSize: "100% 3px, 3px 100%" }}
            />

            {/* 3. Vignette (Cinematic Focus) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

            {/* 4. Chromatic Aberration (Edge Distortion) */}
            {/* Simulated via a subtle inset shadow with color separation */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] mix-blend-multiply" />

        </div>
    );
}
