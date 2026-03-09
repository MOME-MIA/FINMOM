"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LIST, PAYMENT_METHODS } from "@/lib/categories";
import { motion, AnimatePresence } from "framer-motion";

export interface ExpenseFilters {
    searchQuery: string;
    categories: string[];
    paymentMethods: string[];
}

interface ExpensesFiltersProps {
    filters: ExpenseFilters;
    onChange: (filters: ExpenseFilters) => void;
    resultCount?: number;
}

export function ExpensesFilters({ filters, onChange, resultCount }: ExpensesFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = filters.categories.length + filters.paymentMethods.length;

    const toggleCategory = (cat: string) => {
        const next = filters.categories.includes(cat)
            ? filters.categories.filter(c => c !== cat)
            : [...filters.categories, cat];
        onChange({ ...filters, categories: next });
    };

    const togglePayment = (method: string) => {
        const next = filters.paymentMethods.includes(method)
            ? filters.paymentMethods.filter(m => m !== method)
            : [...filters.paymentMethods, method];
        onChange({ ...filters, paymentMethods: next });
    };

    const clearAll = () => {
        onChange({ searchQuery: "", categories: [], paymentMethods: [] });
    };

    return (
        <div className="space-y-3">
            {/* Search + Filter Toggle */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                        type="text"
                        value={filters.searchQuery}
                        onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
                        placeholder="Buscar gastos..."
                        className="w-full h-11 pl-10 pr-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/15 focus:bg-white/[0.06] transition-all"
                    />
                    {filters.searchQuery && (
                        <button
                            onClick={() => onChange({ ...filters, searchQuery: "" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "h-11 px-4 flex items-center gap-2 rounded-xl border text-[13px] font-medium transition-all",
                        showFilters || activeFilterCount > 0
                            ? "bg-white/[0.08] border-white/[0.1] text-white"
                            : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.06]"
                    )}
                >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFilterCount > 0 && (
                        <span className="h-5 min-w-[20px] flex items-center justify-center rounded-full bg-[#0A84FF] text-white text-[10px] font-bold px-1.5">
                            {activeFilterCount}
                        </span>
                    )}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showFilters && "rotate-180")} />
                </button>
            </div>

            {/* Result count + Clear */}
            {(activeFilterCount > 0 || filters.searchQuery) && (
                <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] text-white/40 font-medium">
                        {resultCount !== undefined ? `${resultCount} resultado${resultCount !== 1 ? 's' : ''}` : ''}
                    </span>
                    <button
                        onClick={clearAll}
                        className="text-[11px] text-[#0A84FF] hover:text-[#0A84FF]/80 font-medium transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* Expandable Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.06] rounded-2xl p-5 space-y-5">
                            {/* Categories */}
                            <div>
                                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3">Categorías</p>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORY_LIST.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                                                filters.categories.includes(cat)
                                                    ? "bg-white/[0.1] border-white/[0.12] text-white"
                                                    : "bg-white/[0.02] border-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div>
                                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3">Método de Pago</p>
                                <div className="flex flex-wrap gap-2">
                                    {PAYMENT_METHODS.map(pm => (
                                        <button
                                            key={pm.id}
                                            onClick={() => togglePayment(pm.id)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all",
                                                filters.paymentMethods.includes(pm.id)
                                                    ? "bg-white/[0.1] border-white/[0.12] text-white"
                                                    : "bg-white/[0.02] border-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                                            )}
                                        >
                                            {pm.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
