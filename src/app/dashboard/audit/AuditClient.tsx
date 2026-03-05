"use client";

import { useEffect, useState } from "react";
import { getAuditDataAction } from "@/app/actions";
import {
    Loader2, Database, AlertCircle, CheckCircle, ArrowLeft,
    Activity, Server, Layers, Table2, ChevronDown, ChevronRight,
    Clock, HardDrive, Wallet, BarChart3, Shield
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

interface TableAudit {
    name: string;
    displayName: string;
    type: 'dimension' | 'fact' | 'legacy';
    status: 'OK' | 'ERROR' | 'EMPTY';
    rowCount: number;
    sample: any[];
    columns: string[];
    error?: string;
}

interface AuditReport {
    tables: TableAudit[];
    systemHealth: {
        totalTables: number;
        connectedTables: number;
        totalRows: number;
        lastTransaction: string;
        totalVaultBalance: number;
        databaseTimestamp: string;
    };
}

export function AuditClient() {
    const { display, convert } = useCurrency();
    const [data, setData] = useState<AuditReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedTable, setExpandedTable] = useState<string | null>(null);

    const formatMoney = (amount: number) => {
        const converted = convert(amount, 'ARS', display);
        const isExact = converted % 1 === 0;

        if (display === 'USD') {
            return `US$${converted.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        if (display === 'EUR') {
            return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        return `$${converted.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    useEffect(() => {
        getAuditDataAction().then((res: any) => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-[#0A84FF]/10 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#0A84FF]" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[14px] font-medium text-white/60">Auditando base de datos...</p>
                    <p className="text-[11px] text-white/50 mt-1">Conectando a todas las tablas</p>
                </div>
            </div>
        );
    }

    if (!data || !data.tables) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertCircle className="h-12 w-12 text-[#FF453A]" />
                <p className="text-[14px] text-white/60">Error al cargar datos de auditoría</p>
            </div>
        );
    }

    const health = data.systemHealth;
    const healthPercent = health.totalTables > 0
        ? Math.round((health.connectedTables / health.totalTables) * 100)
        : 0;
    const isHealthy = healthPercent === 100;

    const typeIcon = (type: string) => {
        switch (type) {
            case 'dimension': return <Layers className="h-3.5 w-3.5" />;
            case 'fact': return <BarChart3 className="h-3.5 w-3.5" />;
            default: return <HardDrive className="h-3.5 w-3.5" />;
        }
    };

    const typeLabel = (type: string) => {
        switch (type) {
            case 'dimension': return 'DIM';
            case 'fact': return 'FACT';
            default: return 'LEGACY';
        }
    };

    const typeColor = (type: string) => {
        switch (type) {
            case 'dimension': return 'text-[#0A84FF] bg-[#0A84FF]/10 border-[#0A84FF]/20';
            case 'fact': return 'text-[#30D158] bg-[#30D158]/10 border-[#30D158]/20';
            default: return 'text-[#FF9F0A] bg-[#FF9F0A]/10 border-[#FF9F0A]/20';
        }
    };

    const statusConfig = (status: string) => {
        switch (status) {
            case 'OK': return {
                color: 'text-[#30D158]',
                bg: 'bg-[#30D158]/10 border-[#30D158]/20',
                icon: <CheckCircle className="h-3 w-3" />,
                label: 'CONECTADO'
            };
            case 'EMPTY': return {
                color: 'text-[#FF9F0A]',
                bg: 'bg-[#FF9F0A]/10 border-[#FF9F0A]/20',
                icon: <AlertCircle className="h-3 w-3" />,
                label: 'VACÍO'
            };
            default: return {
                color: 'text-[#FF453A]',
                bg: 'bg-[#FF453A]/10 border-[#FF453A]/20',
                icon: <AlertCircle className="h-3 w-3" />,
                label: 'ERROR'
            };
        }
    };

    return (
        <div className="space-y-8 pb-20 md:pb-0">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center gap-4">
                <Link href="/dashboard" className="w-fit p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                    <ArrowLeft className="h-5 w-5 text-white/50" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-[#0A84FF]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-[22px] font-semibold text-white tracking-tight">
                                Auditoría del Sistema
                            </h1>
                            <p className="text-[12px] text-white/50">
                                PostgreSQL · Star Schema · {health.totalTables} tablas
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border",
                        isHealthy
                            ? "text-[#30D158] bg-[#30D158]/10 border-[#30D158]/20"
                            : "text-[#FF9F0A] bg-[#FF9F0A]/10 border-[#FF9F0A]/20"
                    )}>
                        <Activity className="h-3 w-3" />
                        {healthPercent}% Health
                    </div>
                </div>
            </header>

            {/* System Health Panel */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <HealthCard
                    icon={<Server className="h-4 w-4" />}
                    label="Tablas Conectadas"
                    value={`${health.connectedTables}/${health.totalTables}`}
                    color="text-[#0A84FF]"
                />
                <HealthCard
                    icon={<Database className="h-4 w-4" />}
                    label="Filas Totales"
                    value={health.totalRows.toLocaleString()}
                    color="text-[#30D158]"
                />
                <HealthCard
                    icon={<Wallet className="h-4 w-4" />}
                    label="Balance Vaults"
                    value={formatMoney(health.totalVaultBalance)}
                    color="text-[#FF9F0A]"
                />
                <HealthCard
                    icon={<Clock className="h-4 w-4" />}
                    label="Última Transacción"
                    value={health.lastTransaction !== 'N/A' ? new Date(health.lastTransaction).toLocaleDateString('es-AR') : 'N/A'}
                    color="text-[#BF5AF2]"
                />
                <HealthCard
                    icon={<Activity className="h-4 w-4" />}
                    label="Timestamp"
                    value={new Date(health.databaseTimestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    color="text-white/50"
                />
            </div>

            {/* Tables Grid */}
            <div className="space-y-3">
                <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Table2 className="h-3.5 w-3.5" />
                    Detalle por Tabla
                </h2>

                <div className="space-y-2">
                    {data.tables.map((table, idx) => {
                        const status = statusConfig(table.status);
                        const isExpanded = expandedTable === table.name;

                        return (
                            <motion.div
                                key={table.name}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-[#1C1C1E] border border-white/[0.06] rounded-xl overflow-hidden"
                            >
                                {/* Table Header Row */}
                                <button
                                    onClick={() => setExpandedTable(isExpanded ? null : table.name)}
                                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    {/* Expand Icon */}
                                    <div className="text-white/50">
                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </div>

                                    {/* Type Badge */}
                                    <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1", typeColor(table.type))}>
                                        {typeIcon(table.type)}
                                        {typeLabel(table.type)}
                                    </div>

                                    {/* Table Name */}
                                    <div className="flex-1 text-left">
                                        <p className="text-[14px] font-medium text-white">{table.displayName}</p>
                                        <p className="text-[11px] text-white/50 font-mono">{table.name}</p>
                                    </div>

                                    {/* Row Count */}
                                    <div className="text-right mr-4">
                                        <p className="text-[16px] font-semibold text-white tabular-nums">{table.rowCount.toLocaleString()}</p>
                                        <p className="text-[10px] text-white/50">filas</p>
                                    </div>

                                    {/* Columns Count */}
                                    <div className="text-right mr-4 hidden md:block">
                                        <p className="text-[14px] font-medium text-white/60 tabular-nums">{table.columns.length}</p>
                                        <p className="text-[10px] text-white/50">columnas</p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1", status.bg, status.color)}>
                                        {status.icon}
                                        {status.label}
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 space-y-4 border-t border-white/[0.04] pt-4">
                                                {/* Error Display */}
                                                {table.error && (
                                                    <div className="p-3 rounded-xl bg-[#FF453A]/5 border border-[#FF453A]/10 text-[12px] text-[#FF453A] font-mono">
                                                        {table.error}
                                                    </div>
                                                )}

                                                {/* Columns */}
                                                {table.columns.length > 0 && (
                                                    <div>
                                                        <p className="text-[11px] text-white/50 font-medium mb-2 uppercase tracking-wider">Columnas</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {table.columns.map(col => (
                                                                <span key={col} className="px-2 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] font-mono text-white/50">
                                                                    {col}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Sample Data */}
                                                {table.sample.length > 0 && (
                                                    <div>
                                                        <p className="text-[11px] text-white/50 font-medium mb-2 uppercase tracking-wider">
                                                            Muestra de datos ({table.sample.length} filas)
                                                        </p>
                                                        <div className="bg-black/30 rounded-xl border border-white/[0.04] overflow-x-auto">
                                                            <table className="w-full text-[11px]">
                                                                <thead>
                                                                    <tr className="border-b border-white/[0.06]">
                                                                        {table.columns.map(col => (
                                                                            <th key={col} className="px-3 py-2 text-left text-white/50 font-medium font-mono whitespace-nowrap">
                                                                                {col}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {table.sample.map((row, i) => (
                                                                        <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                                                                            {table.columns.map(col => (
                                                                                <td key={col} className="px-3 py-2 text-white/50 font-mono whitespace-nowrap max-w-[200px] truncate">
                                                                                    {row[col] === null
                                                                                        ? <span className="text-white/15 italic">null</span>
                                                                                        : typeof row[col] === 'boolean'
                                                                                            ? <span className={row[col] ? 'text-[#30D158]' : 'text-[#FF453A]'}>{String(row[col])}</span>
                                                                                            : String(row[col])
                                                                                    }
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4">
                <p className="text-[10px] text-white/15 font-mono">
                    FINMOM · Star Schema v2.0 · InsForge Edge Database · Audited at {new Date(health.databaseTimestamp).toLocaleString('es-AR')}
                </p>
            </div>
        </div>
    );
}

function HealthCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
        <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-xl p-4">
            <div className={cn("mb-2", color)}>{icon}</div>
            <p className="text-[18px] font-semibold text-white tabular-nums">{value}</p>
            <p className="text-[10px] text-white/50 mt-0.5">{label}</p>
        </div>
    );
}
