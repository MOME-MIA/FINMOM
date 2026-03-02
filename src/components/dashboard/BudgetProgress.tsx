"use client";

import { Budget } from "@/types/finance";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { Target } from "lucide-react";

interface BudgetProgressProps {
    budgets: Budget[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
    const { display, convert } = useCurrency();

    const formatMoney = (amount: number) => {
        const converted = convert(amount, 'ARS', display);
        const isExact = converted % 1 === 0;

        if (display === 'USD') {
            return `US$${converted.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        if (display === 'EUR') {
            return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        return `$${converted.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="h-full flex flex-col bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <Target className="h-4 w-4 text-white/50" strokeWidth={1.5} /> Presupuestos
                </h3>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {budgets.map((budget, index) => {
                    const percentage = Math.min(((budget.spent || 0) / budget.budgetLimit) * 100, 100);
                    const isOverLimit = (budget.spent || 0) > budget.budgetLimit;

                    let barColor = "#30D158";
                    if (percentage > 75) barColor = "#FF9F0A";
                    if (percentage > 90) barColor = "#FF453A";

                    return (
                        <motion.div
                            key={budget.categoryId}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="space-y-1.5"
                        >
                            <div className="flex justify-between text-[12px]">
                                <span className="text-white/60">{budget.categoryName || 'Sin categoría'}</span>
                                <span className="text-white/50 tabular-nums">
                                    {formatMoney(budget.spent || 0)} <span className="text-white/50">/ {formatMoney(budget.budgetLimit)}</span>
                                </span>
                            </div>
                            <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: barColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, delay: 0.1 + (index * 0.03), ease: [0.16, 1, 0.3, 1] }}
                                />
                            </div>
                            {isOverLimit && (
                                <p className="text-[11px] text-[#FF453A] text-right tabular-nums">
                                    +{formatMoney((budget.spent || 0) - budget.budgetLimit)}
                                </p>
                            )}
                        </motion.div>
                    );
                })}

                {budgets.length === 0 && (
                    <div className="text-center py-8 text-white/50 text-[13px]">
                        No hay presupuestos definidos.
                    </div>
                )}
            </div>
        </div>
    );
}
