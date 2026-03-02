"use client";

import { useState, useEffect } from "react";
import { DimAccount } from "@/types/finance";
import { getAccountsAction, createTransferAction } from "@/app/actions";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Wallet, Loader2, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TransferForm({ isOpen, onClose }: TransferFormProps) {
    const router = useRouter();
    const { rates, convert } = useCurrency();
    const [accounts, setAccounts] = useState<DimAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [sourceId, setSourceId] = useState<string>("");
    const [destId, setDestId] = useState<string>("");
    const [amountSent, setAmountSent] = useState<number>(0);
    const [amountReceived, setAmountReceived] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [autoConvert, setAutoConvert] = useState(true);

    // Load accounts
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getAccountsAction().then(accts => {
                setAccounts(accts);
                setLoading(false);
            });
        }
    }, [isOpen]);

    // Derived
    const sourceAccount = accounts.find(a => a.id === sourceId);
    const destAccount = accounts.find(a => a.id === destId);
    const isCrossCurrency = sourceAccount && destAccount && sourceAccount.currencyCode !== destAccount.currencyCode;

    // Auto-convert when amount changes
    useEffect(() => {
        if (autoConvert && sourceAccount && destAccount && amountSent > 0) {
            const converted = convert(amountSent, sourceAccount.currencyCode as any, destAccount.currencyCode as any);
            setAmountReceived(Math.round(converted * 100) / 100);
        }
    }, [amountSent, sourceId, destId, autoConvert, convert, sourceAccount, destAccount]);

    const handleSwapAccounts = () => {
        const tmp = sourceId;
        setSourceId(destId);
        setDestId(tmp);
        setAmountSent(amountReceived);
    };

    const handleSubmit = async () => {
        if (!sourceId || !destId || sourceId === destId) {
            toast.error("Seleccioná cuentas diferentes");
            return;
        }
        if (amountSent <= 0) {
            toast.error("El monto debe ser mayor a 0");
            return;
        }

        setSubmitting(true);
        try {
            const result = await createTransferAction({
                date: new Date().toISOString().split("T")[0],
                sourceAccountId: sourceId,
                amountSent,
                destAccountId: destId,
                amountReceived: amountReceived || amountSent,
                description: description || undefined,
            });

            if (result && 'success' in result && result.success) {
                toast.success("Transferencia realizada ✓");
                router.refresh();
                onClose();
                // Reset
                setAmountSent(0);
                setAmountReceived(0);
                setDescription("");
            } else {
                toast.error("Error al realizar la transferencia");
            }
        } catch {
            toast.error("Error inesperado");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                    className="w-full max-w-md bg-[#1C1C1E] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center">
                                <ArrowDownUp className="h-5 w-5 text-[#0A84FF]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-[16px] font-semibold text-white">Transferir entre Vaults</h2>
                                <p className="text-[11px] text-white/50">P2P inter-vault transfer</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-5">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
                            </div>
                        ) : (
                            <>
                                {/* Source Account */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Desde</label>
                                    <select
                                        value={sourceId}
                                        onChange={(e) => setSourceId(e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-[#0A84FF]/50 transition-colors"
                                    >
                                        <option value="" className="bg-[#1C1C1E]">Seleccionar cuenta...</option>
                                        {accounts.map(a => (
                                            <option key={a.id} value={a.id} className="bg-[#1C1C1E]">
                                                {a.name} ({a.currencyCode}) — {formatCurrency(a.currentBalance, a.currencyCode)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Swap Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleSwapAccounts}
                                        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-[#0A84FF] transition-all active:scale-95"
                                    >
                                        <ArrowDownUp className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Destination Account */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Hacia</label>
                                    <select
                                        value={destId}
                                        onChange={(e) => setDestId(e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-[#0A84FF]/50 transition-colors"
                                    >
                                        <option value="" className="bg-[#1C1C1E]">Seleccionar cuenta...</option>
                                        {accounts.filter(a => a.id !== sourceId).map(a => (
                                            <option key={a.id} value={a.id} className="bg-[#1C1C1E]">
                                                {a.name} ({a.currencyCode}) — {formatCurrency(a.currentBalance, a.currencyCode)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount Sent */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                                        Monto a enviar {sourceAccount ? `(${sourceAccount.currencyCode})` : ''}
                                    </label>
                                    <input
                                        type="number"
                                        value={amountSent || ''}
                                        onChange={(e) => setAmountSent(Number(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white font-mono focus:outline-none focus:border-[#0A84FF]/50 transition-colors"
                                    />
                                </div>

                                {/* FX Rate Badge + Amount Received */}
                                {isCrossCurrency && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-3"
                                    >
                                        {/* FX Rate */}
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0A84FF]/5 border border-[#0A84FF]/10">
                                            <Zap className="h-3.5 w-3.5 text-[#0A84FF]" />
                                            <span className="text-[12px] text-[#0A84FF]/80 font-mono">
                                                1 {sourceAccount!.currencyCode} = {' '}
                                                {convert(1, sourceAccount!.currencyCode as any, destAccount!.currencyCode as any).toLocaleString('en-US', { maximumFractionDigits: 6 })}
                                                {' '}{destAccount!.currencyCode}
                                            </span>
                                        </div>

                                        {/* Amount Received */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                                                    Monto a recibir ({destAccount!.currencyCode})
                                                </label>
                                                <label className="flex items-center gap-1.5 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={autoConvert}
                                                        onChange={(e) => setAutoConvert(e.target.checked)}
                                                        className="w-3 h-3 rounded accent-[#0A84FF]"
                                                    />
                                                    <span className="text-[10px] text-white/50">Auto FX</span>
                                                </label>
                                            </div>
                                            <input
                                                type="number"
                                                value={amountReceived || ''}
                                                onChange={(e) => {
                                                    setAutoConvert(false);
                                                    setAmountReceived(Number(e.target.value));
                                                }}
                                                placeholder="0.00"
                                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white font-mono focus:outline-none focus:border-[#0A84FF]/50 transition-colors"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Descripción (opcional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ej: Cambio USD → ARS blue"
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#0A84FF]/50 transition-colors"
                                    />
                                </div>

                                {/* Transfer Preview */}
                                {sourceAccount && destAccount && amountSent > 0 && (
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <div className="flex items-center justify-between text-[13px]">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-3.5 w-3.5 text-[#FF453A]" />
                                                <span className="text-white/60">{sourceAccount.name}</span>
                                            </div>
                                            <span className="font-mono text-[#FF453A]">
                                                -{formatCurrency(amountSent, sourceAccount.currencyCode)}
                                            </span>
                                        </div>
                                        <div className="flex justify-center my-2">
                                            <ArrowRight className="h-3 w-3 text-white/50" />
                                        </div>
                                        <div className="flex items-center justify-between text-[13px]">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-3.5 w-3.5 text-[#30D158]" />
                                                <span className="text-white/60">{destAccount.name}</span>
                                            </div>
                                            <span className="font-mono text-[#30D158]">
                                                +{formatCurrency(isCrossCurrency ? amountReceived : amountSent, destAccount.currencyCode)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-white/[0.06] flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-[14px] font-medium text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !sourceId || !destId || amountSent <= 0}
                            className={cn(
                                "flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all",
                                "bg-[#0A84FF] text-white hover:bg-[#0A84FF]/80",
                                "disabled:opacity-30 disabled:cursor-not-allowed"
                            )}
                        >
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                            ) : (
                                "Transferir"
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
