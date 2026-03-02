"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface HealthScoreProps {
    score: number;
    metrics: {
        savingsRate: number;
        fixedExpensesRatio: number;
        hasDebt: boolean;
    };
}

export function HealthScore({ score, metrics }: HealthScoreProps) {
    let status = "Crítico";
    let ringColor = "#FF453A";

    if (score >= 80) {
        status = "Excelente";
        ringColor = "#30D158";
    } else if (score >= 60) {
        status = "Bien";
        ringColor = "#0A84FF";
    } else if (score >= 40) {
        status = "Regular";
        ringColor = "#FF9F0A";
    }

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

    return (
        <div className="h-full flex flex-col gap-4 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4 mt-[-4px]">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <Activity className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                    Salud Financiera
                </h3>
                <span className="text-[11px] font-medium" style={{ color: ringColor }}>
                    {status}
                </span>
            </div>

            <div className="flex items-center justify-center py-2">
                <div className="relative h-24 w-24 flex items-center justify-center">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 80 80">
                        <circle
                            cx="40" cy="40" r={radius}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="6"
                            fill="transparent"
                        />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            cx="40" cy="40" r={radius}
                            stroke={ringColor}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-semibold text-white tabular-nums">{score}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <MetricItem label="Ahorro" value={`${metrics.savingsRate}%`} isGood={metrics.savingsRate >= 20} />
                <MetricItem label="Fijos" value={`${metrics.fixedExpensesRatio}%`} isGood={metrics.fixedExpensesRatio <= 50} />
                <MetricItem label="Deuda" value={metrics.hasDebt ? "Sí" : "No"} isGood={!metrics.hasDebt} />
            </div>
        </div>
    );
}

function MetricItem({ label, value, isGood }: { label: string; value: string; isGood: boolean }) {
    return (
        <div className="text-center py-1.5">
            <p className="text-[11px] text-white/50 mb-0.5">{label}</p>
            <p className={cn("text-[13px] font-semibold tabular-nums", isGood ? "text-[#30D158]" : "text-[#FF453A]")}>
                {value}
            </p>
        </div>
    );
}
