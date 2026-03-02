"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDate } from "@/context/DateContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from 'react';

interface DateSelectorProps {
    className?: string;
}

function DateSelectorInner({ className }: DateSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL or context
    const urlMonth = searchParams.get('month');
    const { selectedMonth, setMonth } = useDate();
    const currentMonth = urlMonth || selectedMonth;

    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Initial temp date state
    const [tempDate, setTempDate] = useState({
        year: parseInt(currentMonth.split('-')[0]),
        month: parseInt(currentMonth.split('-')[1])
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const [year, month] = currentMonth.split('-');
            setTempDate({ year: parseInt(year), month: parseInt(month) });
        }
    }, [isOpen, currentMonth]);

    const changeMonth = (increment: number) => {
        const [year, month] = currentMonth.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1 + increment);
        const newMonth = date.toISOString().slice(0, 7); // YYYY-MM

        setMonth(newMonth); // Update context

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('month', newMonth);
        router.push(`?${params.toString()}`);
    };

    const confirmDate = () => {
        const newMonth = `${tempDate.year}-${String(tempDate.month).padStart(2, '0')}`;
        setMonth(newMonth); // Update context

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('month', newMonth);
        router.push(`?${params.toString()}`);

        setIsOpen(false);
    };

    const formatMonth = (isoMonth: string) => {
        if (!isoMonth) return "";
        const [year, month] = isoMonth.split('-');
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
    };

    const monthsFull = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className="flex justify-center w-full">
            <div className={cn("inline-flex items-center gap-2 bg-white/[0.02] backdrop-blur-[48px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[32px] px-1.5 py-1.5 select-none", className)}>
                <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white active:scale-95">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div
                    className="w-[80px] flex justify-center cursor-pointer hover:bg-white/5 rounded-lg py-1 transition-colors group"
                    onClick={() => setIsOpen(true)}
                >
                    <span className="text-[12px] font-mono font-bold text-white uppercase tracking-wider text-center group-hover:text-white/80 transition-colors">
                        {formatMonth(selectedMonth)}
                    </span>
                </div>
                <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white active:scale-95">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {isMounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative z-[101] bg-[#0A0A0A] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] w-full sm:w-[440px] sm:mx-auto sm:mb-8 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
                            >
                                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 shrink-0" />

                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-semibold text-white tracking-tight">Seleccionar Mes</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mb-8 px-2">
                                    <button
                                        onClick={() => setTempDate(prev => ({ ...prev, year: prev.year - 1 }))}
                                        className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <span className="text-2xl font-mono font-light text-white tracking-widest">{tempDate.year}</span>
                                    <button
                                        onClick={() => setTempDate(prev => ({ ...prev, year: prev.year + 1 }))}
                                        className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {monthsFull.map((month, index) => {
                                        const monthNum = index + 1;
                                        const isSelected = tempDate.month === monthNum;
                                        return (
                                            <button
                                                key={month}
                                                onClick={() => setTempDate(prev => ({ ...prev, month: monthNum }))}
                                                className={cn(
                                                    "py-3 rounded-2xl text-[13px] font-medium transition-all duration-200 uppercase tracking-widest",
                                                    isSelected
                                                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105"
                                                        : "bg-white/[0.03] border border-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                {month.slice(0, 3)}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={confirmDate}
                                    className="w-full py-4 bg-white text-black text-sm font-semibold rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] uppercase tracking-wider"
                                >
                                    Confirmar Fecha
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

export function DateSelector(props: DateSelectorProps) {
    return (
        <Suspense fallback={null}>
            <DateSelectorInner {...props} />
        </Suspense>
    );
}
