"use client";

import { useMemo } from "react";
import { CategorySpending, MonthlyTrend } from "@/types/finance";
import { LiquidCard } from "@/components/ui/liquid/LiquidCard";
import {
    TrendingUp,
    TrendingDown,
    Target,
    ShieldCheck,
    AlertTriangle,
    Zap,
    BrainCircuit,
    ArrowRight
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { cn, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

interface FinancialHealthReportProps {
    spending: CategorySpending[];
    trends: MonthlyTrend[];
}

export function FinancialHealthReport({ spending, trends }: FinancialHealthReportProps) {
    const { display, convert } = useCurrency();

    // Dynamically convert the datasets
    const convertedTrends = useMemo(() => {
        return trends.map(t => ({
            ...t,
            income: convert(t.income, 'ARS', display),
            expenses: convert(t.expenses, 'ARS', display)
        }));
    }, [trends, display, convert]);

    const convertedSpending = useMemo(() => {
        return spending.map(s => ({
            ...s,
            amount: convert(s.amount, 'ARS', display)
        }));
    }, [spending, display, convert]);

    // 1. Calculate Financial Health Score & Metrics
    const metrics = useMemo(() => {
        if (!convertedTrends.length) return null;

        const lastMonth = convertedTrends[convertedTrends.length - 1];
        const prevMonth = convertedTrends.length > 1 ? convertedTrends[convertedTrends.length - 2] : lastMonth;

        const income = lastMonth.income;
        const expenses = lastMonth.expenses;
        const savings = income - expenses;
        const savingsRate = income > 0 ? (savings / income) * 100 : 0;

        const incomeGrowth = prevMonth.income > 0 ? ((income - prevMonth.income) / prevMonth.income) * 100 : 0;
        const expenseGrowth = prevMonth.expenses > 0 ? ((expenses - prevMonth.expenses) / prevMonth.expenses) * 100 : 0;

        // Score Algorithm (0-100)
        let score = 50; // Base
        if (savingsRate > 10) score += 10;
        if (savingsRate > 20) score += 10;
        if (savingsRate > 30) score += 5;
        if (income > expenses) score += 10;
        if (incomeGrowth > 0) score += 5;
        if (expenseGrowth < 0) score += 5;
        if (expenseGrowth < incomeGrowth) score += 5;

        // Cap at 100
        score = Math.min(100, Math.max(0, score));

        return {
            score,
            savingsRate,
            income,
            expenses,
            savings,
            incomeGrowth,
            expenseGrowth
        };
    }, [convertedTrends]);

    if (!metrics) return null;

    // 2. Generate AI Insights
    const insights = [
        {
            type: metrics.savingsRate > 20 ? 'success' : 'warning',
            icon: metrics.savingsRate > 20 ? ShieldCheck : AlertTriangle,
            title: metrics.savingsRate > 20 ? "Tasa de Ahorro Sólida" : "Atención al Ahorro",
            description: metrics.savingsRate > 20
                ? `Estás ahorrando el ${metrics.savingsRate.toFixed(1)}% de tus ingresos. ¡Excelente trabajo!`
                : `Tu tasa de ahorro es del ${metrics.savingsRate.toFixed(1)}%. Intenta llegar al 20%.`
        },
        {
            type: metrics.incomeGrowth > 0 ? 'success' : 'neutral',
            icon: TrendingUp,
            title: "Tendencia de Ingresos",
            description: metrics.incomeGrowth > 0
                ? `Tus ingresos crecieron un ${metrics.incomeGrowth.toFixed(1)}% respecto al mes anterior.`
                : "Tus ingresos se mantienen estables."
        },
        {
            type: 'info',
            icon: BrainCircuit,
            title: "Análisis de Gasto",
            description: "Tu mayor categoría de gasto es 'Vivienda'. Considera optimizar servicios." // Mocked for demo
        }
    ];

    // 3. Prepare Radar Data (Mocked categories mapping for visual appeal)
    const radarData = convertedSpending.slice(0, 5).map(s => ({
        subject: s.categoryName,
        A: s.amount,
        fullMark: Math.max(...convertedSpending.map(i => i.amount))
    }));

    return (
        <div className="space-y-8">
            {/* Hero Section: Score & Key Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Card */}
                <LiquidCard variant="deep" className="relative overflow-hidden lg:col-span-1 border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-teal-500/10" />
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground mb-6">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            Financial IQ
                        </div>
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                {/* Circular Progress Placeholder - using SVG for custom look */}
                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <motion.circle
                                        cx="50" cy="50" r="45" fill="none" stroke={metrics.score > 70 ? "#10b981" : metrics.score > 50 ? "#f59e0b" : "#ef4444"}
                                        strokeWidth="8"
                                        strokeDasharray="283"
                                        strokeDashoffset={283 - (283 * metrics.score) / 100}
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (283 * metrics.score) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-white">{metrics.score}</span>
                                    <span className="text-xs text-muted-foreground">/ 100</span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm font-medium text-white/80">
                                {metrics.score > 80 ? "Salud Financiera Élite" : metrics.score > 60 ? "Saludable" : "Requiere Atención"}
                            </p>
                        </div>
                    </div>
                </LiquidCard>

                {/* Insights Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, idx) => (
                        <LiquidCard key={idx} variant="frosted" className="hover:bg-white/5 transition-colors">
                            <div className="p-6 flex flex-col justify-between h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("p-2 rounded-lg",
                                        insight.type === 'success' ? "bg-emerald-500/10 text-emerald-400" :
                                            insight.type === 'warning' ? "bg-orange-500/10 text-orange-400" :
                                                "bg-blue-500/10 text-blue-400"
                                    )}>
                                        <insight.icon className="h-5 w-5" />
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/50" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                                </div>
                            </div>
                        </LiquidCard>
                    ))}
                    {/* Stat Card */}
                    <LiquidCard variant="neon" className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
                        <div className="p-6 flex flex-col justify-center h-full">
                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-2">Ahorro Neto (Mes)</p>
                            <p className="text-3xl font-bold text-white">${metrics.savings.toLocaleString()}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${Math.min(100, metrics.savingsRate)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-white/60">{metrics.savingsRate.toFixed(0)}%</span>
                            </div>
                        </div>
                    </LiquidCard>
                </div>
            </div>

            {/* Deep Dive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spending DNA (Radar) */}
                <LiquidCard variant="deep" className="p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Target className="h-5 w-5 text-teal-400" />
                        <h3 className="text-lg font-medium text-white">ADN de Gasto</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Gasto"
                                    dataKey="A"
                                    stroke="#14b8a6"
                                    strokeWidth={2}
                                    fill="#14b8a6"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </LiquidCard>

                {/* Trend Analysis (Area) */}
                <LiquidCard variant="deep" className="p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-medium text-white">Flujo de Caja</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={convertedTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => formatDate(val)} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </LiquidCard>
            </div>
        </div>
    );
}
