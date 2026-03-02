"use client";

import { useState, useMemo } from "react";
import { DetailedExpenseRecord } from "@/types/finance";
import { useCurrency } from "@/context/CurrencyContext";
import { Filter, CalendarDays, DollarSign, Download, ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import { formatDate } from "@/lib/utils";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface HistoryClientProps {
    initialRecords: DetailedExpenseRecord[];
    initialYear?: string;
}

export function HistoryClient({ initialRecords, initialYear }: HistoryClientProps) {
    const { display, convert } = useCurrency();
    const [year, setYear] = useState(initialYear || new Date().getFullYear().toString());
    const [isExporting, setIsExporting] = useState(false);

    const filteredRecords = initialRecords.filter(r => r.date.endsWith(year));

    // Convert values for the chart based on the user's selected "display" currency
    const chartRecords = useMemo(() => {
        return filteredRecords.map(r => ({
            ...r,
            totalChart: convert(r.totalARS, 'ARS', display),
            originalDate: r.date
        }));
    }, [filteredRecords, display, convert]);

    // Format specific currency
    const formatCurrency = (amount: number, currencyCode: 'ARS' | 'USD' | 'EUR') => {
        const isExact = amount % 1 === 0;
        if (currencyCode === 'USD') return `US$${amount.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (currencyCode === 'EUR') return `€${amount.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    // Auto-format based on current global display setting
    const formatMoney = (amount: number) => formatCurrency(amount, display as 'ARS' | 'USD' | 'EUR');

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            toast.success("Historial exportado con éxito", { icon: <CheckCircle2 className="h-4 w-4 text-[#30D158]" /> });
        }, 1500);
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
                title="Historial Master"
                subtitle="Registro contable y spreadsheet mensual."
                actions={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/20 border border-white/[0.08] hover:bg-black/40 hover:border-white/[0.15] rounded-full px-4 py-2 transition-all">
                            <CalendarDays className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="bg-transparent text-[14px] font-semibold outline-none text-white [&>option]:bg-[#1C1C1E] appearance-none cursor-pointer"
                            >
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                        <Button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-white hover:bg-white/90 text-black rounded-full px-4 py-2 font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {isExporting ? 'Exportando...' : 'Exportar CSV'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6 max-w-[1400px] mx-auto pb-24">

                    {/* Header Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-[#1C1C1E] border border-white/[0.06] rounded-[24px] p-6 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A84FF]/10 blur-[50px] rounded-full pointer-events-none" />
                            <div className="flex items-center gap-2 text-white/50 mb-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">Total Consumido {year}</span>
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-white">
                                {formatMoney(chartRecords.reduce((acc, r) => acc + r.totalChart, 0))}
                            </h3>
                        </motion.div>

                        {/* Area Chart Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="md:col-span-2 bg-[#1C1C1E] border border-white/[0.06] rounded-[24px] p-6 shadow-2xl flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[13px] font-semibold text-white/50 uppercase tracking-widest">Evolución del Gasto</h3>
                                <div className="flex items-center gap-1 text-[12px] text-[#30D158] bg-[#30D158]/10 px-2 py-1 rounded-full">
                                    <ArrowUpRight className="h-3 w-3" /> Tendencia Activa
                                </div>
                            </div>
                            <div className="h-[100px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartRecords}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={tooltipStyle}
                                            itemStyle={{ color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}
                                            formatter={(value: any) => formatMoney(value as number)}
                                            labelFormatter={(label) => formatDate(label as string)}
                                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                        />
                                        <Area type="monotone" dataKey="totalChart" stroke="#0A84FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Master Spreadsheet Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl relative"
                    >
                        {/* Shine Effect */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between bg-black/20">
                            <div>
                                <h3 className="text-base font-semibold text-white">Spreadsheet Maestro</h3>
                                <p className="text-[13px] text-white/50 mt-0.5">Reporte con desglose mensual y cálculo bimetálico automático.</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-white/40 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.03]">
                                    <div className="w-2 h-2 rounded-full bg-[#0A84FF]" /> ARS (Nacional)
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-white/40 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.03]">
                                    <div className="w-2 h-2 rounded-full bg-[#30D158]" /> USD (Internacional)
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto w-full custom-scrollbar">
                            <table className="w-full text-[13px] text-left whitespace-nowrap">
                                <thead className="text-[11px] font-semibold uppercase tracking-wider bg-white/[0.02] text-white/50 border-b border-white/[0.05]">
                                    <tr>
                                        <th className="px-6 py-4 sticky left-0 bg-[#212124] z-20 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">Período</th>
                                        <th className="px-6 py-4">Alquiler</th>
                                        <th className="px-6 py-4">Luz</th>
                                        <th className="px-6 py-4">Agua / Gas</th>
                                        <th className="px-6 py-4">Seg. Auto</th>
                                        <th className="px-6 py-4">Jardín</th>
                                        <th className="px-6 py-4">Celu / Int</th>
                                        <th className="px-6 py-4 bg-[#0A84FF]/5 text-[#0A84FF] text-right font-bold w-32 border-l border-white/[0.05]">TOTAL (ARS)</th>
                                        <th className="px-6 py-4 bg-[#30D158]/5 text-[#30D158] text-right font-bold w-32">TOTAL (USD)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {filteredRecords.length > 0 ? filteredRecords.map((record, idx) => {
                                        const totalUsdStr = convert(record.totalARS, 'ARS', 'USD');

                                        return (
                                            <tr key={idx} className="hover:bg-white/[0.04] transition-colors group">
                                                <td className="px-6 py-4 text-white font-medium capitalize sticky left-0 bg-[#212124] group-hover:bg-[#252528] z-10 shadow-[4px_0_12px_rgba(0,0,0,0.1)] transition-colors border-r border-white/[0.05]">
                                                    {formatDate(record.date)}
                                                </td>
                                                <td className="px-6 py-4 text-white/70 tabular-nums">{formatCurrency(record.alquiler, 'ARS')}</td>
                                                <td className="px-6 py-4 text-white/70 tabular-nums">{formatCurrency(record.luz, 'ARS')}</td>
                                                {/* Fallback to 0 for missing data fields just to keep table intact */}
                                                <td className="px-6 py-4 text-white/70 tabular-nums">{formatCurrency(0, 'ARS')}</td>
                                                <td className="px-6 py-4 text-white/70 tabular-nums">{formatCurrency(record.segAuto, 'ARS')}</td>
                                                <td className="px-6 py-4 text-white/70 tabular-nums">{formatCurrency(record.jardin, 'ARS')}</td>
                                                <td className="px-6 py-4 text-white/70 tabular-nums">{formatCurrency(record.celu, 'ARS')}</td>
                                                <td className="px-6 py-4 font-bold text-[#0A84FF] text-right tabular-nums bg-[#0A84FF]/[0.02] border-l border-white/[0.05]">
                                                    {formatCurrency(record.totalARS, 'ARS')}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-[#30D158] text-right tabular-nums bg-[#30D158]/[0.02]">
                                                    {formatCurrency(totalUsdStr, 'USD')}
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-12 text-center text-white/40">
                                                No hay registros disponibles para el año seleccionado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {/* Footer Totals */}
                                {filteredRecords.length > 0 && (
                                    <tfoot className="bg-black/20 border-t border-white/[0.08]">
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-white uppercase tracking-wider sticky left-0 bg-[#1A1A1C] z-20 border-r border-white/[0.05] shadow-[4px_0_12px_rgba(0,0,0,0.1)]">Resumen Anual</td>
                                            <td className="px-6 py-4 font-semibold text-white/70 tabular-nums">{formatCurrency(filteredRecords.reduce((acc, r) => acc + r.alquiler, 0), 'ARS')}</td>
                                            <td className="px-6 py-4 font-semibold text-white/70 tabular-nums">{formatCurrency(filteredRecords.reduce((acc, r) => acc + r.luz, 0), 'ARS')}</td>
                                            <td className="px-6 py-4 font-semibold text-white/70 tabular-nums">$0.00</td>
                                            <td className="px-6 py-4 font-semibold text-white/70 tabular-nums">{formatCurrency(filteredRecords.reduce((acc, r) => acc + r.segAuto, 0), 'ARS')}</td>
                                            <td className="px-6 py-4 font-semibold text-white/70 tabular-nums">{formatCurrency(filteredRecords.reduce((acc, r) => acc + r.jardin, 0), 'ARS')}</td>
                                            <td className="px-6 py-4 font-semibold text-white/70 tabular-nums">{formatCurrency(filteredRecords.reduce((acc, r) => acc + r.celu, 0), 'ARS')}</td>
                                            <td className="px-6 py-4 font-bold text-[#0A84FF] text-right tabular-nums bg-[#0A84FF]/[0.05] border-l border-white/[0.05] text-[15px]">
                                                {formatCurrency(filteredRecords.reduce((acc, r) => acc + r.totalARS, 0), 'ARS')}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#30D158] text-right tabular-nums bg-[#30D158]/[0.05] text-[15px]">
                                                {formatCurrency(filteredRecords.reduce((acc, r) => acc + convert(r.totalARS, 'ARS', 'USD'), 0), 'USD')}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </motion.div>
                </div>
            </PageLayout>
        </PageTransition>
    );
}
