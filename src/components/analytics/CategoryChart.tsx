"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { CategorySpending } from "@/types/finance";

interface CategoryChartProps {
    data: CategorySpending[];
    onCategoryClick?: (category: string) => void;
}

export function CategoryChart({ data, onCategoryClick }: CategoryChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="bg-void-950 border-white/10 text-white h-full">
                <CardHeader>
                    <CardTitle>Gastos por Categoría</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No hay datos disponibles
                </CardContent>
            </Card>
        );
    }

    // Filter out tiny values for cleaner chart
    const chartData = data.filter(d => d.percentage > 1);
    const otherData = data.filter(d => d.percentage <= 1);

    if (otherData.length > 0) {
        const otherTotal = otherData.reduce((sum, d) => sum + d.amount, 0);
        chartData.push({
            categoryId: 'other',
            categoryName: "Otros",
            categoryIcon: '📌',
            categoryColor: '#6b7280',
            amount: otherTotal,
            percentage: 0,
        });
    }

    return (
        <Card className="bg-void-950 border-white/10 text-white h-full">
            <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={72}
                                outerRadius={84}
                                paddingAngle={3}
                                dataKey="amount"
                                nameKey="categoryName"
                                onClick={(data) => onCategoryClick && onCategoryClick(data.categoryName)}
                                className={onCategoryClick ? "cursor-pointer outline-none" : ""}
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.categoryColor || `hsl(${index * 45}, 70%, 50%)`}
                                        className="hover:opacity-80 transition-opacity duration-200"
                                        style={entry.categoryColor ? { filter: `drop-shadow(0px 0px 8px ${entry.categoryColor}40)` } : {}}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => formatCurrency(value as number, 'ARS')}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
