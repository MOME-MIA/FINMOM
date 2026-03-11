"use client";

import { useState, useMemo, useEffect } from "react";
import { DetailedExpenseRecord, WeeklyControlData, DashboardKPIs, MonthlyTrend, Transaction, Budget, CategorySpending } from "@/types/finance";
import { updateWeeklyExpenseAction, toggleDebtStatusAction, updateWeeklyExpenseValueAction } from "@/app/actions";
import { CheckCircle2, Loader2, CreditCard, Wallet, RefreshCw, Calculator, Sliders, ArrowRight, Calendar as CalendarIcon, ListPlus, TrendingUp, PiggyBank, Check, AlertTriangle, Edit2, Save, X, LayoutGrid, List, Target } from "lucide-react";
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
import { useWeeklyControl, useTransactions, useBudget, useAnalytics, useDashboardKPIs } from "@/hooks/useFinancialData";
import { ExpensesFilters, type ExpenseFilters } from "./ExpensesFilters";
import { ExpensesList } from "./ExpensesList";
import { ExpenseSummaryCards } from "./ExpenseSummaryCards";
import { BudgetVsActual } from "./BudgetVsActual";
import dynamic from "next/dynamic";

const CategoryChart = dynamic(() => import('@/components/analytics/CategoryChart').then(mod => mod.CategoryChart), {
    loading: () => <div className="h-[350px] w-full flex items-center justify-center bg-white/[0.02] rounded-xl"><Loader2 className="h-8 w-8 animate-spin text-white/30" /></div>,
    ssr: false
});

interface ExpensesClientProps {
    initialData: WeeklyControlData & { availableMonths: string[] };
    detailedExpenses: DetailedExpenseRecord | null;
    dashboardKPIs: DashboardKPIs | null;
    trends?: MonthlyTrend[];
}

type TabKey = "overview" | "list" | "weekly";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Resumen", icon: LayoutGrid },
    { key: "list", label: "Movimientos", icon: List },
    { key: "weekly", label: "Control Semanal", icon: CalendarIcon },
];

export function ExpensesClient({ initialData, detailedExpenses, dashboardKPIs: initialKPIs, trends = [] }: ExpensesClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    // TanStack Query hooks
    const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyControl();
    const { data: transactions, isLoading: txLoading } = useTransactions();
    const { data: budgets, isLoading: budgetLoading } = useBudget();
    const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();
    const { data: kpisData } = useDashboardKPIs();

    // Fallback to initial data for hydration
    const [data, setData] = useState<WeeklyControlData & { availableMonths: string[] }>(initialData);
    const kpis = kpisData || initialKPIs;
    const spending = analyticsData?.spending || [];
    const txList: Transaction[] = transactions || [];
    const budgetList: Budget[] = budgets || [];

    useEffect(() => {
        if (weeklyData) setData(weeklyData);
    }, [weeklyData]);

    useMemo(() => setData(initialData), [initialData]);

    // Filters state (for list tab)
    const [filters, setFilters] = useState<ExpenseFilters>({
        searchQuery: "",
        categories: [],
        paymentMethods: [],
    });

    // UI state
    const [updating, setUpdating] = useState<number | string | null>(null);
    const [showIncomeLab, setShowIncomeLab] = useState(false);
    const [showFixedExpenses, setShowFixedExpenses] = useState(false);
    const [showEditIncome, setShowEditIncome] = useState(false);
    const [editingWeek, setEditingWeek] = useState<number | null>(null);
    const [editWeekValue, setEditWeekValue] = useState<number>(0);

    // Financial Context
    const { getStrategyForMonth, calculateSplit } = useFinancial();
    const { display, convert } = useCurrency();

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

    const exchangeRate = data.gastosFijos.valorUSDRef || 1;
    const incomeValue = convert(data.income * exchangeRate, 'ARS', display);
    const fixedExpensesValue = convert(data.gastosFijos.cambioARS, 'ARS', display);
    const activeStrategy = getStrategyForMonth(data.month);
    const availableForSplit = incomeValue - fixedExpensesValue;
    const split = calculateSplit(availableForSplit > 0 ? availableForSplit : 0, activeStrategy);

    // Days in current month
    const daysInMonth = useMemo(() => {
        const [y, m] = data.month.split('-').map(Number);
        return new Date(y, m, 0).getDate();
    }, [data.month]);

    // Top category
    const topCategory = spending.length > 0 ? spending[0] : null;

    // Filtered count for list tab
    const filteredTxCount = useMemo(() => {
        let result = txList;
        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(tx =>
                tx.description?.toLowerCase().includes(q) ||
                tx.categoryName?.toLowerCase().includes(q)
            );
        }
        if (filters.categories.length > 0) {
            result = result.filter(tx => tx.categoryName && filters.categories.includes(tx.categoryName));
        }
        if (filters.paymentMethods.length > 0) {
            result = result.filter(tx => filters.paymentMethods.includes(tx.paymentMethod));
        }
        return result.length;
    }, [txList, filters]);

    // Weekly control handlers
    const handleToggleStatus = async (weekId: string, weekNumber: number, currentStatus: boolean) => {
        setUpdating(weekNumber);
        const newStatus = !currentStatus;
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
            setData(prev => ({
                ...prev,
                weeks: prev.weeks.map(w => w.weekNumber === weekNumber ? { ...w, isPaid: !newStatus } : w)
            }));
        }
        setUpdating(null);
    };

    const handleSaveWeekValue = async (weekId: string, weekNumber: number) => {
        setUpdating(weekNumber);
        const success = await updateWeeklyExpenseValueAction(weekId, editWeekValue);
        if (success) {
            toast.success("Presupuesto semanal actualizado");
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
                title="Gastos"
                subtitle="Vista completa de gastos, presupuestos y control semanal"
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowIncomeLab(true)}
                            className="h-9 px-3.5 flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[12px] font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                            <Calculator className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Income Lab</span>
                        </button>
                    </div>
                }
            >
                <div className="space-y-6 pb-20 md:pb-0">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-1 bg-[#111111]/80 backdrop-blur-xl p-1.5 rounded-[18px] border border-white/10 w-fit">
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all",
                                    activeTab === tab.key
                                        ? "bg-white/10 text-white shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                                        : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-6"
                            >
                                {/* KPI Cards */}
                                <ExpenseSummaryCards
                                    kpis={kpis}
                                    topCategory={topCategory}
                                    budgets={budgetList}
                                    txCount={txList.length}
                                    daysInMonth={daysInMonth}
                                />

                                {/* Charts + Budget Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Category Donut */}
                                    <div className="lg:col-span-7 bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] h-[420px] flex flex-col overflow-hidden relative">
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                        <h3 className="text-[15px] font-medium text-white/90 tracking-tight mb-4 relative z-10">Distribución de Gastos</h3>
                                        <div className="flex-1 min-h-0 relative z-10">
                                            {analyticsLoading ? (
                                                <div className="h-full flex items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-white/30" />
                                                </div>
                                            ) : (
                                                <CategoryChart data={spending} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Budget vs Actual */}
                                    <div className="lg:col-span-5 bg-[#111111]/80 backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-[15px] font-medium text-white/90 tracking-tight flex items-center gap-2">
                                                <Target className="h-5 w-5 text-[#0A84FF]" />
                                                Presupuesto vs Real
                                            </h3>
                                        </div>
                                        <div className="flex-1 overflow-y-auto no-scrollbar">
                                            <BudgetVsActual budgets={budgetList} />
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Intelligence: Income / Fixed / Available */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Income Node */}
                                    <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity">
                                            <Wallet className="h-20 w-20 text-emerald-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-[11px] font-medium tracking-widest text-emerald-400/80 mb-3 uppercase">Ingreso Total</p>
                                            <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">{formatMoney(incomeValue)}</p>
                                            <button
                                                onClick={() => setShowEditIncome(true)}
                                                className="mt-3 text-[11px] text-white/30 hover:text-white/50 flex items-center gap-1 transition-colors"
                                            >
                                                <Edit2 className="h-3 w-3" /> Editar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Fixed Expenses Node */}
                                    <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity">
                                            <CreditCard className="h-20 w-20 text-[#0A84FF]" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-[11px] font-medium tracking-widest text-[#0A84FF]/80 mb-3 uppercase">Gastos Fijos</p>
                                            <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">{formatMoney(fixedExpensesValue)}</p>
                                            <button
                                                onClick={() => setShowFixedExpenses(true)}
                                                className="mt-3 text-[11px] text-white/30 hover:text-white/50 flex items-center gap-1 transition-colors"
                                            >
                                                <ListPlus className="h-3 w-3" /> Ver detalle
                                            </button>
                                        </div>
                                    </div>

                                    {/* Available Node */}
                                    <div className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity">
                                            <RefreshCw className="h-20 w-20 text-[#30D158]" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-[11px] font-medium tracking-widest text-[#30D158]/80 mb-3 uppercase">Disponible Real</p>
                                            <p className="text-[32px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">{formatMoney(availableForSplit)}</p>
                                            <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#30D158]/50">
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#30D158]" />
                                                <span>Para distribuir</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Strategy Breakdown */}
                                <div className="bg-[#111111]/80 backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[15px] font-medium text-white/90 tracking-tight">Estrategia Activa</h3>
                                        <span className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10 font-medium">
                                            Base DNA
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <StrategyItem label="Ahorros" amount={split.savings} percent={activeStrategy.savings} color="bg-emerald-500" textColor="text-emerald-400" formatMoney={formatMoney} />
                                        <StrategyItem label="Inversiones" amount={split.investment} percent={activeStrategy.investment} color="bg-[#0A84FF]" textColor="text-[#0A84FF]" formatMoney={formatMoney} />
                                        <StrategyItem label="Necesidades" amount={split.needs} percent={activeStrategy.needs} color="bg-[#FF9F0A]" textColor="text-[#FF9F0A]" formatMoney={formatMoney} />
                                        <StrategyItem label="Deseos" amount={split.wants} percent={activeStrategy.wants} color="bg-[#FF453A]" textColor="text-[#FF453A]" formatMoney={formatMoney} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "list" && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                <ExpensesFilters
                                    filters={filters}
                                    onChange={setFilters}
                                    resultCount={filteredTxCount}
                                />
                                <ExpensesList
                                    transactions={txList}
                                    filters={filters}
                                    isLoading={txLoading}
                                />
                            </motion.div>
                        )}

                        {activeTab === "weekly" && (
                            <motion.div
                                key="weekly"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-white/40" />
                                    <span>Desglose Semanal</span>
                                </h3>
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
                                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <p className="text-[11px] font-medium tracking-widest text-white/50 uppercase">Semana {week.weekNumber}</p>
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

                                                    {/* Edit Value */}
                                                    <div className="mt-6 pt-5 border-t border-white/10 relative z-20">
                                                        {editingWeek === week.weekNumber ? (
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    value={editWeekValue}
                                                                    aria-label="Presupuesto semanal"
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
                                                <CalendarIcon className="h-8 w-8 text-white/30" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-white">Sin datos para este período</h3>
                                                <p className="text-sm text-white/40">No se encontraron registros de gastos semanales.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Modals */}
                    <AnimatePresence>
                        {showIncomeLab && <IncomeLab onClose={() => setShowIncomeLab(false)} />}
                        {showFixedExpenses && (
                            <FixedExpensesModal
                                data={detailedExpenses}
                                onClose={() => setShowFixedExpenses(false)}
                            />
                        )}
                        {showEditIncome && kpis && (
                            <IncomeManager
                                isOpen={showEditIncome}
                                onClose={() => setShowEditIncome(false)}
                                currentIncome={kpis.totalIncome}
                                month={data.month}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </PageLayout>
        </PageTransition>
    );
}

function StrategyItem({ label, amount, percent, color, textColor, formatMoney }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", color)} />
                <span className="text-[13px] text-white/70 font-medium">{label}</span>
                <span className="text-[11px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-md font-medium ml-auto">{percent}%</span>
            </div>
            <p className={cn("text-[20px] font-medium font-sans tracking-tight", textColor)}>
                {formatMoney(amount)}
            </p>
        </div>
    );
}
