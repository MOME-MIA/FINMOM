"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
    isSolidMode: boolean; // "Solid Metal Mode" (High Contrast / No Blur)
    toggleSolidMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isSolidMode, setIsSolidMode] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("momentum_solid_mode");
        if (saved) {
            setIsSolidMode(JSON.parse(saved));
        }
    }, []);

    const toggleSolidMode = () => {
        setIsSolidMode((prev) => {
            const newValue = !prev;
            localStorage.setItem("momentum_solid_mode", JSON.stringify(newValue));
            return newValue;
        });
    };

    // Apply global class for Solid Mode if needed (e.g., to disable blurs globally)
    useEffect(() => {
        if (isSolidMode) {
            document.documentElement.classList.add("solid-mode");
        } else {
            document.documentElement.classList.remove("solid-mode");
        }
    }, [isSolidMode]);

    return (
        <ThemeContext.Provider value={{ isSolidMode, toggleSolidMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
