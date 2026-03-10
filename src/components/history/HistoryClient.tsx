"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/types/finance";
import { useCurrency } from "@/context/CurrencyContext";
import { CalendarDays, Download, CheckCircle2, ArrowUp, ArrowDown, Filter } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { formatDate } from "@/lib/utils";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function HistoryClient({ initialRecords }: { initialRecords: Transaction[] }) {
    const { display, convert } = useCurrency();
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [isExporting, setIsExporting] = useState(false);

    // 1. Filter by Year and Type
    const filteredRecords = useMemo(() => {
        return initialRecords.filter(r => {
            const matchYear = year === 'all' || r.date.startsWith(year);
            const matchType = filterType === 'all' || r.type === filterType;
            return matchYear && matchType;
        });
    }, [initialRecords, year, filterType]);

    // 2. Aggregate Data for Chart (Monthly Income vs Expense in display currency)
    const chartData = useMemo(() => {
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const data = months.map(m => {
            const prefix = year === 'all' ? new Date().getFullYear().toString() : year;
            const monthStr = `${prefix}-${m}`;

            const monthTxs = initialRecords.filter(tx => tx.date.startsWith(monthStr));
            let income = 0;
            let expense = 0;

            monthTxs.forEach(tx => {
                const amountDisp = convert(tx.amount, tx.currencyCode as any, display);
                if (tx.type === 'income') income += amountDisp;
                else expense += amountDisp;
            });

            return {
                name: formatMonthLabel(m),
                ingresos: income,
                gastos: expense,
            };
        });

        // Filter out future months if current year
        if (year === new Date().getFullYear().toString()) {
            const currentMonth = new Date().getMonth() + 1;
            return data.slice(0, currentMonth);
        }
        return data;
    }, [initialRecords, year, display, convert]);

    function formatMonthLabel(m: string) {
        const names = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return names[parseInt(m) - 1];
    }

    const formatMoney = (amount: number, currencyCode: any = display) => {
        let value = amount;
        if (currencyCode !== display) {
            value = convert(amount, currencyCode, display);
        }

        const isExact = value % 1 === 0;
        if (display === 'USD') return `US$${value.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (display === 'EUR') return `€${value.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${value.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    const handleExport = () => {
        setIsExporting(true);
        // Simple CSV generation
        let csvContent = "data:text/csv;charset=utf-8,Fecha,Tipo,MontoOriginal,MonedaOriginal,Descripcion,Categoria,Cuenta\n";
        filteredRecords.forEach(row => {
            csvContent += `${row.date},${row.type},${row.amount},${row.currencyCode},"${row.description}","${row.categoryName || ''}","${row.accountName || ''}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `finmom_historial_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setIsExporting(false);
            toast.success("Historial exportado con éxito", { icon: <CheckCircle2 className="h-4 w-4 text-[#30D158]" /> });
        }, 500);
    };

    const tooltipStyle = {
        backgroundColor: 'rgba(28, 28, 30, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        color: '#FFFFFF',
        fontSize: '13px',
        padding: '12px 16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    };

    return (
        <PageTransition>
            <PageLayout
                title="Historial de Transacciones"
                subtitle="El registro maestro de tus movimientos."
                actions={
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-full px-3 py-1.5 transition-all">
                            <Filter className="h-3.5 w-3.5 text-white/50" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="bg-transparent text-[13px] font-medium outline-none text-white [&>option]:bg-[#1C1C1E] appearance-none cursor-pointer"
                            >
                                <option value="all">Filtro: Todo</option>
                                <option value="income">Sólo Ingresos</option>
                                <option value="expense">Sólo Gastos</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] rounded-full px-3 py-1.5 transition-all">
                            <CalendarDays className="h-3.5 w-3.5 text-white/50" />
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="bg-transparent text-[13px] font-medium outline-none text-white [&>option]:bg-[#1C1C1E] appearance-none cursor-pointer"
                            >
                                <option value="all">Año: Todos</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                        <Button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-white hover:bg-white/90 text-black rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ml-auto sm:ml-0"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            {isExporting ? 'Exportando...' : 'Exportar CSV'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6 max-w-[1400px] mx-auto pb-24">
                    {/* Area Chart Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col"
                    >
                        <h3 className="text-[13px] font-bold text-white/40 uppercase tracking-widest mb-6">Flujo de Caja Anual ({year === 'all' ? 'Histórico' : year})</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#30D158" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF453A" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FF453A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} className="text-white/40" />
                                    <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} className="text-white/40" tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        itemStyle={{ fontWeight: 'bold' }}
                                        formatter={(value: any) => formatMoney(value as number)}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" name="Ingresos" dataKey="ingresos" stroke="#30D158" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" name="Gastos" dataKey="gastos" stroke="#FF453A" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Master List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl relative"
                    >
                        <div className="overflow-x-auto w-full custom-scrollbar">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="text-[11px] font-bold uppercase tracking-wider bg-white/[0.02] text-white/40 border-b border-white/[0.05]">
                                    <tr>
                                        <th className="px-5 py-4">Fecha</th>
                                        <th className="px-5 py-4">Categoría</th>
                                        <th className="px-5 py-4">Descripción</th>
                                        <th className="px-5 py-4">Cuenta</th>
                                        <th className="px-5 py-4 text-right">Monto Original</th>
                                        <th className="px-5 py-4 text-right">Equivalente ({display})</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {filteredRecords.length > 0 ? filteredRecords.map((tx) => {
                                        const isIncome = tx.type === 'income';

                                        return (
                                            <tr key={tx.id} className="hover:bg-white/[0.04] transition-colors group">
                                                <td className="px-5 py-4 text-[13px] text-white/50 group-hover:text-white/70 transition-colors">
                                                    {formatDate(tx.date)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 rounded-full flex items-center justify-center bg-black/40 border border-white/[0.06]"
                                                            style={tx.categoryColor ? { color: tx.categoryColor, borderColor: `${tx.categoryColor}40` } : undefined}
                                                        >
                                                            {isIncome ? (
                                                                <ArrowUp className="h-3 w-3 text-[#30D158]" />
                                                            ) : (
                                                                <span className="text-[10px]">{tx.categoryIcon || <ArrowDown className="h-3 w-3 text-white/50" />}</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[13px] font-medium text-white/90">{tx.categoryName || 'General'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-[13px] text-white/70">
                                                    {tx.description || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-[13px] text-white/60">
                                                    {tx.accountName || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-right text-[13px] font-medium text-white/60 tabular-nums">
                                                    {tx.currencyCode} {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className={`px-5 py-4 font-bold text-right text-[14px] tabular-nums ${isIncome ? 'text-[#30D158]' : 'text-white'}`}>
                                                    {isIncome ? '+' : '-'}{formatMoney(tx.amount, tx.currencyCode)}
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-16 text-center text-white/30 text-[13px] font-medium">
                                                No hay registros encontrados con los filtros actuales.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </PageLayout>
        </PageTransition>
    );
}
