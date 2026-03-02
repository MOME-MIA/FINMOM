"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MiaContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleMia: () => void;
}

const MiaContext = createContext<MiaContextType | undefined>(undefined);

export function MiaProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMia = () => setIsOpen((prev) => !prev);

    return (
        <MiaContext.Provider value={{ isOpen, setIsOpen, toggleMia }}>
            {children}
        </MiaContext.Provider>
    );
}

export function useMia() {
    const context = useContext(MiaContext);
    if (context === undefined) {
        throw new Error("useMia must be used within a MiaProvider");
    }
    return context;
}
