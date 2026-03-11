"use client";

import React, { useState } from "react";
import { Settings2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSoundFx } from "@/hooks/useSoundFx";

export type BackgroundPreset = {
    id: string;
    name: string;
    colors: {
        primary: string; // ObsidianBlast color
        accent: string;  // UI Accent
    };
    config: {
        variant: 'square' | 'circle' | 'triangle' | 'diamond';
        pixelSize: number;
        patternScale: number;
        patternDensity: number;
        speed: number;
        noiseAmount: number;
    };
};

export const MOMENTUM_PRESETS: BackgroundPreset[] = [
    {
        id: "obsidian",
        name: "Obsidian Core",
        colors: { primary: "#14b8a6", accent: "#14b8a6" }, // Teal
        config: { variant: "square", pixelSize: 3, patternScale: 3, patternDensity: 0.8, speed: 0.6, noiseAmount: 0.04 }
    },
    {
        id: "nebula",
        name: "Nebula Pulse",
        colors: { primary: "#EC4899", accent: "#EC4899" }, // Pink
        config: { variant: "circle", pixelSize: 4, patternScale: 2, patternDensity: 1.5, speed: 0.4, noiseAmount: 0.08 }
    },
    {
        id: "deep_space",
        name: "Deep Space",
        colors: { primary: "#0EA5E9", accent: "#0EA5E9" }, // Sky Blue
        config: { variant: "diamond", pixelSize: 2, patternScale: 4, patternDensity: 0.5, speed: 0.2, noiseAmount: 0.02 }
    },
    {
        id: "golden_hour",
        name: "Golden Hour",
        colors: { primary: "#EAB308", accent: "#EAB308" }, // Yellow/Gold
        config: { variant: "triangle", pixelSize: 5, patternScale: 2.5, patternDensity: 1.0, speed: 0.5, noiseAmount: 0.05 }
    },
    {
        id: "matrix",
        name: "The Matrix",
        colors: { primary: "#22C55E", accent: "#22C55E" }, // Green
        config: { variant: "square", pixelSize: 4, patternScale: 5, patternDensity: 2.0, speed: 1.0, noiseAmount: 0.1 }
    }
];

interface BackgroundConfiguratorProps {
    currentPresetId: string;
    onPresetChange: (preset: BackgroundPreset) => void;
}

export function BackgroundConfigurator({ currentPresetId, onPresetChange }: BackgroundConfiguratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { playClick, playHover } = useSoundFx();

    const toggleOpen = () => {
        playClick();
        setIsOpen(!isOpen);
    };

    const handleSelect = (preset: BackgroundPreset) => {
        playClick();
        onPresetChange(preset);
        // Optional: Close on select or keep open? Keep open for exploration.
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex items-start justify-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mr-4 w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">Atmosphere</h3>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            {MOMENTUM_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => handleSelect(preset)}
                                    onMouseEnter={playHover}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                                        "border hover:bg-white/5",
                                        currentPresetId === preset.id
                                            ? "bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                            : "border-transparent text-white/50 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                                            style={{ backgroundColor: preset.colors.primary, color: preset.colors.primary }}
                                        />
                                        <span className="text-xs font-medium tracking-wider">{preset.name}</span>
                                    </div>
                                    {currentPresetId === preset.id && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOpen}
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "bg-black/40 backdrop-blur-md border border-white/10",
                    "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30",
                    "transition-all duration-300 shadow-lg",
                    isOpen && "bg-white/20 text-white border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                )}
            >
                <Settings2 className="w-5 h-5" />
            </motion.button>
        </div>
    );
}
