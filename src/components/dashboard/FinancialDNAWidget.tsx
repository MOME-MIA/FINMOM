"use client";

import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid/LiquidCard";
import { Fingerprint, Target, Sparkles, Home, Wallet } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface FinancialDNAWidgetProps {
    availableForSplit: number; // Income - Fixed Expenses
    activeStrategy?: {
        savings: number;
        investment: number;
        needs: number;
        wants: number;
    };
}

const DEFAULT_STRATEGY = { savings: 20, investment: 10, needs: 50, wants: 20 };

export function FinancialDNAWidget({ availableForSplit, activeStrategy = DEFAULT_STRATEGY }: FinancialDNAWidgetProps) {
    const { display, convert } = useCurrency();

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: display,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Ensure we don't calculate on negative available
    const baseAmount = Math.max(0, availableForSplit);

    const dnaPillars = [
        { id: 'needs', label: 'Necesidades', percent: activeStrategy.needs, amount: baseAmount * (activeStrategy.needs / 100), icon: Home, color: 'bg-blue-500', text: 'text-blue-400' },
        { id: 'wants', label: 'Deseos', percent: activeStrategy.wants, amount: baseAmount * (activeStrategy.wants / 100), icon: Sparkles, color: 'bg-orange-500', text: 'text-orange-400' },
        { id: 'savings', label: 'Ahorros', percent: activeStrategy.savings, amount: baseAmount * (activeStrategy.savings / 100), icon: Wallet, color: 'bg-emerald-500', text: 'text-emerald-400' },
        { id: 'investment', label: 'Inversiones', percent: activeStrategy.investment, amount: baseAmount * (activeStrategy.investment / 100), icon: Target, color: 'bg-purple-500', text: 'text-purple-400' },
    ];

    return (
        <LiquidCard variant="deep" className="p-5 flex flex-col justify-between relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Fingerprint className="h-4 w-4 text-white/70" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-tight">ADN Financiero</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Distribución Estratégica</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-white tabular-nums tracking-tight">
                        {formatMoney(convert(baseAmount, 'ARS', display))}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Capital a Distribuir</p>
                </div>
            </div>

            <div className="flex-1 space-y-3 mt-2">
                {dnaPillars.map((pillar, idx) => (
                    <div key={pillar.id} className="relative group">
                        <div className="flex justify-between items-end mb-1">
                            <div className="flex items-center gap-1.5">
                                <pillar.icon className={cn("h-3.5 w-3.5", pillar.text)} strokeWidth={1.5} />
                                <span className="text-xs font-medium text-white/80">{pillar.label}</span>
                                <span className="text-[10px] text-white/50 ml-1">{pillar.percent}%</span>
                            </div>
                            <span className="text-xs font-semibold text-white tabular-nums">
                                {formatMoney(convert(pillar.amount, 'ARS', display))}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className={cn("h-full rounded-full opacity-80", pillar.color)}
                                initial={{ width: 0 }}
                                animate={{ width: `${pillar.percent}%` }}
                                transition={{ duration: 0.8, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </LiquidCard>
    );
}
