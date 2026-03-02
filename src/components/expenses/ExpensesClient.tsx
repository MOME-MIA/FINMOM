"use client";

import { useState, useMemo, useEffect } from "react";
import { LiquidCard } from "@/components/ui/liquid/LiquidCard";
import { LiquidButton } from "@/components/ui/liquid/LiquidButton";
import { DetailedExpenseRecord, WeeklyControlData, DashboardKPIs, MonthlyTrend } from "@/types/finance";
import { updateWeeklyExpenseAction, toggleDebtStatusAction, updateWeeklyExpenseValueAction } from "@/app/actions";
import { CheckCircle2, Loader2, CreditCard, Wallet, RefreshCw, Calculator, Sliders, ArrowRight, Calendar as CalendarIcon, ListPlus, TrendingUp, PiggyBank, Utensils, ShoppingBag, Check, AlertTriangle, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useFinancial } from "@/context/FinancialContext";
import { IncomeLab } from "@/components/tools/IncomeLab";
import { FixedExpensesModal } from "./FixedExpensesModal";
import { IncomeManager } from "@/components/income/IncomeManager";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useWeeklyControl } from "@/hooks/useFinancialData";

interface ExpensesClientProps {
    initialData: WeeklyControlData & { availableMonths: string[] };
    detailedExpenses: DetailedExpenseRecord | null;
    dashboardKPIs: DashboardKPIs | null;
    trends?: MonthlyTrend[];
}


export function ExpensesClient({ initialData, detailedExpenses, dashboardKPIs, trends = [] }: ExpensesClientProps) {
    const router = useRouter();

    // Use TanStack Query hook
    const { data: weeklyData, isLoading, isError } = useWeeklyControl();

    // Fallback to initialData if hook is loading or error (for hydration)
    const [data, setData] = useState<WeeklyControlData & { availableMonths: string[] }>(initialData);

    // Sync hook data to local state when available
    useEffect(() => {
        if (weeklyData) {
            setData(weeklyData);
        }
    }, [weeklyData]);

    const [kpis, setKpis] = useState<DashboardKPIs | null>(dashboardKPIs);
    const [updating, setUpdating] = useState<number | string | null>(null);
    const [showIncomeLab, setShowIncomeLab] = useState(false);
    const [showTuner, setShowTuner] = useState(false);
    const [showFixedExpenses, setShowFixedExpenses] = useState(false);
    const [showEditIncome, setShowEditIncome] = useState(false);
    const [editingWeek, setEditingWeek] = useState<number | null>(null);
    const [editWeekValue, setEditWeekValue] = useState<number>(0);
    // Financial Context
    const { getStrategyForMonth, calculateSplit } = useFinancial();
    const { display, convert } = useCurrency();

    // Update data when initialData changes
    useMemo(() => {
        setData(initialData);
    }, [initialData]);

    useMemo(() => {
        setKpis(dashboardKPIs);
    }, [dashboardKPIs]);

    // Helper to format currency
    const formatMoney = (amount: number, sourceCurrency = 'ARS') => {
        const converted = convert(amount, sourceCurrency as any, display);
        const isExact = converted % 1 === 0;

        if (display === 'USD') {
            return `US$${converted.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        if (display === 'EUR') {
            return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        return `$${converted.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    const getDisplayValue = (item: { restante: number, cambioARS: number }) => {
        return convert(item.cambioARS, 'ARS', display);
    };

    const exchangeRate = data.gastosFijos.valorUSDRef || 1;
    const incomeValue = convert(data.income * exchangeRate, 'ARS', display);
    const fixedExpensesValue = getDisplayValue(data.gastosFijos);

    // Financial Calculations
    const activeStrategy = getStrategyForMonth(data.month);
    const availableForSplit = incomeValue - fixedExpensesValue;
    const split = calculateSplit(availableForSplit > 0 ? availableForSplit : 0, activeStrategy);

    // Trend Forecasting
    const forecast = useMemo(() => {
        if (!trends || trends.length < 3) return null;
        // Take last 3 months excluding current if possible, or just last 3
        // Assuming trends are sorted by date ascending
        const recentTrends = trends.slice(-3);
        const avgExpenses = recentTrends.reduce((acc, t) => acc + t.expenses, 0) / recentTrends.length;
        return avgExpenses;
    }, [trends]);

    const handleToggleStatus = async (weekId: string, weekNumber: number, currentStatus: boolean) => {
        setUpdating(weekNumber);
        const newStatus = !currentStatus;

        // Optimistic update
        setData(prev => ({
            ...prev,
            weeks: prev.weeks.map(w => w.weekNumber === weekNumber ? { ...w, isPaid: newStatus } : w)
        }));

        const success = await updateWeeklyExpenseAction(weekId, newStatus);

        if (success) {
            toast.success(`Semana ${weekNumber} marcada como ${newStatus ? 'pagada' : 'pendiente'}`);
            router.refresh();
        } else {
            toast.error("Error al actualizar el estado");
            // Revert optimistic update
            setData(prev => ({
                ...prev,
                weeks: prev.weeks.map(w => w.weekNumber === weekNumber ? { ...w, isPaid: !newStatus } : w)
            }));
        }
        setUpdating(null);
    };

    const handleToggleDebt = async (debtName: string, currentStatus: boolean) => {
        if (!kpis) return;
        setUpdating(`debt-${debtName}`);
        const newStatus = !currentStatus;

        // Optimistic update
        setKpis(prev => prev ? ({
            ...prev,
        }) : null);

        const success = await toggleDebtStatusAction(data.month, debtName, currentStatus);

        if (success) {
            toast.success(`Deuda "${debtName}" actualizada`);
            router.refresh();
        } else {
            toast.error("Error al actualizar la deuda");
            // Revert
            setKpis(prev => prev ? ({
                ...prev,
            }) : null);
        }
        setUpdating(null);
    };

    const handleSaveWeekValue = async (weekId: string, weekNumber: number) => {
        setUpdating(weekNumber);
        const success = await updateWeeklyExpenseValueAction(weekId, editWeekValue);

        if (success) {
            toast.success("Presupuesto semanal actualizado");
            // Optimistic update
            setData(prev => ({
                ...prev,
                weeks: prev.weeks.map(w => w.weekNumber === weekNumber ? { ...w, restante: editWeekValue } : w)
            }));
            setEditingWeek(null);
            router.refresh();
        } else {
            toast.error("Error al actualizar");
        }
        setUpdating(null);
    };

    return (
        <PageTransition>
            <PageLayout
                title="Control Semanal"
                subtitle="Administra tus gastos y presupuesto"
                actions={
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Tools */}
                        <div className="flex items-center gap-2">
                            <LiquidButton
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowIncomeLab(true)}
                                className="gap-2"
                            >
                                <Calculator className="h-4 w-4 text-purple-400" />
                                Income Lab
                            </LiquidButton>
                            <LiquidButton
                                variant={showTuner ? "primary" : "secondary"}
                                size="sm"
                                onClick={() => setShowTuner(!showTuner)}
                                className="gap-2"
                            >
                                <Sliders className="h-4 w-4" />
                                Tuner
                            </LiquidButton>
                        </div>
                    </div>
                }
            >
                <div className="space-y-8 pb-20 md:pb-0 relative">
                    {/* Monthly Analysis Block */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Analysis Table */}
                        <div className="lg:col-span-2 group relative z-10 flex flex-col overflow-hidden bg-[#111111]/80 backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <h3 className="text-[15px] font-medium text-white/90 tracking-tight mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-400" />
                                Análisis Mensual
                            </h3>
                            <div className="space-y-3">
                                {!dashboardKPIs ? (
                                    Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-2">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <AnalysisRow
                                            label="Ingresos Totales"
                                            value={dashboardKPIs.totalIncome}
                                            color="text-emerald-400"
                                            formatMoney={formatMoney}
                                            onEdit={() => setShowEditIncome(true)}
                                        />
                                        <AnalysisRow label="Gastos Fijos" value={dashboardKPIs.fixedExpenses} color="text-red-400" formatMoney={formatMoney} />
                                        <AnalysisRow label="Ahorros" value={dashboardKPIs.savings} color="text-yellow-400" icon={<PiggyBank className="h-3.5 w-3.5" />} formatMoney={formatMoney} />
                                        <AnalysisRow label="Inversiones" value={dashboardKPIs.investments} color="text-blue-400" icon={<TrendingUp className="h-3.5 w-3.5" />} formatMoney={formatMoney} />
                                        <div className="h-px bg-white/10 my-3" />
                                        <AnalysisRow label="Gastos Variables" value={dashboardKPIs.variableExpenses} color="text-orange-400" formatMoney={formatMoney} />
                                        <AnalysisRow label="Balance Neto" value={dashboardKPIs.netBalance} color="text-purple-400" formatMoney={formatMoney} />

                                        {/* Smart Alert */}
                                        {dashboardKPIs.totalExpenses > dashboardKPIs.totalIncome && (
                                            <div className="mt-6 border border-white/5 rounded-2xl bg-[#1A1111]/60 p-4 flex gap-3 shadow-inner">
                                                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-medium text-red-400">¡Alerta de Presupuesto!</p>
                                                    <p className="text-[12px] text-white/60 leading-relaxed">
                                                        Tus gastos totales superan tus ingresos del mes.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Forecast Card */}
                        {forecast && (
                            <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                                <div>
                                    <h3 className="text-[15px] font-medium text-white/90 tracking-tight mb-1 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-400" />
                                        Proyección
                                    </h3>
                                    <p className="text-[11px] text-white/50 tracking-wide uppercase font-medium mt-1">Basado en los últimos 3 meses</p>
                                </div>

                                <div className="mt-4">
                                    <p className="text-[11px] text-blue-400/80 font-medium uppercase tracking-wider mb-1">Gasto Estimado</p>
                                    <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">
                                        {formatMoney(forecast, 'ARS')}
                                    </p>
                                </div>

                                <div className="mt-4 border border-white/5 rounded-2xl bg-white/[0.02] p-4 shadow-inner">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-white/50 font-medium">Promedio Histórico</span>
                                        <span className="text-[16px] font-medium text-white/90 tracking-tight">
                                            {formatMoney(forecast, 'ARS')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Debts Table */}
                        <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                            <h3 className="text-[15px] font-medium text-white/90 tracking-tight mb-4 flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-emerald-400" />
                                Resumen Rápido
                            </h3>
                            <div className="space-y-3 flex-1 flex flex-col justify-center">
                                {kpis ? (
                                    <div className="text-center py-6">
                                        <p className="text-[40px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm leading-none">{formatMoney(kpis.netBalance, 'ARS')}</p>
                                        <p className="text-[12px] text-white/50 mt-3 font-medium tracking-wide uppercase">Balance Neto</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/50 text-[13px] font-medium">
                                        Sin datos disponibles
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial Intelligence Dashboard (Existing) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Money Flow Visualization */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Income Node */}
                            <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Wallet className="h-20 w-20 text-emerald-500 blur-sm" />
                                </div>
                                <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity z-10">
                                    <Wallet className="h-20 w-20 text-white" />
                                </div>
                                <div className="relative z-20">
                                    <p className="text-[11px] font-medium tracking-widest text-emerald-400/80 mb-3 uppercase">Ingreso Total</p>
                                    <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">{formatMoney(incomeValue)}</p>
                                    <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-emerald-400/60">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span>Fuente Principal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Expenses Node */}
                            <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <CreditCard className="h-20 w-20 text-blue-500 blur-sm" />
                                </div>
                                <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity z-10">
                                    <CreditCard className="h-20 w-20 text-white" />
                                </div>
                                <div className="relative z-20 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[11px] font-medium tracking-widest text-blue-400/80 mb-3 uppercase">Gastos Fijos</p>
                                                <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">{formatMoney(fixedExpensesValue)}</p>
                                            </div>
                                            <button
                                                onClick={() => setShowFixedExpenses(true)}
                                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                                title="Ver Detalle"
                                            >
                                                <ListPlus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className="mt-6 border border-white/5 rounded-2xl bg-white/[0.02] p-3 shadow-inner hover:bg-white/5 transition-colors flex items-center justify-between group/btn"
                                        onClick={async () => {
                                            const toastId = toast.loading("Procesando...");
                                            const { processFixedExpensesAction } = await import("@/app/actions");
                                            const success = await processFixedExpensesAction();
                                            if (success) toast.success("Registrado", { id: toastId });
                                            else toast.error("Error", { id: toastId });
                                        }}
                                    >
                                        <span className="text-[12px] font-medium text-white/70 group-hover/btn:text-white transition-colors">Registrar Pago</span>
                                        <ArrowRight className="h-4 w-4 text-white/50 group-hover/btn:text-white transition-colors group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Available Node */}
                            <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <RefreshCw className="h-20 w-20 text-purple-500 blur-sm" />
                                </div>
                                <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity z-10">
                                    <RefreshCw className="h-20 w-20 text-white" />
                                </div>
                                <div className="relative z-20">
                                    <p className="text-[11px] font-medium tracking-widest text-purple-400/80 mb-3 uppercase">Disponible Real</p>
                                    <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">{formatMoney(availableForSplit)}</p>
                                    <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-purple-400/60">
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                        <span>Para distribuir</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Breakdown Panel */}
                        <div className="lg:col-span-4 group relative z-10 flex flex-col overflow-hidden bg-[#111111]/80 backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[15px] font-medium text-white/90 tracking-tight">Estrategia Activa</h3>
                                    <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10 font-medium">
                                        {showTuner ? "Manual Override" : "Base DNA"}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <StrategyItem
                                        label="Ahorros"
                                        sublabel="% del Total"
                                        amount={split.savings}
                                        percent={activeStrategy.savings}
                                        color="bg-emerald-500"
                                        textColor="text-emerald-400"
                                        formatMoney={formatMoney}
                                    />
                                    <StrategyItem
                                        label="Inversiones"
                                        sublabel="% del Restante"
                                        amount={split.investment}
                                        percent={activeStrategy.investment}
                                        color="bg-purple-500"
                                        textColor="text-purple-400"
                                        formatMoney={formatMoney}
                                    />
                                    <div className="h-px bg-white/10 my-4" />
                                    <StrategyItem
                                        label="Necesidades"
                                        sublabel="% del Libre"
                                        amount={split.needs}
                                        percent={activeStrategy.needs}
                                        color="bg-blue-500"
                                        textColor="text-blue-400"
                                        formatMoney={formatMoney}
                                    />
                                    <StrategyItem
                                        label="Deseos"
                                        sublabel="% del Libre"
                                        amount={split.wants}
                                        percent={activeStrategy.wants}
                                        color="bg-orange-500"
                                        textColor="text-orange-400"
                                        formatMoney={formatMoney}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <span>Desglose Semanal</span>
                        </h3>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {data.weeks.length > 0 ? (
                                data.weeks.map((week) => (
                                    <motion.div
                                        key={week.weekNumber}
                                        variants={{
                                            hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                                            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 h-full",
                                                week.isPaid ? "opacity-60 grayscale-[0.2]" : "opacity-100 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                                            )}
                                        >
                                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-[11px] font-medium tracking-widest text-[#FFF]/50 uppercase">Semana {week.weekNumber}</p>
                                                    <p className="text-[12px] text-white/40 mt-1 font-medium">{week.fechaRetiro}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleToggleStatus(week.id || week.weekNumber.toString(), week.weekNumber, week.isPaid)}
                                                    disabled={updating === week.weekNumber}
                                                    className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-inner",
                                                        week.isPaid ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/20 hover:text-white"
                                                    )}
                                                >
                                                    {updating === week.weekNumber ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm leading-none">
                                                    {formatMoney(display === 'USD' ? week.restante : week.cambioARS)}
                                                </p>
                                                <p className={cn("text-[12px] font-medium mt-2", week.isPaid ? "text-emerald-400" : "text-white/40")}>
                                                    {week.isPaid ? "Pagado" : "Pendiente"}
                                                </p>
                                            </div>

                                            {/* Edit Value Section */}
                                            <div className="mt-6 pt-5 border-t border-white/10 relative z-20">
                                                {editingWeek === week.weekNumber ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            value={editWeekValue}
                                                            onChange={(e) => setEditWeekValue(Number(e.target.value))}
                                                            className="h-10 bg-black/40 border-white/10 text-[13px] rounded-xl outline-none focus:ring-1 focus:ring-white/20 px-3 transition-colors"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleSaveWeekValue(week.id || week.weekNumber.toString(), week.weekNumber)}
                                                            disabled={updating === week.weekNumber}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                                        >
                                                            {updating === week.weekNumber ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingWeek(null)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between items-center group/edit min-h-[40px]">
                                                        <span className="text-[12px] text-white/50 font-medium">Presupuesto</span>
                                                        <button
                                                            onClick={() => {
                                                                setEditingWeek(week.weekNumber);
                                                                setEditWeekValue(display === 'USD' ? week.restante : week.cambioARS);
                                                            }}
                                                            className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center gap-2"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            <span className="text-[11px] font-medium">Editar</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 }
                                    }}
                                >
                                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                        <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Sin datos para este período</h3>
                                        <p className="text-sm text-muted-foreground">No se encontraron registros de gastos semanales.</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Modals */}
                    <AnimatePresence>
                        {showIncomeLab && <IncomeLab onClose={() => setShowIncomeLab(false)} />}
                        {showFixedExpenses && (
                            <FixedExpensesModal
                                data={detailedExpenses}
                                onClose={() => setShowFixedExpenses(false)}

                            />
                        )}
                        {showEditIncome && dashboardKPIs && (
                            <IncomeManager
                                isOpen={showEditIncome}
                                onClose={() => setShowEditIncome(false)}
                                currentIncome={dashboardKPIs.totalIncome}
                                month={data.month}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </PageLayout>
        </PageTransition >
    );
}

function StrategyItem({ label, sublabel, amount, percent, color, textColor, formatMoney }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn("h-2 w-2 rounded-full", color)} />
                <div className="flex flex-col">
                    <span className="text-[13px] text-white/80 font-medium">{label}</span>
                    {sublabel && <span className="text-[11px] text-white/40 font-medium">{sublabel}</span>}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/60 bg-white/[0.05] px-2 py-0.5 rounded-md font-medium">{percent}%</span>
                <span className={cn("text-[15px] font-medium font-sans tracking-tight", textColor)}>
                    {formatMoney(amount)}
                </span>
            </div>
        </div>
    );
}

function AnalysisRow({ label, value, color, icon, formatMoney, onEdit }: any) {
    // formatMoney already pulls context display config
    const displayValue = value;
    return (
        <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group/row">
            <div className="flex items-center gap-3">
                <div className={cn("h-9 w-9 rounded-full flex items-center justify-center bg-white/[0.05] shadow-inner", color)}>
                    {icon || <div className="h-2 w-2 rounded-full bg-current" />}
                </div>
                <span className="text-[13px] text-white/80 font-medium tracking-wide">{label}</span>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="p-1.5 opacity-0 group-hover/row:opacity-100 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all transform -translate-x-2 group-hover/row:translate-x-0"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
            <span className={cn("text-[16px] font-sans font-medium tracking-tight", color)}>
                {formatMoney(displayValue)}
            </span>
        </div>
    );
}
