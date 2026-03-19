"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SummaryCharts } from "@/components/dashboard/SummaryCharts";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { HealthScore } from "@/components/dashboard/HealthScore";
import { RunwayWidget } from "@/components/dashboard/RunwayWidget";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { SmartAlerts } from "@/components/dashboard/SmartAlerts";
import { RecentTransactionsWidget } from "@/components/dashboard/RecentTransactionsWidget";
import { VaultSummaryWidget } from "@/components/dashboard/VaultSummaryWidget";
import { FinancialDNAWidget } from "@/components/dashboard/FinancialDNAWidget";
import { Transaction, Budget, DashboardKPIs, SummaryData, DimAccount } from "@/types/finance";
import { ArrowUp, ArrowDown, TrendingUp, Activity } from "lucide-react";
import { Insight } from "@/lib/insights";
import { useCurrency } from "@/context/CurrencyContext";
import { useDate } from "@/context/DateContext";
import { CountUp } from "@/components/ui/CountUp";
import { useQuery } from "@tanstack/react-query";
import { getDashboardKPIsAction, getTransactionsAction } from "@/app/actions";
import { QUERY_KEYS } from "@/hooks/useFinancialData";

interface DashboardClientProps {
    initialKPIs: DashboardKPIs;
    initialBudgets: Budget[];
    initialDolarBlue: number;
    initialTransactions: Transaction[];
    initialAccounts: DimAccount[];
    initialSmartInsight: Insight | null;
    month: string;
}

export function DashboardClient({
    initialKPIs,
    initialBudgets,
    initialDolarBlue,
    initialTransactions,
    initialAccounts,
    initialSmartInsight,
    month: serverMonth
}: DashboardClientProps) {
    const { selectedMonth } = useDate();
    const activeMonth = selectedMonth || serverMonth;

    // Optimized reactive state: use React Query with server initialData
    const { data: kpis } = useQuery({
        queryKey: QUERY_KEYS.dashboardKPIs(activeMonth),
        queryFn: async () => {
            const data = await getDashboardKPIsAction(activeMonth);
            if (!data) throw new Error("Failed to fetch KPIs");
            return data;
        },
        initialData: activeMonth === serverMonth ? initialKPIs : undefined,
        staleTime: 1000 * 60 * 5,
    });

    const { data: transactions } = useQuery({
        queryKey: QUERY_KEYS.transactions(activeMonth),
        queryFn: async () => {
            const data = await getTransactionsAction(activeMonth);
            if (!data) throw new Error("Failed to fetch transactions");
            return data;
        },
        initialData: activeMonth === serverMonth ? initialTransactions : undefined,
        staleTime: 1000 * 60 * 5,
    });

    const k = kpis || initialKPIs;
    const tx = transactions || initialTransactions;

    // Derived metrics
    const savingsRate = k.totalIncome > 0 ? (k.savings / k.totalIncome) * 100 : 0;
    const fixedExpensesRatio = k.totalIncome > 0 ? (k.fixedExpenses / k.totalIncome) * 100 : 0;

    let score = 100;
    if (savingsRate < 20) score -= 20;
    if (fixedExpensesRatio > 50) score -= 20;

    const { display, convert } = useCurrency();
    const burnRate = k.totalExpenses;
    const runwayMonths = burnRate > 0 ? k.savings / burnRate : 0;

    const summaryData: SummaryData = {
        totalIncome: convert(k.totalIncome, 'ARS', display),
        fixedExpenses: convert(k.fixedExpenses, 'ARS', display),
        freeForExtras: convert(k.totalIncome - k.totalExpenses, 'ARS', display),
        savings: convert(k.savings, 'ARS', display),
        investments: convert(k.investments, 'ARS', display),
        marginPercent: k.totalIncome > 0 ? ((k.totalIncome - k.totalExpenses) / k.totalIncome) * 100 : 0,
        savingsPercent: k.savingsRate,
    };

    // Fallback insight
    const defaultInsight: Insight = {
        type: savingsRate > 30 ? 'success' : savingsRate < 10 ? 'warning' : 'info',
        message: savingsRate > 30
            ? "Excelente nivel de ahorro."
            : savingsRate < 10
                ? "Estás ahorrando poco. Revisá gastos hormiga."
                : "Tus finanzas se mantienen estables.",
        priority: 1
    };
    const currentInsight = initialSmartInsight || defaultInsight;

    // Alerts
    const alerts: { type: 'danger' | 'warning' | 'info'; title: string; message: string }[] = [];
    if (k.fixedExpenses > k.totalIncome * 0.6) {
        alerts.push({
            type: 'warning',
            title: 'Gastos Fijos Altos',
            message: 'Superan el 60% de ingresos.'
        });
    }
    if (k.txCount === 0) {
        alerts.push({
            type: 'info',
            title: 'Sin movimientos',
            message: 'No hay transacciones registradas este mes.'
        });
    }

    // Format month label
    const formatFullMonth = (isoMonth: string) => {
        if (!isoMonth) return "";
        const [year, monthStr] = isoMonth.split('-');
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${months[parseInt(monthStr) - 1]} de ${year}`;
    };
    const monthLabel = formatFullMonth(activeMonth);

    // Formatting logic for Hero
    const heroBalance = convert(k.netBalance, 'ARS', display);
    const heroCurrencySymbol = display === 'USD' ? 'US$' : display === 'EUR' ? '€' : '$';

    const [isDeepDive, setIsDeepDive] = useState(false);

    return (
        <PageTransition>
            <PageLayout title="Dashboard" subtitle={monthLabel}>
                <div className="space-y-4 md:space-y-6">

                    {/* HERO SECTION */}
                    <div className="flex flex-col items-center justify-center pt-2 pb-6">
                        <span className="text-[11px] text-white/50 tracking-[0.2em] uppercase font-medium mb-3">Balance Total</span>
                        <div className="flex items-start justify-center gap-1.5 w-full min-w-0 px-4">
                            <span className="text-3xl text-white/50 font-light mt-2 select-none shrink-0">{heroCurrencySymbol}</span>
                            <span className="text-7xl md:text-8xl text-white tracking-tighter tabular-nums font-light truncate">
                                <CountUp value={heroBalance} />
                            </span>
                        </div>
                    </div>

                    {/* MINIMALIST KPIS */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto mb-6 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-4 md:p-5 backdrop-blur-xl">
                        <div className="flex flex-col items-center justify-center text-center min-w-0">
                            <span className="text-[10px] text-[#30D158] uppercase tracking-wider mb-2 font-medium flex items-center justify-center gap-1.5 opacity-80 w-full truncate">
                                <ArrowUp className="w-3 h-3 shrink-0" /> <span className="hidden md:inline">Ingresos</span><span className="md:hidden">Ing</span>
                            </span>
                            <span className="text-lg md:text-2xl text-white tabular-nums tracking-tight font-medium flex items-center justify-center w-full min-w-0">
                                <span className="text-white/50 text-sm md:text-base mr-0.5 shrink-0">{heroCurrencySymbol}</span>
                                <span className="truncate block"><CountUp value={summaryData.totalIncome} /></span>
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center border-l border-r border-white/5 min-w-0">
                            <span className="text-[10px] text-white/50 uppercase tracking-wider mb-2 font-medium flex items-center justify-center gap-1.5 w-full truncate">
                                <ArrowDown className="w-3 h-3 shrink-0" /> <span className="hidden md:inline">Gastos</span><span className="md:hidden">Gas</span>
                            </span>
                            <span className="text-lg md:text-2xl text-white/80 tabular-nums tracking-tight font-medium flex items-center justify-center w-full min-w-0">
                                <span className="text-white/50 text-sm md:text-base mr-0.5 shrink-0">{heroCurrencySymbol}</span>
                                <span className="truncate block"><CountUp value={summaryData.fixedExpenses + (summaryData.totalIncome - summaryData.fixedExpenses - summaryData.savings - summaryData.investments)} /></span>
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center min-w-0">
                            <span className="text-[10px] text-[#0A84FF] uppercase tracking-wider mb-2 font-medium flex items-center justify-center gap-1.5 opacity-80 w-full truncate">
                                <TrendingUp className="w-3 h-3 shrink-0" /> Ahorro
                            </span>
                            <span className="text-lg md:text-2xl text-white tabular-nums tracking-tight font-medium flex items-center justify-center w-full min-w-0">
                                <span className="truncate block">{Math.round(summaryData.savingsPercent)}</span>
                                <span className="text-white/50 text-sm md:text-base ml-0.5 shrink-0">%</span>
                            </span>
                        </div>
                    </div>

                    {/* PROGRESSIVE DISCLOSURE TOGGLE (Minimalism 3.0) */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => setIsDeepDive(!isDeepDive)}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all active:scale-95 text-xs text-white/60 tracking-wider uppercase font-medium"
                        >
                            <Activity className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                            {isDeepDive ? 'Ocultar Análisis Profundo' : 'Analítica Profunda'}
                        </button>
                    </div>

                    {/* DEEP DIVE ANALYTICS SECTION */}
                    <AnimatePresence>
                        {isDeepDive && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, height: 'auto', y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, height: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.2 } }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-8">
                                    {/* LEFT COLUMN: The "Money" Cluster */}
                                    <div className="lg:col-span-7 flex flex-col gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <SummaryCharts data={summaryData} />
                                            <VaultSummaryWidget accounts={initialAccounts} />
                                        </div>
                                        <BudgetProgress budgets={initialBudgets} />
                                    </div>

                                    {/* RIGHT COLUMN: The "Tactical" Cluster */}
                                    <div className="lg:col-span-5 flex flex-col gap-4">
                                        {alerts.length > 0 && <SmartAlerts alerts={alerts} />}
                                        <div className="mb-2">
                                            <FinancialDNAWidget
                                                income={k.totalIncome}
                                                fixed={k.fixedExpenses}
                                                variable={k.variableExpenses}
                                                savings={summaryData.savings}
                                                investments={summaryData.investments}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <HealthScore
                                                score={Math.round(score)}
                                                metrics={{
                                                    savingsRate: Math.round(savingsRate),
                                                    fixedExpensesRatio: Math.round(fixedExpensesRatio),
                                                    hasDebt: false
                                                }}
                                            />
                                            <RunwayWidget months={runwayMonths} burnRate={burnRate} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ALWAYS VISIBLE: Recent Transactions */}
                    <div className="w-full">
                        <RecentTransactionsWidget transactions={tx} />
                    </div>

                </div>
            </PageLayout>
        </PageTransition>
    );
}
