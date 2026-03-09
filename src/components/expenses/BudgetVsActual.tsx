"use client";

import { Budget } from "@/types/finance";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";
import { Target, AlertTriangle } from "lucide-react";
import { COLORS } from "@/lib/design";

interface BudgetVsActualProps {
    budgets: Budget[];
}

export function BudgetVsActual({ budgets }: BudgetVsActualProps) {
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

    if (!budgets || budgets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white/30" />
                </div>
                <p className="text-[13px] text-white/40 font-medium">Sin presupuestos configurados</p>
                <p className="text-[11px] text-white/25 max-w-[240px]">
                    Configurá límites por categoría para hacer seguimiento de tus gastos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {budgets.map((budget, i) => {
                const spent = budget.spent || 0;
                const limit = budget.budgetLimit;
                const pct = limit > 0 ? Math.min((spent / limit) * 100, 120) : 0;
                const isOver = spent > limit;
                const displayPct = Math.min(pct, 100);

                let barColor: string = COLORS.green;
                if (pct > 90) barColor = COLORS.red;
                else if (pct > 70) barColor = COLORS.orange;

                return (
                    <motion.div
                        key={budget.id || i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {budget.categoryIcon && (
                                    <span className="text-[14px]">{budget.categoryIcon}</span>
                                )}
                                <span className="text-[13px] text-white/80 font-medium">
                                    {budget.categoryName || 'Sin categoría'}
                                </span>
                                {isOver && (
                                    <AlertTriangle className="h-3.5 w-3.5 text-[#FF453A]" />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[13px] font-medium tabular-nums font-sans",
                                    isOver ? "text-[#FF453A]" : "text-white/60"
                                )}>
                                    {formatMoney(spent, budget.currencyCode)}
                                </span>
                                <span className="text-[11px] text-white/25 font-medium">/</span>
                                <span className="text-[12px] text-white/40 tabular-nums font-medium">
                                    {formatMoney(limit, budget.currencyCode)}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${displayPct}%` }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.05 }}
                                className="h-full rounded-full transition-colors"
                                style={{ backgroundColor: barColor }}
                            />
                        </div>

                        <div className="flex justify-end">
                            <span className={cn(
                                "text-[10px] font-medium tabular-nums",
                                isOver ? "text-[#FF453A]" : "text-white/30"
                            )}>
                                {Math.round(pct)}%
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
