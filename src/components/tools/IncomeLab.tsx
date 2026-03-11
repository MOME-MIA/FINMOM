"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, DollarSign, ArrowRight, RefreshCcw, AlertTriangle } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function IncomeLab({ onClose }: { onClose: () => void }) {
    const { baseStrategy, calculateSplit, setBaseStrategy } = useFinancial();
    const [amount, setAmount] = useState<string>("");

    // Local strategy state for simulation
    const [strategy, setStrategy] = useState(baseStrategy);

    const numericAmount = parseFloat(amount) || 0;
    const split = calculateSplit(numericAmount, strategy);

    const totalPercent = strategy.savings + strategy.investment + strategy.needs + strategy.wants;
    const isValid = totalPercent === 100;

    const handleReset = () => {
        setStrategy(baseStrategy);
    };

    const handleApply = () => {
        if (!isValid) {
            toast.error("La estrategia debe sumar 100%");
            return;
        }
        setBaseStrategy(strategy);
        toast.success("Estrategia global actualizada");
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Calculator className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white font-heading">Income Lab</h3>
                            <p className="text-xs text-muted-foreground">Simulador de distribución</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                    {/* Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Monto del Ingreso</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-muted-foreground group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Strategy Tuner */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Ajustar Estrategia</label>
                            <button
                                onClick={handleReset}
                                className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <RefreshCcw className="h-3 w-3" />
                                Resetear
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 space-y-4 border border-white/5">
                            <SliderRow
                                label="Ahorros"
                                value={strategy.savings}
                                onChange={(v) => setStrategy(s => ({ ...s, savings: v }))}
                                color="bg-emerald-500"
                                textColor="text-emerald-400"
                            />
                            <SliderRow
                                label="Inversiones"
                                value={strategy.investment}
                                onChange={(v) => setStrategy(s => ({ ...s, investment: v }))}
                                color="bg-teal-500"
                                textColor="text-teal-400"
                            />
                            <SliderRow
                                label="Necesidades"
                                value={strategy.needs}
                                onChange={(v) => setStrategy(s => ({ ...s, needs: v }))}
                                color="bg-blue-500"
                                textColor="text-blue-400"
                            />
                            <SliderRow
                                label="Deseos"
                                value={strategy.wants}
                                onChange={(v) => setStrategy(s => ({ ...s, wants: v }))}
                                color="bg-orange-500"
                                textColor="text-orange-400"
                            />

                            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Total Asignado</span>
                                <div className="flex items-center gap-2">
                                    {!isValid && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                    <span className={cn(
                                        "text-sm font-bold font-mono",
                                        isValid ? "text-white" : "text-red-500"
                                    )}>{totalPercent}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-3">
                        <ResultRow
                            label="Ahorros"
                            sublabel="% del Total"
                            percent={strategy.savings}
                            amount={split.savings}
                            color="bg-emerald-500"
                            textColor="text-emerald-400"
                        />
                        <ResultRow
                            label="Inversiones"
                            sublabel="% del Restante"
                            percent={strategy.investment}
                            amount={split.investment}
                            color="bg-teal-500"
                            textColor="text-teal-400"
                        />
                        <div className="h-px bg-white/5 my-2" />
                        <ResultRow
                            label="Necesidades"
                            sublabel="% del Libre"
                            percent={strategy.needs}
                            amount={split.needs}
                            color="bg-blue-500"
                            textColor="text-blue-400"
                        />
                        <ResultRow
                            label="Deseos"
                            sublabel="% del Libre"
                            percent={strategy.wants}
                            amount={split.wants}
                            color="bg-orange-500"
                            textColor="text-orange-400"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex gap-3 shrink-0">
                    <button
                        onClick={handleApply}
                        disabled={!isValid}
                        className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Aplicar Estrategia Global
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function SliderRow({ label, value, onChange, color, textColor }: { label: string, value: number, onChange: (v: number) => void, color: string, textColor: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-white/80">{label}</span>
                <span className={cn("font-mono font-bold", textColor)}>{value}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className={cn(
                    "w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-current",
                    textColor.replace('text-', 'accent-')
                )}
            />
        </div>
    );
}

function ResultRow({ label, sublabel, percent, amount, color, textColor }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
                <div className={cn("h-2 w-2 rounded-full", color)} />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{label}</span>
                    <span className="text-[10px] text-muted-foreground">{sublabel}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground bg-black/20 px-2 py-0.5 rounded-md">{percent}%</span>
                <span className={cn("text-lg font-bold font-mono", textColor)}>
                    ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
            </div>
        </div>
    );
}
