"use client";

import { motion } from "framer-motion";
import { LiquidCard } from "@/components/ui/liquid/LiquidCard";
import { Fingerprint, Target, Sparkles, Home, Wallet, Medal, Activity } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface FinancialDNAWidgetProps {
    income: number;
    fixed: number;
    variable: number;
    savings: number;
    investments: number;
}

export function FinancialDNAWidget({ income, fixed, variable, savings, investments }: FinancialDNAWidgetProps) {
    const { display, convert } = useCurrency();

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: display,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Prevent division by zero
    const safeIncome = income > 0 ? income : 1;

    // Real Percentages
    const pFixed = (fixed / safeIncome) * 100;
    const pVariable = (variable / safeIncome) * 100;
    const pSavings = ((savings + investments) / safeIncome) * 100;

    // SCORING ALGORITHM: 50/30/20 Rule Deviation
    // Ideal: Fixed <= 50%, Variable <= 30%, Savings >= 20%
    let score = 100;
    if (pFixed > 50) score -= (pFixed - 50) * 1.5; // Penalize high fixed costs heavier
    if (pVariable > 30) score -= (pVariable - 30) * 1.0;
    if (pSavings < 20) score -= (20 - pSavings) * 2.0; // Heavily penalize low savings

    score = Math.max(0, Math.min(100, Math.round(score)));

    // Medal Logic
    let medalToken = "Bronce";
    let medalColor = "text-[#CD7F32]";
    let bgMedal = "bg-[#CD7F32]/10";
    if (score >= 90) { medalToken = "Platino"; medalColor = "text-indigo-400"; bgMedal = "bg-indigo-400/10"; }
    else if (score >= 75) { medalToken = "Oro"; medalColor = "text-yellow-400"; bgMedal = "bg-yellow-400/10"; }
    else if (score >= 60) { medalToken = "Plata"; medalColor = "text-zinc-300"; bgMedal = "bg-zinc-300/10"; }

    const dnaPillars = [
        { id: 'needs', label: 'Estructura (Gastos Fijos)', percent: Math.round(pFixed), target: 50, amount: fixed, icon: Home, color: pFixed <= 50 ? 'bg-blue-500' : 'bg-red-500', text: 'text-blue-400' },
        { id: 'wants', label: 'Estilo de vida (Variables)', percent: Math.round(pVariable), target: 30, amount: variable, icon: Sparkles, color: pVariable <= 30 ? 'bg-orange-500' : 'bg-red-400', text: 'text-orange-400' },
        { id: 'savings', label: 'Acumulación (Ahorro/Inv)', percent: Math.round(pSavings), target: 20, amount: savings + investments, icon: Wallet, color: pSavings >= 20 ? 'bg-emerald-500' : 'bg-zinc-500', text: 'text-emerald-400' },
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
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tu perfil de gasto</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/5", bgMedal)}>
                        <Medal className={cn("h-3.5 w-3.5", medalColor)} />
                        <span className={cn("text-xs font-bold tracking-tight", medalColor)}>{medalToken}</span>
                    </div>
                    <span className="text-[10px] text-white/40 mt-1 font-medium tracking-wider">SCORE: {score}/100</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 mt-2">
                {dnaPillars.map((pillar, idx) => {
                    const progressVal = Math.min(100, pillar.percent);
                    return (
                        <div key={pillar.id} className="relative group">
                            <div className="flex justify-between items-end mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    <pillar.icon className={cn("h-3.5 w-3.5", pillar.text)} strokeWidth={1.5} />
                                    <span className="text-xs font-medium text-white/80">{pillar.label}</span>
                                </div>
                                <span className={cn(
                                    "text-xs font-semibold tabular-nums",
                                    pillar.percent > pillar.target && pillar.id !== 'savings' ? "text-[#FF453A]" : "text-white"
                                )}>
                                    {formatMoney(convert(pillar.amount, 'ARS', display))}
                                    <span className="text-[10px] text-white/50 ml-1 font-normal">({pillar.percent}%)</span>
                                </span>
                            </div>
                            <div className="relative">
                                {/* Base track */}
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={cn("h-full rounded-full opacity-80", pillar.color)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressVal}%` }}
                                        transition={{ duration: 0.8, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                                {/* Target guide mark */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/40 rounded-full z-10"
                                    style={{ left: `${pillar.target}%` }}
                                    title={`Objetivo: ${pillar.target}%`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {income === 0 && (
                <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <p className="text-xs text-white/50 font-medium">Registra ingresos para calcular tu ADN</p>
                </div>
            )}
        </LiquidCard>
    );
}
