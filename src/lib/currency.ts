import { unstable_cache } from 'next/cache';
import type { CurrencyCode } from '@/types/finance';

// ============================================================
// Multi-Currency FX Engine
// Sources: Bluelytics (ARS), Frankfurter (EUR), CoinGecko (BTC/ETH)
// All rates stored as X/USD (how many X per 1 USD)
// USDT/USD = 1 (stablecoin peg)
// ============================================================

/** All FX rates keyed by CurrencyCode, value = units per 1 USD */
export interface FxRates {
    ARS: number;   // Blue rate
    USD: number;   // Always 1
    EUR: number;   // EUR per USD
    /** ISO timestamp of last successful fetch */
    lastUpdated: string;
    [key: string]: any;
}

const EMPTY_RATES: FxRates = {
    ARS: 0, USD: 1, EUR: 0,
    lastUpdated: '',
};

// ── Individual fetchers ────────────────────────────────────

interface BluelyticsResponse {
    blue: { value_avg: number; value_sell: number; value_buy: number };
    last_update: string;
}

/** Dolar Blue ARS/USD (sell average) */
export const fetchDolarBlue = unstable_cache(
    async (): Promise<number> => {
        try {
            const res = await fetch('https://api.bluelytics.com.ar/v2/latest');
            if (!res.ok) throw new Error('Bluelytics fetch failed');
            const data: BluelyticsResponse = await res.json();
            return data.blue.value_avg;
        } catch (error) {
            console.error("[FX] Bluelytics error:", error);
            return 0;
        }
    },
    ['dolar-blue'],
    { revalidate: 3600, tags: ['currency'] }
);

/** EUR/USD from Frankfurter (European Central Bank, free, no key) */
const fetchEurUsd = unstable_cache(
    async (): Promise<number> => {
        try {
            const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR');
            if (!res.ok) throw new Error('Frankfurter fetch failed');
            const data = await res.json();
            return data.rates?.EUR ?? 0;
        } catch (error) {
            console.error("[FX] Frankfurter error:", error);
            return 0;
        }
    },
    ['eur-usd'],
    { revalidate: 3600, tags: ['currency'] }
);

// ── Composite fetcher ──────────────────────────────────────

/** Fetch all FX rates in parallel. Returns rates dict. */
export async function fetchAllRates(): Promise<FxRates> {
    const [arsRate, eurRate] = await Promise.all([
        fetchDolarBlue(),
        fetchEurUsd()
    ]);

    return {
        ARS: arsRate,
        USD: 1,
        EUR: eurRate,
        lastUpdated: new Date().toISOString(),
    };
}

// ── Conversion helper (server-side) ────────────────────────

/**
 * Convert an amount between any two supported currencies.
 * Both `from` and `to` rates are expressed as "units per 1 USD",
 * so: result = amount × (toRate / fromRate)
 *
 * Example: 1000 ARS → USD at ARS=1200:
 *   1000 × (1 / 1200) = 0.833 USD ✓
 */
export function convertCurrency(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
    rates: FxRates
): number {
    if (!rates || !rates[from] || !rates[to]) return amount;

    // 1. Convert to USD 
    let usdAmount = 0;
    if (from === 'USD') usdAmount = amount;
    else usdAmount = amount / rates[from];

    // 2. Convert from USD to target
    if (to === 'USD') return usdAmount;
    return usdAmount * rates[to];
}
