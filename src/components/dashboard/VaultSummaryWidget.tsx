"use client";

import { DimAccount } from "@/types/finance";
import { useCurrency } from "@/context/CurrencyContext";
import { Wallet, Landmark, CreditCard, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface VaultSummaryWidgetProps {
    accounts: DimAccount[];
}

export function VaultSummaryWidget({ accounts }: VaultSummaryWidgetProps) {
    const { display, convert } = useCurrency();

    const activeAccounts = accounts.filter(a => a.isActive);

    const formatMoney = (amount: number, sourceCurrency: any) => {
        const converted = convert(amount, sourceCurrency, display);
        const isExact = converted % 1 === 0;

        if (display === 'USD') return `US$${converted.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (display === 'EUR') return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${converted.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    const getIcon = (provider: string) => {
        const p = provider.toLowerCase();
        if (p.includes('bank') || p.includes('banco') || p.includes('brubank')) return <Landmark className="h-4 w-4" strokeWidth={1.5} />;
        if (p.includes('card') || p.includes('tarjeta')) return <CreditCard className="h-4 w-4" strokeWidth={1.5} />;
        if (p.includes('cash') || p.includes('efectivo')) return <Wallet className="h-4 w-4" strokeWidth={1.5} />;
        return <Box className="h-4 w-4" strokeWidth={1.5} />;
    };

    return (
        <div className="h-full flex flex-col gap-4 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                    Cuentas
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
                {activeAccounts.slice(0, 4).map((acc) => (
                    <div key={acc.id} className="p-3 rounded-[20px] bg-white/[0.015] flex flex-col justify-between hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/[0.02]">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-6 w-6 rounded-full flex items-center justify-center bg-white/10"
                                    style={{ color: acc.color || '#fff' }}
                                >
                                    {getIcon(acc.provider)}
                                </div>
                                <span className="text-[12px] font-medium text-white/80 truncate w-16">{acc.name}</span>
                            </div>
                            <span className="text-[10px] text-white/50 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded-md">{acc.currencyCode}</span>
                        </div>
                        <span className="text-[14px] font-semibold text-white tabular-nums">
                            {formatMoney(acc.currentBalance, acc.currencyCode)}
                        </span>
                    </div>
                ))}

                {activeAccounts.length === 0 && (
                    <div className="col-span-2 text-center text-[12px] text-white/50 py-4">
                        No hay cuentas activas.
                    </div>
                )}
            </div>

            {activeAccounts.length > 4 && (
                <div className="flex justify-center mt-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest cursor-pointer hover:text-white/50 transition-colors">
                        + {activeAccounts.length - 4} más
                    </span>
                </div>
            )}
        </div>
    );
}
