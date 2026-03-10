"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionsAction, getBudgetsAction, getCryptoPortfolioAction, getWeeklyControlAction } from "@/app/actions";
import { useDate } from "@/context/DateContext";

// Keys for caching
export const QUERY_KEYS = {
    transactions: (month: string) => ["transactions", month],
    budget: (month: string) => ["budget", month],
    crypto: ["crypto"],
    analytics: (month: string) => ["analytics", month],
    weekly: (month: string) => ["weekly", month],
    dashboardKPIs: (month: string) => ["dashboardKPIs", month],
    dolarBlue: ["dolarBlue"],
};

export function useTransactions() {
    const { selectedMonth } = useDate();

    return useQuery({
        queryKey: QUERY_KEYS.transactions(selectedMonth),
        queryFn: async () => {
            const data = await getTransactionsAction(selectedMonth);
            if (!data) throw new Error("Failed to fetch transactions");
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useBudget() {
    const { selectedMonth } = useDate();

    return useQuery({
        queryKey: QUERY_KEYS.budget(selectedMonth),
        queryFn: async () => {
            const data = await getBudgetsAction(selectedMonth);
            if (!data) throw new Error("Failed to fetch budget");
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCrypto() {
    return useQuery({
        queryKey: QUERY_KEYS.crypto,
        queryFn: async () => {
            const data = await getCryptoPortfolioAction();
            if (!data) throw new Error("Failed to fetch crypto portfolio");
            return data;
        },
        refetchInterval: 1000 * 60, // Refresh every minute
    });
}

export function useAnalytics() {
    const { selectedMonth } = useDate();

    return useQuery({
        queryKey: QUERY_KEYS.analytics(selectedMonth),
        queryFn: async () => {
            const { getAnalyticsDataAction } = await import("@/app/actions");
            const data = await getAnalyticsDataAction(selectedMonth);
            if (!data) throw new Error("Failed to fetch analytics data");
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useDashboardKPIs() {
    const { selectedMonth } = useDate();

    return useQuery({
        queryKey: QUERY_KEYS.dashboardKPIs(selectedMonth),
        queryFn: async () => {
            const { getDashboardKPIsAction } = await import("@/app/actions");
            const data = await getDashboardKPIsAction(selectedMonth);
            if (!data) throw new Error("Failed to fetch KPIs");
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useDolarBlue() {
    return useQuery({
        queryKey: QUERY_KEYS.dolarBlue,
        queryFn: async () => {
            const { getDolarBlueAction } = await import("@/app/actions");
            const data = await getDolarBlueAction();
            return data;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useWeeklyControl() {
    const { selectedMonth } = useDate();

    return useQuery({
        queryKey: QUERY_KEYS.weekly(selectedMonth),
        queryFn: async () => {
            const data = await getWeeklyControlAction(selectedMonth);
            if (!data) throw new Error("Failed to fetch weekly control data");
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
