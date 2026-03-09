"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/types/finance";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Receipt, ArrowUpDown } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import type { ExpenseFilters } from "./ExpensesFilters";

interface ExpensesListProps {
    transactions: Transaction[];
    filters: ExpenseFilters;
    isLoading?: boolean;
}

type SortKey = "date" | "amount" | "category";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 15;

export function ExpensesList({ transactions, filters, isLoading }: ExpensesListProps) {
    const [page, setPage] = useState(0);
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
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

    // Filter
    const filtered = useMemo(() => {
        let result = [...transactions];

        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(tx =>
                tx.description?.toLowerCase().includes(q) ||
                tx.categoryName?.toLowerCase().includes(q) ||
                tx.accountName?.toLowerCase().includes(q)
            );
        }

        if (filters.categories.length > 0) {
            result = result.filter(tx =>
                tx.categoryName && filters.categories.includes(tx.categoryName)
            );
        }

        if (filters.paymentMethods.length > 0) {
            result = result.filter(tx =>
                filters.paymentMethods.includes(tx.paymentMethod)
            );
        }

        return result;
    }, [transactions, filters]);

    // Sort
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let cmp = 0;
            switch (sortKey) {
                case "date":
                    cmp = a.date.localeCompare(b.date);
                    break;
                case "amount":
                    cmp = a.amount - b.amount;
                    break;
                case "category":
                    cmp = (a.categoryName || "").localeCompare(b.categoryName || "");
                    break;
            }
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    // Paginate
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
        setPage(0);
    };

    // Reset page on filter change
    useMemo(() => setPage(0), [filters]);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 bg-white/[0.02] rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (sorted.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Receipt className="h-8 w-8 text-white/30" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">Sin transacciones</h3>
                    <p className="text-sm text-white/40 mt-1">No se encontraron gastos con los filtros actuales.</p>
                </div>
            </div>
        );
    }

    const SortButton = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
        <button
            onClick={() => toggleSort(sortKeyName)}
            className={cn(
                "flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold transition-colors",
                sortKey === sortKeyName ? "text-white/80" : "text-white/40 hover:text-white/60"
            )}
        >
            {label}
            <ArrowUpDown className="h-3 w-3" />
        </button>
    );

    return (
        <div className="space-y-3">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-white/50">
                <div className="col-span-2">
                    <SortButton label="Fecha" sortKeyName="date" />
                </div>
                <div className="col-span-4">
                    <SortButton label="Categoría" sortKeyName="category" />
                </div>
                <div className="col-span-3">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-white/40">Descripción</span>
                </div>
                <div className="col-span-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-white/40">Medio</span>
                </div>
                <div className="col-span-2 text-right">
                    <SortButton label="Monto" sortKeyName="amount" />
                </div>
            </div>

            {/* Transaction Rows */}
            <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
                }}
            >
                {paged.map((tx) => (
                    <motion.div
                        key={tx.id}
                        variants={{
                            hidden: { opacity: 0, y: 8 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl transition-all duration-300"
                    >
                        {/* Desktop Row */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center px-5 py-4">
                            <div className="col-span-2">
                                <span className="text-[13px] text-white/60 font-medium tabular-nums">
                                    {new Date(tx.date + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            <div className="col-span-4 flex items-center gap-3">
                                <div
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-[14px] shrink-0"
                                    style={{ backgroundColor: tx.categoryColor ? `${tx.categoryColor}20` : 'rgba(255,255,255,0.05)' }}
                                >
                                    {tx.categoryIcon || '💰'}
                                </div>
                                <span className="text-[13px] text-white/80 font-medium truncate">
                                    {tx.categoryName || 'Sin categoría'}
                                </span>
                            </div>
                            <div className="col-span-3">
                                <span className="text-[13px] text-white/40 truncate block">
                                    {tx.description || '—'}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <span className="text-[10px] uppercase tracking-wider text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-md font-medium">
                                    {tx.paymentMethod || '—'}
                                </span>
                            </div>
                            <div className="col-span-2 text-right">
                                <span className={cn(
                                    "text-[15px] font-medium font-sans tracking-tight tabular-nums",
                                    tx.type === 'income' ? "text-emerald-400" : "text-white/90"
                                )}>
                                    {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount, tx.currencyCode)}
                                </span>
                            </div>
                        </div>

                        {/* Mobile Card */}
                        <div className="md:hidden flex items-center gap-3 px-4 py-3.5">
                            <div
                                className="h-10 w-10 rounded-full flex items-center justify-center text-[16px] shrink-0"
                                style={{ backgroundColor: tx.categoryColor ? `${tx.categoryColor}20` : 'rgba(255,255,255,0.05)' }}
                            >
                                {tx.categoryIcon || '💰'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[13px] text-white/80 font-medium truncate">
                                        {tx.categoryName || 'Sin categoría'}
                                    </span>
                                    <span className={cn(
                                        "text-[14px] font-medium font-sans tracking-tight tabular-nums shrink-0",
                                        tx.type === 'income' ? "text-emerald-400" : "text-white/90"
                                    )}>
                                        {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount, tx.currencyCode)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-white/30 tabular-nums">
                                        {new Date(tx.date + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                    </span>
                                    {tx.description && (
                                        <>
                                            <span className="text-white/10">·</span>
                                            <span className="text-[11px] text-white/30 truncate">{tx.description}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 px-1">
                    <span className="text-[12px] text-white/40 font-medium tabular-nums">
                        {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} de {sorted.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-[12px] text-white/50 font-medium tabular-nums px-2">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
