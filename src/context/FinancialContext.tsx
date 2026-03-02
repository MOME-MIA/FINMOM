"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface FinancialStrategy {
    savings: number;
    investment: number;
    needs: number;
    wants: number;
}

export interface VenturesConfig {
    activeFranchises: number;
    revenuePerFranchise: number;
    sharePercentage: number;
}

interface FinancialContextType {
    baseStrategy: FinancialStrategy;
    setBaseStrategy: (strategy: FinancialStrategy) => void;
    monthlyOverrides: Record<string, FinancialStrategy>;
    setMonthlyOverride: (monthKey: string, strategy: FinancialStrategy | null) => void;
    getStrategyForMonth: (monthKey: string) => FinancialStrategy;
    calculateSplit: (amount: number, strategy: FinancialStrategy) => {
        savings: number;
        investment: number;
        needs: number;
        wants: number;
    };
    venturesConfig: VenturesConfig;
    updateVenturesConfig: (config: Partial<VenturesConfig>) => void;
    calculateVenturesIncome: () => number;
}

const defaultStrategy: FinancialStrategy = {
    savings: 20,
    investment: 10,
    needs: 75, // Represents Food % of remainder
    wants: 25, // Represents Extras % of remainder
};

const defaultVenturesConfig: VenturesConfig = {
    activeFranchises: 0,
    revenuePerFranchise: 150000, // Default estimated revenue
    sharePercentage: 10, // 10% Royalty
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function useFinancial() {
    const context = useContext(FinancialContext);
    if (!context) {
        throw new Error("useFinancial must be used within a FinancialProvider");
    }
    return context;
}

export function FinancialProvider({ children }: { children: ReactNode }) {
    // Use custom hook for persistence - handles hydration automatically
    const [baseStrategy, setBaseStrategy] = useLocalStorage<FinancialStrategy>("financial_dna", defaultStrategy);
    const [monthlyOverrides, setMonthlyOverrides] = useState<Record<string, FinancialStrategy>>({});
    const [venturesConfig, setVenturesConfig] = useLocalStorage<VenturesConfig>("ventures_config", defaultVenturesConfig);

    const setMonthlyOverride = (monthKey: string, strategy: FinancialStrategy | null) => {
        setMonthlyOverrides(prev => {
            const next = { ...prev };
            if (strategy === null) {
                delete next[monthKey];
            } else {
                next[monthKey] = strategy;
            }
            return next;
        });
    };

    const updateVenturesConfig = (config: Partial<VenturesConfig>) => {
        setVenturesConfig(prev => ({ ...prev, ...config }));
    };

    const calculateVenturesIncome = () => {
        return venturesConfig.activeFranchises * venturesConfig.revenuePerFranchise * (venturesConfig.sharePercentage / 100);
    };

    const getStrategyForMonth = (monthKey: string): FinancialStrategy => {
        return monthlyOverrides[monthKey] || baseStrategy;
    };

    const calculateSplit = (amount: number, strategy: FinancialStrategy) => {
        // 1. Savings = (Income - Fixed) * Savings%
        // 'amount' here is assumed to be (Income - Fixed)
        const savingsAmount = amount * (strategy.savings / 100);

        // 2. Investments = (Income - Fixed - Savings) * Investments%
        const remainingAfterSavings = amount - savingsAmount;
        const investmentAmount = remainingAfterSavings * (strategy.investment / 100);

        // 3. Free for Extras = Income - Fixed - Savings - Investments
        const freeForExtras = amount - savingsAmount - investmentAmount;

        // 4. Food (Needs) = Free * 75% (Using strategy.needs as the config for this)
        // 5. Extras (Wants) = Free * 25% (Using strategy.wants as the config for this)
        const needsAmount = freeForExtras * (strategy.needs / 100);
        const wantsAmount = freeForExtras * (strategy.wants / 100);

        return {
            savings: savingsAmount,
            investment: investmentAmount,
            needs: needsAmount,
            wants: wantsAmount,
        };
    };

    return (
        <FinancialContext.Provider value={{
            baseStrategy,
            setBaseStrategy,
            monthlyOverrides,
            setMonthlyOverride,
            getStrategyForMonth,
            calculateSplit,
            venturesConfig,
            updateVenturesConfig,
            calculateVenturesIncome
        }}>
            {children}
        </FinancialContext.Provider>
    );
}
