"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Hourglass } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface RunwayWidgetProps {
    months: number;
    burnRate: number;
}

export function RunwayWidget({ months, burnRate }: RunwayWidgetProps) {
    const { display, convert } = useCurrency();
    const displayBurnRate = convert(burnRate, 'ARS', display);

    const formatMoney = (amount: number) => {
        const isExact = amount % 1 === 0;
        if (display === 'USD') return `US$${amount.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (display === 'EUR') return `€${amount.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    const displayMonths = Math.min(months, 12);
    const percentage = (displayMonths / 12) * 100;

    let barColor = "#FF453A";
    let statusColor = "#FF453A";

    if (months >= 6) {
        barColor = "#30D158";
        statusColor = "#30D158";
    } else if (months >= 3) {
        barColor = "#0A84FF";
        statusColor = "#0A84FF";
    } else if (months >= 1) {
        barColor = "#FF9F0A";
        statusColor = "#FF9F0A";
    }

    return (
        <div className="h-full flex flex-col gap-4 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4 mt-[-4px]">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <Hourglass className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                    Margen
                </h3>
                <span className="text-[11px] font-medium" style={{ color: statusColor }}>
                    {months >= 6 ? "Seguro" : months >= 3 ? "Estable" : months >= 1 ? "Bajo" : "Crítico"}
                </span>
            </div>

            <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold text-white tabular-nums">
                    {months === Infinity ? "∞" : months.toFixed(1)}
                </span>
                <span className="text-[13px] text-white/50">meses</span>
            </div>

            {/* Thin progress bar */}
            <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50">
                <span>Quema: {formatMoney(displayBurnRate)}/mes</span>
                <span>Meta: 6 meses</span>
            </div>
        </div>
    );
}
