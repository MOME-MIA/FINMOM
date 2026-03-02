"use client";
import { useState, useEffect } from "react";
import { SummaryData } from "@/types/finance";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "@/context/CurrencyContext";
import { PieChart } from "lucide-react";

interface SummaryChartsProps {
    data: SummaryData;
}

const APPLE_COLORS = {
    fixed: '#FF453A',       // systemRed (Fixed expenses)
    savings: '#0A84FF',     // systemBlue (Savings)
    investments: '#BF5AF2', // systemPurple (Investments)
    free: '#30D158',        // systemGreen (Free/Discretionary)
};

export function SummaryCharts({ data }: SummaryChartsProps) {
    const { display } = useCurrency();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatMoney = (amount: number) => {
        const isExact = amount % 1 === 0;
        if (display === 'USD') return `US$${amount.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (display === 'EUR') return `€${amount.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    const pieData = [
        { name: "Gastos Fijos", value: data.fixedExpenses, color: APPLE_COLORS.fixed },
        { name: "Ahorros", value: data.savings, color: APPLE_COLORS.savings },
        { name: "Inversiones", value: data.investments, color: APPLE_COLORS.investments },
        { name: "Libre", value: data.freeForExtras, color: APPLE_COLORS.free },
    ].filter(item => item.value > 0); // Only show non-zero segments to keep it clean

    return (
        <div className="h-full flex flex-col bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4 mt-[-4px]">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                    Distribución
                </h3>
            </div>
            <div className="flex-1 flex flex-col">
                <div className="h-[200px] w-full relative flex items-center justify-center">
                    {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={72}  // Thinner ring for elegance
                                    outerRadius={84}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                                            style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}40)` }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => [formatMoney(value as number), 'Monto']}
                                    contentStyle={{
                                        backgroundColor: '#1C1C1E',
                                        borderColor: 'rgba(255, 255, 255, 0.08)',
                                        borderRadius: '12px',
                                        color: '#FFFFFF',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                                        padding: '10px 14px',
                                        fontSize: '13px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 600 }}
                                    labelStyle={{ display: 'none' }}
                                    cursor={false}
                                />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    )}

                    {/* Center Label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-[11px] text-white/50 font-medium block mb-1 tracking-wider uppercase">Ingresos</span>
                            <span className="text-lg font-semibold text-white/90 tabular-nums tracking-tight">
                                {formatMoney(data.totalIncome)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Elegant Legend Hierarchy */}
                <div className="flex flex-col gap-2.5 mt-6">
                    {pieData.map((item) => {
                        const percentage = data.totalIncome > 0 ? (item.value / data.totalIncome) * 100 : 0;
                        return (
                            <div key={item.name} className="flex items-center justify-between text-[13px] px-1 hover:bg-white/[0.02] p-1.5 -mx-1.5 rounded-lg transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}60` }}
                                    />
                                    <span className="text-white/60 font-medium tracking-wide">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/90 font-semibold tabular-nums tracking-tight">{formatMoney(item.value)}</span>
                                    <span className="text-white/50 text-[11px] tabular-nums font-bold w-9 text-right">{Math.round(percentage)}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
