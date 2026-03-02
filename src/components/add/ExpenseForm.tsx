"use client";

import { useState, useEffect } from "react";
import { addRecordAction, getDolarBlueAction, getAccountsAction } from "@/app/actions";
import { Loader2, Save, DollarSign, FileText, Calendar, ArrowLeft, CreditCard, Wallet, ArrowLeftRight, Banknote } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TransactionType } from "@/types/finance";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { CATEGORY_LIST, PAYMENT_METHODS, TRANSACTION_TYPES } from "@/lib/categories";
import { COLORS } from "@/lib/design";
import { DimAccount } from "@/types/finance";

interface ExpenseFormProps {
    onBack: () => void;
}

export function ExpenseForm({ onBack }: ExpenseFormProps) {
    const [loading, setLoading] = useState(false);
    const [fxRate, setFxRate] = useState(0);
    const [fxLoading, setFxLoading] = useState(true);

    const [accounts, setAccounts] = useState<DimAccount[]>([]);

    // Fetch live FX rate and accounts on mount
    useEffect(() => {
        (async () => {
            try {
                const [rate, accs] = await Promise.all([
                    getDolarBlueAction(),
                    getAccountsAction()
                ]);
                setFxRate(rate);
                setAccounts((accs || []).filter((a: DimAccount) => a.isActive));
            } catch (err) {
                console.error("[ExpenseForm] init failed:", err);
            } finally {
                setFxLoading(false);
            }
        })();
    }, []);

    const [formData, setFormData] = useState({
        amount: '',
        currency: 'ARS' as 'ARS' | 'USD',
        category: '',
        description: '',
        type: 'Gasto Semanal' as TransactionType,
        accountId: '',
        paymentMethod: 'Debit',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            toast.error("Seleccioná una categoría");
            return;
        }

        if (!formData.accountId) {
            toast.error("Seleccioná una cuenta");
            return;
        }

        setLoading(true);

        try {
            const rawAmount = Number(formData.amount) || 0;

            // GOLDEN RULE: Capture both ARS and USD with the live FX rate
            let amountARS: number;
            let amountUSD: number;

            if (formData.currency === 'ARS') {
                amountARS = rawAmount;
                amountUSD = fxRate > 0 ? rawAmount / fxRate : 0;
            } else {
                amountUSD = rawAmount;
                amountARS = rawAmount * fxRate;
            }

            const record = {
                date: formData.date,
                type: formData.type,
                amountARS: Math.round(amountARS * 100) / 100,
                amountUSD: Math.round(amountUSD * 100) / 100,
                category: formData.category,
                description: formData.description,
                paymentMethod: formData.paymentMethod,
                accountId: formData.accountId,
                fxRate: fxRate,
                fxSource: 'bluelytics',
                fxTimestamp: new Date().toISOString(),
            };

            const result = await addRecordAction(record);

            if (result) {
                toast.success("Gasto registrado correctamente");
                setFormData({
                    amount: '', currency: 'ARS', category: '', description: '',
                    type: 'Gasto Semanal', accountId: '', paymentMethod: 'Debit',
                    date: new Date().toISOString().split('T')[0]
                });
                onBack();
            } else {
                toast.error("Error al guardar el gasto");
            }
        } catch (err) {
            console.error("[ExpenseForm] Submit error:", err);
            toast.error("Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
        >
            <div className="flex items-center gap-3 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-[15px] font-semibold text-white">Nuevo Gasto</h2>
                {!fxLoading && fxRate > 0 && (
                    <span className="ml-auto text-[11px] text-white/50 tabular-nums">
                        USD/ARS {fxRate.toLocaleString()}
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.03] rounded-xl">
                    {TRANSACTION_TYPES.filter(t => t.id !== 'Ingreso').map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: t.id as TransactionType })}
                            className={cn(
                                "py-2 px-3 rounded-lg text-[12px] font-medium transition-all",
                                formData.type === t.id
                                    ? "bg-white/[0.08] text-white border border-white/[0.06]"
                                    : "text-white/50 hover:text-white/60"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Amount + Currency */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Monto</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                            <Input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0"
                                className="pl-10 h-14 text-2xl font-semibold bg-white/[0.04] border-white/[0.06] rounded-xl text-white"
                                autoFocus
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, currency: formData.currency === 'ARS' ? 'USD' : 'ARS' })}
                            className="h-14 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[13px] font-semibold text-white/60 hover:bg-white/[0.08] transition-colors flex items-center gap-1.5"
                        >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            {formData.currency}
                        </button>
                    </div>
                    {formData.amount && fxRate > 0 && (
                        <p className="text-[11px] text-white/50 ml-1 tabular-nums">
                            ≈ {formData.currency === 'ARS'
                                ? `USD ${(Number(formData.amount) / fxRate).toFixed(2)}`
                                : `ARS ${(Number(formData.amount) * fxRate).toLocaleString()}`
                            }
                        </p>
                    )}
                </div>

                {/* Category & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Categoría</label>
                        <Select
                            onValueChange={(val: string) => setFormData({ ...formData, category: val })}
                            defaultValue={formData.category}
                        >
                            <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.06] rounded-xl">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2C2C2E] border-white/[0.08]">
                                {CATEGORY_LIST.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Cuenta</label>
                        <div className="grid grid-cols-2 gap-1.5">
                            {accounts.slice(0, 4).map((acc) => (
                                <button
                                    key={acc.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, accountId: acc.id, paymentMethod: acc.provider })}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-2 rounded-lg transition-all border",
                                        formData.accountId === acc.id
                                            ? "bg-white/[0.08] text-white border border-white/[0.08]"
                                            : "bg-white/[0.02] text-white/50 border border-white/[0.03] hover:bg-white/[0.04]"
                                    )}
                                >
                                    <span className="text-[11px] font-medium w-full truncate text-center px-1">{acc.name}</span>
                                    <span className="text-[9px] text-white/50 block mt-0.5">{acc.currencyCode}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Fecha</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="pl-10 bg-white/[0.04] border-white/[0.06] rounded-xl [color-scheme:dark]"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider ml-1">Nota (Opcional)</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles..."
                            className="pl-10 bg-white/[0.04] border-white/[0.06] rounded-xl"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-[14px] font-semibold bg-[#FF453A] hover:bg-[#FF453A]/80 text-white rounded-xl mt-2"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    <span>Registrar Gasto</span>
                </Button>
            </form>
        </motion.div>
    );
}
