"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/CountUp";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/types/finance";

interface KPICardProps {
    title: string;
    /** Raw amount (in its source currency) */
    amount: number;
    icon: LucideIcon;
    status?: "success" | "warning" | "danger" | "neutral";
    subtext?: string;
    color?: string;
    className?: string;
    /** Source currency of the amount. Defaults to user's display currency (no conversion). */
    currencyCode?: CurrencyCode;
    /** If true, skip currency conversion (e.g., for counts or percentages) */
    skipConversion?: boolean;
}

export function KPICard({ title, amount, icon: Icon, status = "neutral", subtext, color, className, currencyCode, skipConversion }: KPICardProps) {
    const { display, convert } = useCurrency();

    const statusColor = status === 'success' ? 'text-[#30D158]'
        : status === 'warning' ? 'text-[#FF9F0A]'
            : status === 'danger' ? 'text-[#FF453A]'
                : 'text-white/50';

    // Convert amount to user's preferred display currency
    let displayAmount = amount;
    let currencySymbol = '$';

    if (!skipConversion && currencyCode) {
        // Convert from source currency to display currency
        displayAmount = convert(amount, currencyCode, display);
        currencySymbol = display === 'USD' ? 'US$' : display === 'EUR' ? '€' : '$';
    } else if (!skipConversion && display === 'USD') {
        // Legacy behavior: assume ARS and convert to USD
        displayAmount = convert(amount, 'ARS', 'USD');
        currencySymbol = 'US$';
    } else if (!skipConversion && display === 'EUR') {
        displayAmount = convert(amount, 'ARS', 'EUR');
        currencySymbol = '€';
    } else if (skipConversion) {
        currencySymbol = '';
    }

    return (
        <div className={cn(
            "glass-obsidian p-4 flex flex-col gap-3 transition-colors duration-200 hover:bg-white/[0.04]",
            className
        )}>
            <div className="flex items-center justify-between">
                <Icon className={cn("h-4 w-4", color || "text-white/50")} strokeWidth={1.5} />
                {status !== 'neutral' && (
                    <span className={cn("text-[11px] font-medium", statusColor)}>
                        {status === 'success' ? '↑' : status === 'danger' ? '↓' : '–'}
                    </span>
                )}
            </div>

            <div>
                <p className="text-[11px] font-medium text-white/50 uppercase tracking-wide mb-1">{title}</p>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-[13px] font-normal text-white/50">{currencySymbol}</span>
                    <CountUp
                        value={displayAmount}
                        className="text-[22px] font-semibold tracking-tight text-white tabular-nums"
                    />
                </div>
                {subtext && (
                    <p className="text-[11px] text-white/50 mt-1">{subtext}</p>
                )}
            </div>
        </div>
    );
}
