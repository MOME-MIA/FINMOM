"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { CurrencyCode } from "@/types/finance";

/**
 * CurrencyContext — Global Multi-Currency FX State
 *
 * Stores all FX rates as X-per-USD. Provides:
 * - `convert(amount, from, to)` — universal converter
 * - `display` — user's preferred view currency (ARS | USD)
 * - `getRate(from, to)` — raw rate lookup
 * - `toggleCurrency()` — quick ARS↔USD switch
 */

/** Rates dict: each value = units of that currency per 1 USD */
export interface FxRates {
    ARS: number;
    USD: number;
    EUR: number;
    lastUpdated: string;
}

interface CurrencyState {
    /** All FX rates (X per 1 USD) */
    rates: FxRates;
    /** Dynamic currencies present in user's active accounts */
    activeCurrencies: CurrencyCode[];
    /** Legacy: dolar blue rate (ARS per USD) */
    rate: number;
    /** User's preferred display currency */
    display: CurrencyCode;
    /** Whether rates are still loading */
    loading: boolean;
    /** Last fetch timestamp */
    lastUpdated: string | null;
    /** Toggle between ARS and USD */
    toggleCurrency: () => void;
    /** Set display currency explicitly */
    setCurrency: (c: CurrencyCode) => void;
    /** Convert amount from one currency to another */
    convert: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
    /** Get rate between two currencies */
    getRate: (from: CurrencyCode, to: CurrencyCode) => number;
    /** Legacy: Convert ARS to USD at blue rate */
    toUSD: (ars: number) => number;
    /** Legacy: Convert USD to ARS at blue rate */
    toARS: (usd: number) => number;
    /** Refresh all rates from API */
    refreshRate: () => Promise<void>;
}

const EMPTY_RATES: FxRates = {
    ARS: 0, USD: 1, EUR: 0,
    lastUpdated: '',
};

const CurrencyContext = createContext<CurrencyState | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [rates, setRates] = useState<FxRates>(EMPTY_RATES);
    const [activeCurrencies, setActiveCurrencies] = useState<CurrencyCode[]>(['ARS', 'USD', 'EUR']);
    const [display, setDisplay] = useState<CurrencyCode>('USD');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const { getFxRatesAction, getAccountsAction } = await import("@/app/actions");

            const [r, accounts] = await Promise.all([
                getFxRatesAction(),
                getAccountsAction()
            ]);

            if (r && r.ARS > 0) {
                setRates(r);
            }

            if (accounts && accounts.length > 0) {
                const uniqueCurrencies = Array.from(new Set(accounts.map((a: any) => a.currencyCode))) as CurrencyCode[];
                // Ensure globally accepted baseline exists, but prioritize accounts
                setActiveCurrencies(uniqueCurrencies.length > 0 ? uniqueCurrencies : ['ARS', 'USD', 'EUR']);
            }
        } catch (err) {
            console.error("[CurrencyProvider] Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Refresh data every 30 min
        const interval = setInterval(fetchData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // ── Converters ──────────────────────────────────────

    const convert = useCallback((amount: number, from: CurrencyCode, to: CurrencyCode): number => {
        if (from === to) return amount;
        const fromRate = rates[from as keyof Omit<FxRates, 'lastUpdated'>] ?? 0;
        const toRate = rates[to as keyof Omit<FxRates, 'lastUpdated'>] ?? 0;
        if (fromRate === 0 || toRate === 0) return 0;
        return amount * (toRate / fromRate);
    }, [rates]);

    const getRate = useCallback((from: CurrencyCode, to: CurrencyCode): number => {
        if (from === to) return 1;
        const fromRate = rates[from as keyof Omit<FxRates, 'lastUpdated'>] ?? 0;
        const toRate = rates[to as keyof Omit<FxRates, 'lastUpdated'>] ?? 0;
        if (fromRate === 0 || toRate === 0) return 0;
        return toRate / fromRate;
    }, [rates]);

    // Legacy helpers
    const toUSD = useCallback((ars: number) => rates.ARS > 0 ? ars / rates.ARS : 0, [rates]);
    const toARS = useCallback((usd: number) => usd * rates.ARS, [rates]);

    const toggleCurrency = useCallback(() => {
        setDisplay(prev => prev === 'ARS' ? 'USD' : 'ARS');
    }, []);

    const setCurrency = useCallback((c: CurrencyCode) => setDisplay(c), []);

    return (
        <CurrencyContext.Provider value={{
            rates,
            rate: rates.ARS, // Legacy compat
            activeCurrencies,
            display,
            loading,
            lastUpdated: rates.lastUpdated || null,
            toggleCurrency,
            setCurrency,
            convert,
            getRate,
            toUSD,
            toARS,
            refreshRate: fetchData,
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

/** SSR-safe: returns defaults when provider is missing (build prerendering) */
const SSR_DEFAULTS: CurrencyState = {
    rates: EMPTY_RATES,
    rate: 0,
    activeCurrencies: ['ARS', 'USD', 'EUR'],
    display: 'ARS',
    loading: true,
    lastUpdated: null,
    toggleCurrency: () => { },
    setCurrency: () => { },
    convert: () => 0,
    getRate: () => 0,
    toUSD: () => 0,
    toARS: () => 0,
    refreshRate: async () => { },
};

export function useCurrency(): CurrencyState {
    const ctx = useContext(CurrencyContext);
    return ctx ?? SSR_DEFAULTS;
}
