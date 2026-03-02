"use client";

import React, { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import type { CurrencyCode } from "@/types/finance";
import { cn } from "@/lib/utils";
import { CurrencyIcon } from "@/components/ui/CurrencyIcon";

const CURRENCY_DICT: Record<string, { label: string; symbol: string }> = {
    'ARS': { label: 'Peso Argentino', symbol: '$' },
    'USD': { label: 'US Dollar', symbol: 'US$' },
    'EUR': { label: 'Euro', symbol: '€' },
    'BTC': { label: 'Bitcoin', symbol: '₿' },
    'USDT': { label: 'Tether', symbol: '₮' },
    'ETH': { label: 'Ethereum', symbol: 'Ξ' },
};

export function CurrencySelector() {
    const { display, setCurrency, activeCurrencies } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    // Strict Currency Set (Apple/Samsung minimalism, fast liquidity view)
    const strictCurrencies: CurrencyCode[] = ['ARS', 'USD', 'EUR'];
    const availableCurrencies = strictCurrencies.map(code => ({
        code,
        label: CURRENCY_DICT[code]?.label || code,
        symbol: CURRENCY_DICT[code]?.symbol || '$',
    }));

    // Always fallback to USD if somehow totally empty
    const selected = availableCurrencies.find(c => c.code === display) || availableCurrencies[0] || { code: 'USD', label: 'US Dollar', symbol: 'US$' };

    // Close on click outside (simplified for clarity, can be refined)
    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-[36px] h-[36px] rounded-full transition-all duration-300 pointer-events-auto border active:scale-95 shrink-0",
                    isOpen
                        ? "bg-white/[0.08] border-white/[0.05] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        : "bg-white/[0.02] border-white/[0.02] hover:bg-white/[0.04]"
                )}
            >
                <CurrencyIcon code={selected.code} className="w-[22px] h-[22px]" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.96 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.8 }}
                            className="absolute left-0 top-full mt-2 w-56 rounded-3xl bg-[#111111]/80 backdrop-blur-[48px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-2 pointer-events-auto origin-top-left"
                        >
                            <div className="px-3 py-2 border-b border-white/[0.04] mb-2 flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5 text-white/50" />
                                <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Tus Divisas Activas</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                {availableCurrencies.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => {
                                            setCurrency(c.code);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-[18px] text-left transition-all duration-200 active:scale-95",
                                            display === c.code
                                                ? "bg-white/[0.08] text-white shadow-sm"
                                                : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                                        )}
                                    >
                                        <CurrencyIcon code={c.code} className="w-[28px] h-[28px] shrink-0" />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-[13px] font-semibold tracking-tight">{c.code}</span>
                                            <span className="text-[11px] text-white/50 truncate tracking-wide">{c.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
