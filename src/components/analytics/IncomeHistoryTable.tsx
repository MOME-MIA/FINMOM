"use client";

import { IncomeRecord } from "@/types/finance";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { LiquidCard } from "@/components/ui/liquid/LiquidCard";
import { useCurrency } from "@/context/CurrencyContext";

interface IncomeHistoryTableProps {
    data: IncomeRecord[];
}

export function IncomeHistoryTable({ data }: IncomeHistoryTableProps) {
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

    const formatPercent = (val: number) => `${val.toFixed(1)}%`;

    return (
        <LiquidCard variant="deep" className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span>Ingresos Egresos</span>
                <span className="text-xs font-normal text-muted-foreground bg-white/5 px-2 py-1 rounded-full">Histórico</span>
            </h3>

            <div className="overflow-x-auto -mx-6 px-6 pb-4 relative z-10">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-white/10">
                                <TableHead className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Fecha</TableHead>
                                <TableHead className="text-xs font-bold text-white uppercase tracking-wider text-right whitespace-nowrap">Egresos Totales</TableHead>
                                <TableHead className="text-xs font-bold text-emerald-400 uppercase tracking-wider text-right whitespace-nowrap">Ingresos Totales</TableHead>
                                <TableHead className="text-xs font-bold text-yellow-400 uppercase tracking-wider text-right whitespace-nowrap">Ahorro Neto</TableHead>
                                <TableHead className="text-xs font-bold text-white uppercase tracking-wider text-right whitespace-nowrap">Ahorro %</TableHead>
                                <TableHead className="text-xs font-bold text-white uppercase tracking-wider text-right whitespace-nowrap">Margen %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, i) => (
                                <TableRow key={i} className="hover:bg-white/5 border-white/5 transition-colors">
                                    <TableCell className="font-mono text-xs text-white/80 whitespace-nowrap">{row.date}</TableCell>
                                    <TableCell className="font-mono text-xs text-right text-red-300 whitespace-nowrap">{formatMoney(row.gastosTotalesARS || (row.gastosUSD * row.usdRef), 'ARS')}</TableCell>
                                    <TableCell className="font-mono text-xs text-right font-bold text-emerald-400 whitespace-nowrap">{formatMoney(row.cobroMensual, 'USD')}</TableCell>
                                    <TableCell className="font-mono text-xs text-right font-bold text-yellow-400 whitespace-nowrap">{formatMoney(row.ahorro, 'USD')}</TableCell>
                                    <TableCell className={cn(
                                        "font-mono text-xs text-right font-bold whitespace-nowrap",
                                        row.ahorroPercent > 10 ? "text-emerald-400" : "text-white/50"
                                    )}>
                                        {formatPercent(row.ahorroPercent)}
                                    </TableCell>
                                    <TableCell className={cn(
                                        "font-mono text-xs text-right font-bold whitespace-nowrap",
                                        row.margenPercent > 20 ? "text-emerald-400" : "text-white/50"
                                    )}>
                                        {formatPercent(row.margenPercent)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </LiquidCard>
    );
}
