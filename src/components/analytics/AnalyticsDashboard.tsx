"use client";

import { useState, useEffect } from "react";
import { getAnalyticsDataAction } from "@/app/actions";
import { CategorySpending, MonthlyTrend } from "@/types/finance";
import dynamic from 'next/dynamic';

import { Loader2, ArrowRight, History, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useDate } from "@/context/DateContext";
import { DrillDownModal } from "./DrillDownModal";
import { useAnalytics } from "@/hooks/useFinancialData";

const CategoryChart = dynamic(() => import('./CategoryChart').then(mod => mod.CategoryChart), {
    loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-void-950/50 rounded-xl"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>,
    ssr: false
});

const TrendChart = dynamic(() => import('./TrendChart').then(mod => mod.TrendChart), {
    loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-void-950/50 rounded-xl"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>,
    ssr: false
});

export function AnalyticsDashboard() {
    const { selectedMonth } = useDate();
    const { data, isLoading, isError } = useAnalytics();

    // Drill Down State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

    // Time Machine State
    const [comparisonMode, setComparisonMode] = useState<'none' | 'prev_month' | 'prev_year'>('none');
    const [comparisonData, setComparisonData] = useState<{ spending: CategorySpending[], total: number } | null>(null);
    const [loadingComparison, setLoadingComparison] = useState(false);

    useEffect(() => {
        if (comparisonMode !== 'none') {
            loadComparisonData();
        } else {
            setComparisonData(null);
        }
    }, [comparisonMode, selectedMonth]);

    // Derived state from hook data
    const spendingData = data?.spending || [];
    const trendData = data?.trends || [];

    const loadComparisonData = async () => {
        setLoadingComparison(true);
        try {
            let targetMonth = "";
            const [yearStr, monthStr] = selectedMonth.split('-'); // Expecting YYYY-MM
            const year = parseInt(yearStr);
            const month = parseInt(monthStr);

            if (comparisonMode === 'prev_month') {
                const d = new Date(year, month - 1 - 1); // Month is 0-indexed in Date
                targetMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else if (comparisonMode === 'prev_year') {
                targetMonth = `${year - 1}-${String(month).padStart(2, '0')}`;
            }

            if (targetMonth) {
                const data = await getAnalyticsDataAction(targetMonth);
                const total = data.spending.reduce((sum, item) => sum + item.amount, 0);
                setComparisonData({ spending: data.spending, total });
            }
        } catch (error) {
            console.error("Failed to load comparison data", error);
        } finally {
            setLoadingComparison(false);
        }
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setIsDrillDownOpen(true);
    };

    const totalSpent = spendingData.reduce((sum, item) => sum + item.amount, 0);

    // Calculate comparison percentage
    let comparisonPct = 0;
    if (comparisonData && comparisonData.total > 0) {
        comparisonPct = ((totalSpent - comparisonData.total) / comparisonData.total) * 100;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl md:text-5xl font-sans tracking-tight font-medium text-white/95">
                    Análisis Financiero
                </h1>

                {/* Time Machine Controls */}
                <div className="flex items-center gap-2 bg-[#111111]/80 backdrop-blur-xl p-1.5 rounded-[18px] border border-white/10">
                    <button
                        onClick={() => setComparisonMode('none')}
                        className={cn(
                            "px-4 py-2 text-xs font-medium rounded-xl transition-all",
                            comparisonMode === 'none'
                                ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        )}
                    >
                        Actual
                    </button>
                    <button
                        onClick={() => setComparisonMode('prev_month')}
                        className={cn(
                            "px-4 py-2 text-xs font-medium rounded-xl transition-all",
                            comparisonMode === 'prev_month'
                                ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        )}
                    >
                        vs Mes Ant.
                    </button>
                    <button
                        onClick={() => setComparisonMode('prev_year')}
                        className={cn(
                            "px-4 py-2 text-xs font-medium rounded-xl transition-all",
                            comparisonMode === 'prev_year'
                                ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        )}
                    >
                        vs Año Ant.
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
                </div>
            ) : isError ? (
                <div className="text-center py-20 text-red-400">
                    Error al cargar datos. Por favor intenta de nuevo.
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-4">
                        <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>

                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                <TrendingUp className="h-20 w-20 text-blue-500 blur-sm" />
                            </div>
                            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity z-10">
                                <TrendingUp className="h-20 w-20 text-white" />
                            </div>

                            <div className="relative z-20">
                                <p className="text-[11px] font-medium tracking-widest text-white/50 mb-3 uppercase">Gasto Total ({selectedMonth})</p>
                                <div className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">
                                    {formatCurrency(totalSpent, 'ARS')}
                                </div>
                                {comparisonMode !== 'none' && comparisonData && (
                                    <div className={cn("inline-flex items-center gap-1.5 text-[12px] px-3 py-1 rounded-full mt-3 font-medium", comparisonPct > 0 ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10")}>
                                        {comparisonPct > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                                        <span>{Math.abs(comparisonPct).toFixed(1)}% vs {comparisonMode === 'prev_month' ? 'mes anterior' : 'año anterior'}</span>
                                    </div>
                                )}
                            </div>
                            {loadingComparison && (
                                <div className="absolute top-6 right-6 z-20">
                                    <Loader2 className="h-5 w-5 animate-spin text-white/50" />
                                </div>
                            )}
                        </div>

                        <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                <History className="h-20 w-20 text-indigo-500 blur-sm" />
                            </div>
                            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity z-10">
                                <History className="h-20 w-20 text-white" />
                            </div>

                            <div className="relative z-20">
                                <p className="text-[11px] font-medium tracking-widest text-white/50 mb-3 uppercase">Categoría Principal</p>
                                <div className="text-[28px] leading-tight font-sans font-medium tracking-tight text-white truncate pr-4">
                                    {spendingData[0]?.categoryName || "N/A"}
                                </div>
                                <p className="text-[13px] text-white/50 mt-2 font-medium">
                                    {spendingData[0] ? `${spendingData[0].percentage.toFixed(1)}% del total` : ""}
                                </p>
                            </div>
                        </div>

                        <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                <TrendingDown className="h-20 w-20 text-teal-500 blur-sm" />
                            </div>
                            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity z-10">
                                <TrendingDown className="h-20 w-20 text-white" />
                            </div>

                            <div className="relative z-20">
                                <p className="text-[11px] font-medium tracking-widest text-white/50 mb-3 uppercase">Ahorro Promedio (6m)</p>
                                <div className="text-[32px] font-sans font-medium tracking-tight text-white drop-shadow-sm">
                                    {formatCurrency(
                                        trendData.slice(-6).reduce((sum, t) => sum + t.savings, 0) / Math.max(Math.min(trendData.length, 6), 1),
                                        'ARS'
                                    )}
                                </div>
                                <p className="text-[13px] text-white/50 mt-2 font-medium">
                                    Tendencia semestral
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-4">
                        <div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-[450px] flex flex-col overflow-hidden relative">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                            <h3 className="text-[19px] font-medium text-white/90 tracking-tight mb-6 relative z-10">Distribución de Gastos</h3>
                            <div className="flex-1 min-h-0 relative z-10">
                                <CategoryChart
                                    data={spendingData}
                                    onCategoryClick={handleCategoryClick}
                                />
                            </div>
                        </div>
                        <div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-[450px] flex flex-col overflow-hidden relative">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                            <h3 className="text-[19px] font-medium text-white/90 tracking-tight mb-6 relative z-10">Tendencia Histórica</h3>
                            <div className="flex-1 min-h-0 relative z-10">
                                <TrendChart data={trendData} />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <DrillDownModal
                isOpen={isDrillDownOpen}
                onClose={() => setIsDrillDownOpen(false)}
                category={selectedCategory || ""}
                month={selectedMonth}
            />
        </div>
    );
}
