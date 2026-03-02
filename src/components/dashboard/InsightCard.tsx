"use client";

import { Lightbulb, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Insight } from "@/lib/insights";

interface InsightCardProps {
    insight?: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
    const defaultInsight: Insight = {
        type: 'info',
        message: "Analizando tus finanzas...",
        priority: 0
    };

    const activeInsight = insight || defaultInsight;

    const config = {
        success: { title: "Viene bien", icon: TrendingUp, color: "#30D158" },
        warning: { title: "Atención", icon: AlertCircle, color: "#FF9F0A" },
        danger: { title: "Alerta", icon: TrendingDown, color: "#FF453A" },
        info: { title: "Análisis", icon: Lightbulb, color: "#0A84FF" },
    }[activeInsight.type] || { title: "Análisis", icon: Lightbulb, color: "#0A84FF" };

    const Icon = config.icon;

    return (
        <div className="h-full flex flex-col gap-4 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4 mt-[-4px]">
                <h3 className="text-[12px] font-medium uppercase tracking-wide flex items-center gap-2" style={{ color: config.color }}>
                    <Icon className="h-4 w-4" style={{ color: config.color }} strokeWidth={1.5} />
                    {config.title}
                </h3>
            </div>
            <p className="text-[14px] text-white/70 leading-relaxed font-light">
                {activeInsight.message}
            </p>
        </div>
    );
}
