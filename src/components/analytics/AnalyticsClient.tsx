"use client";

import { CategorySpending, MonthlyTrend, IncomeRecord } from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Cell
} from "recharts";
import { formatDate } from "@/lib/utils";
import { FinancialHealthReport } from "./FinancialHealthReport";
import { IncomeHistoryTable } from "./IncomeHistoryTable";

interface AnalyticsClientProps {
    spending: CategorySpending[];
    trends: MonthlyTrend[];
    history: IncomeRecord[];
}

export function AnalyticsClient({ spending, trends, history }: AnalyticsClientProps) {
    return (
        <PageTransition>
            <div className="space-y-8 pb-20 md:pb-0">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:scale-105 group">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                                Reporte Financiero
                            </h1>
                            <p className="text-sm text-muted-foreground font-medium tracking-wide">
                                Análisis de salud y oportunidades
                            </p>
                        </div>
                    </div>
                </header>

                <FinancialHealthReport spending={spending} trends={trends} />

                <IncomeHistoryTable data={history} />
            </div>
        </PageTransition>
    );
}
