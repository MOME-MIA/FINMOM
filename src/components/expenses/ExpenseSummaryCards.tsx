"use client";

import { DashboardKPIs, CategorySpending, Budget } from "@/types/finance";
import { TrendingDown, CalendarDays, Tag, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";

interface ExpenseSummaryCardsProps {
    kpis: DashboardKPIs | null;
    topCategory: CategorySpending | null;
    budgets: Budget[];
    txCount: number;
    daysInMonth: number;
}

const cardBase = "group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]";
const topLine = "absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30";

export function ExpenseSummaryCards({ kpis, topCategory, budgets, txCount, daysInMonth }: ExpenseSummaryCardsProps) {
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

    const totalExpenses = kpis?.totalExpenses || 0;
    const dailyAvg = daysInMonth > 0 ? totalExpenses / daysInMonth : 0;

    // Budget utilization
    const totalBudget = budgets.reduce((sum, b) => sum + b.budgetLimit, 0);
    const budgetPct = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : null;

    const cards = [
        {
            label: "Gasto Total",
            value: formatMoney(totalExpenses),
            icon: TrendingDown,
            iconColor: "text-[#FF453A]",
            iconBg: "text-[#FF453A]",
            sublabel: budgetPct !== null ? `${budgetPct}% del presupuesto` : undefined,
            sublabelColor: budgetPct !== null && budgetPct > 100 ? "text-[#FF453A]" : "text-white/40",
        },
        {
            label: "Promedio Diario",
            value: formatMoney(dailyAvg),
            icon: CalendarDays,
            iconColor: "text-[#0A84FF]",
            iconBg: "text-[#0A84FF]",
            sublabel: `${daysInMonth} días`,
            sublabelColor: "text-white/40",
        },
        {
            label: "Categoría Top",
            value: topCategory?.categoryName || "N/A",
            icon: Tag,
            iconColor: "text-[#FF9F0A]",
            iconBg: "text-[#FF9F0A]",
            sublabel: topCategory ? `${topCategory.percentage.toFixed(1)}% del total` : undefined,
            sublabelColor: "text-white/40",
            isText: true,
        },
        {
            label: "Transacciones",
            value: txCount.toString(),
            icon: BarChart3,
            iconColor: "text-[#30D158]",
            iconBg: "text-[#30D158]",
            sublabel: `${Math.round(txCount / Math.max(daysInMonth, 1) * 10) / 10} por día`,
            sublabelColor: "text-white/40",
            isText: true,
        },
    ];

    return (
        <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
        >
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    variants={{
                        hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                    }}
                    className={cardBase}
                >
                    <div className={topLine} />

                    {/* Background Icon */}
                    <div className="absolute top-0 right-0 p-5 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity">
                        <card.icon className={cn("h-20 w-20", card.iconBg)} />
                    </div>

                    <div className="relative z-10">
                        <p className="text-[11px] font-medium tracking-widest text-white/50 mb-3 uppercase">
                            {card.label}
                        </p>
                        <p className={cn(
                            "font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm",
                            card.isText ? "text-[22px] sm:text-[26px] truncate" : "text-[28px] sm:text-[32px]"
                        )}>
                            {card.value}
                        </p>
                        {card.sublabel && (
                            <p className={cn("text-[12px] mt-2 font-medium", card.sublabelColor)}>
                                {card.sublabel}
                            </p>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
