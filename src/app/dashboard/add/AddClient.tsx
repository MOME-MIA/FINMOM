"use client";

import { useState } from "react";
import { ArrowLeft, Wallet, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { IncomeForm } from "@/components/add/IncomeForm";
import { ExpenseForm } from "@/components/add/ExpenseForm";
import { COLORS } from "@/lib/design";

type ViewState = 'selector' | 'income' | 'expense';

export function AddClient() {
    const [view, setView] = useState<ViewState>('selector');

    return (
        <PageTransition>
            <PageLayout title="Nueva Transacción" subtitle="Seleccioná el tipo de movimiento.">
                <AnimatePresence mode="wait">
                    {view === 'selector' && (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                            {/* Income */}
                            <button
                                onClick={() => setView('income')}
                                className="group glass-panel p-6 text-left transition-all hover:bg-white/[0.04] flex flex-col gap-4"
                            >
                                <div className="h-11 w-11 rounded-xl bg-[#30D158]/10 flex items-center justify-center">
                                    <Wallet className="h-5 w-5 text-[#30D158]" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-white mb-1">Ingreso</h3>
                                    <p className="text-[12px] text-white/50 leading-relaxed">
                                        Registrar entrada de dinero, sueldos o ventas.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#30D158] uppercase tracking-wider mt-auto">
                                    <span>Comenzar</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            {/* Expense */}
                            <button
                                onClick={() => setView('expense')}
                                className="group glass-panel p-6 text-left transition-all hover:bg-white/[0.04] flex flex-col gap-4"
                            >
                                <div className="h-11 w-11 rounded-xl bg-[#FF453A]/10 flex items-center justify-center">
                                    <CreditCard className="h-5 w-5 text-[#FF453A]" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-white mb-1">Gasto</h3>
                                    <p className="text-[12px] text-white/50 leading-relaxed">
                                        Registrar compras, pagos o salidas de dinero.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FF453A] uppercase tracking-wider mt-auto">
                                    <span>Comenzar</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {view === 'income' && (
                        <motion.div
                            key="income"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel overflow-hidden"
                        >
                            <div className="h-0.5 w-full bg-[#30D158]" />
                            <div className="p-6">
                                <IncomeForm onBack={() => setView('selector')} />
                            </div>
                        </motion.div>
                    )}

                    {view === 'expense' && (
                        <motion.div
                            key="expense"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel overflow-hidden"
                        >
                            <div className="h-0.5 w-full bg-[#FF453A]" />
                            <div className="p-6">
                                <ExpenseForm onBack={() => setView('selector')} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </PageLayout>
        </PageTransition>
    );
}
