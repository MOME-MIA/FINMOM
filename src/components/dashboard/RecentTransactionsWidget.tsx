"use client";

import { Transaction } from "@/types/finance";
import { ArrowDown, ArrowUp, Activity } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface RecentTransactionsWidgetProps {
    transactions: Transaction[];
}

export function RecentTransactionsWidget({ transactions }: RecentTransactionsWidgetProps) {
    const { display, convert } = useCurrency();

    // Get top 4 most recent transactions
    const recentTx = transactions.slice(0, 4);

    const formatMoney = (amount: number, sourceCurrency: any) => {
        const converted = convert(amount, sourceCurrency, display);
        const isExact = converted % 1 === 0;

        if (display === 'USD') return `US$${converted.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (display === 'EUR') return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${converted.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="h-full flex flex-col bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="pb-4 flex justify-between items-center border-b border-white/[0.02] mb-2">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <Activity className="h-4 w-4 text-white/50" strokeWidth={1.5} /> Actividad Reciente
                </h3>
                <Link href="/dashboard/history" className="text-[11px] text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors tracking-wide">
                    Ver todo
                </Link>
            </div>

            <div className="flex-1 flex flex-col p-2">
                {recentTx.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[12px] text-white/50">
                        No hay transacciones recientes.
                    </div>
                ) : (
                    recentTx.map((tx) => {
                        const isIncome = tx.type === 'income';

                        return (
                            <div key={tx.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded-full flex items-center justify-center bg-black/40 border border-white/[0.06]"
                                        style={!isIncome && tx.categoryColor ? { color: tx.categoryColor, borderColor: `${tx.categoryColor}40` } : undefined}
                                    >
                                        {isIncome ? (
                                            <ArrowUp className="h-3.5 w-3.5 text-[#30D158]" strokeWidth={1.5} />
                                        ) : (
                                            <span className="text-[14px]">{tx.categoryIcon || <ArrowDown className="h-3.5 w-3.5 text-white/50" strokeWidth={1.5} />}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-medium text-white/90 truncate max-w-[120px]" title={tx.description || tx.categoryName || 'Movimiento'}>
                                            {tx.description || tx.categoryName || 'Movimiento'}
                                        </span>
                                        <span className="text-[10px] text-white/50 capitalize">
                                            {formatDate(tx.date)}
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-[13px] font-semibold tabular-nums ${isIncome ? 'text-[#30D158]' : 'text-white/80'}`}>
                                    {isIncome ? '+' : '-'}{formatMoney(tx.amount, tx.currencyCode)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
