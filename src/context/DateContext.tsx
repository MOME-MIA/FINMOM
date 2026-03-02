"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface DateContextType {
    selectedMonth: string; // YYYY-MM
    setMonth: (month: string) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

import { Suspense } from 'react';

function DateProviderInner({ children }: { children: ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize with URL param or current month
    const initialMonth = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);

    // Sync state with URL changes
    useEffect(() => {
        const urlMonth = searchParams.get('month');
        if (urlMonth && urlMonth !== selectedMonth) {
            setSelectedMonth(urlMonth);
        }
    }, [searchParams]);

    const setMonth = (month: string) => {
        setSelectedMonth(month);
        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('month', month);
        router.push(`?${params.toString()}`);
    };

    return (
        <DateContext.Provider value={{ selectedMonth, setMonth }}>
            {children}
        </DateContext.Provider>
    );
}

const defaultContext = {
    selectedMonth: new Date().toISOString().slice(0, 7),
    setMonth: () => { }
};

export function DateProvider({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<DateContext.Provider value={defaultContext}>{children}</DateContext.Provider>}>
            <DateProviderInner>{children}</DateProviderInner>
        </Suspense>
    );
}

export function useDate() {
    const context = useContext(DateContext);
    if (context === undefined) {
        throw new Error("useDate must be used within a DateProvider");
    }
    return context;
}
