"use client";

import { Transaction } from "@/types/finance";
import { X, Loader2, Calendar, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getTransactionsAction } from "@/app/actions";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DrillDownModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string;
    month: string;
}

export function DrillDownModal({ isOpen, onClose, category, month }: DrillDownModalProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && category) {
            loadTransactions();
        }
    }, [isOpen, category, month]);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await getTransactionsAction(month, category);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {category}
                            <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                {month}
                            </span>
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-sm text-muted-foreground">Cargando transacciones...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                            <p>No se encontraron transacciones para esta categoría.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Descripción</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((t, i) => (
                                    <tr key={t.id || i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-3 font-mono text-xs text-muted-foreground group-hover:text-white transition-colors">
                                            {t.date}
                                        </td>
                                        <td className="px-6 py-3 font-medium text-white/80 group-hover:text-white transition-colors">
                                            {t.description || '—'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono text-white/90 group-hover:text-white transition-colors">
                                            {t.currencyCode !== 'ARS' ? `${t.currencyCode} ` : '$'}
                                            {t.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-white/5 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        {transactions.length} transacciones
                    </span>
                    <div className="text-right">
                        <span className="text-xs text-muted-foreground uppercase mr-2">Total</span>
                        <span className="text-lg font-bold text-white font-mono">
                            ${totalAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
