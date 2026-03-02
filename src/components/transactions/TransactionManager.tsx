"use client";

import { Transaction } from "@/types/finance";
import { ArrowDown, ArrowUp, Trash2, Edit2, Plus, Upload, Sparkles } from "lucide-react";
import { deleteRecordAction, addRecordAction, updateRecordAction } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { TransactionModal } from "./TransactionModal";
import { ImportModal } from "./ImportModal";
import { IntentionalFriction } from "@/components/ui/IntentionalFriction";
import { Button } from "@/components/ui/Button";
import { useCurrency } from "@/context/CurrencyContext";
import { CATEGORY_LIST } from "@/lib/categories";

interface TransactionManagerProps {
    transactions: Transaction[];
    month: string;
}

export function TransactionManager({ transactions, month }: TransactionManagerProps) {
    const router = useRouter();
    const { display, convert } = useCurrency();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const categories = CATEGORY_LIST;

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedTransaction(undefined);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const success = await deleteRecordAction(deleteTargetId);
        setDeleteTargetId(null);
        if (success) { toast.success("Movimiento eliminado"); router.refresh(); }
        else toast.error("Error al eliminar");
    };

    const formatAmount = (t: Transaction) => {
        // Convert the transaction amount from its native currency to the globally selected display currency
        const convertedAmount = display !== t.currencyCode
            ? convert(t.amount, t.currencyCode, display)
            : t.amount;

        const isExact = convertedAmount % 1 === 0;

        if (display === 'USD') {
            return `US$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        if (display === 'EUR') {
            return `€${convertedAmount.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        return `$${convertedAmount.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="space-y-3 pb-[calc(var(--nav-height)+24px)] md:pb-0">
            <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-white/80">Registro</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsImportModalOpen(true)}
                        variant="outline"
                        className="border-white/[0.08] text-white/50 hover:bg-white/[0.06] rounded-xl text-[13px]"
                    >
                        <Upload className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
                        Importar
                    </Button>
                    <Button onClick={handleNew} className="bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white rounded-xl text-[13px]">
                        <Plus className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
                        Nueva
                    </Button>
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px] text-left">
                        <thead className="text-[11px] text-white/50 uppercase bg-white/[0.02] border-b border-white/[0.04]">
                            <tr>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Categoría</th>
                                <th className="px-4 py-3 text-right">Monto</th>
                                <th className="px-4 py-3 text-center">Método</th>
                                <th className="px-4 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-white/50 text-[13px]">
                                        No hay transacciones este mes.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t, index) => (
                                    <motion.tr
                                        key={t.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                                        className="hover:bg-white/[0.03] transition-colors group"
                                    >
                                        <td className="px-4 py-3 text-white/50 tabular-nums">{t.date}</td>
                                        <td className="px-4 py-3 font-medium text-white/80">
                                            <div className="flex items-center gap-2">
                                                <span>{t.description?.replace('[M.I.A.]', '').trim() || '—'}</span>
                                                {t.description?.includes('[M.I.A.]') && (
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1 shrink-0 mt-0.5">
                                                        <Sparkles size={8} />
                                                        POWERED BY M.I.A.
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded-md text-[11px] bg-white/[0.04] text-white/50 border border-white/[0.06]">
                                                {t.categoryIcon && `${t.categoryIcon} `}{t.categoryName || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold tabular-nums">
                                            <span className={t.type === 'income' ? "text-[#30D158]" : "text-white/80"}>
                                                <div className="flex items-center justify-end gap-1">
                                                    {t.type === 'income' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3 text-white/50" />}
                                                    {formatAmount(t)}
                                                </div>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-[11px] text-white/50">
                                            {t.paymentMethod || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(t)} className="p-1.5 text-white/50 hover:text-[#0A84FF] hover:bg-white/[0.04] rounded-lg transition-colors">
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </button>
                                                <button onClick={() => confirmDelete(t.id)} className="p-1.5 text-white/50 hover:text-[#FF453A] hover:bg-white/[0.04] rounded-lg transition-colors">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (tx) => {
                    let success = false;
                    if (selectedTransaction?.id) {
                        success = await updateRecordAction(selectedTransaction.id, tx);
                    } else {
                        const newTx = await addRecordAction(tx as any);
                        success = !!newTx;
                    }
                    if (success) {
                        toast.success("Transacción guardada");
                        router.refresh();
                    } else {
                        toast.error("Error al guardar");
                    }
                    return success;
                }}
                transaction={selectedTransaction as any}
                categories={categories}
            />

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => router.refresh()}
            />

            <IntentionalFriction
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={executeDelete}
                title="¿Eliminar movimiento?"
                description="Esta acción afectará tus analíticas y balances totales permanentemente. ¿Estás seguro de que quieres hacerlo?"
                confirmText="Sí, eliminar definitivamente"
                cancelText="Mantener registro"
                delayMs={1500}
            />
        </div>
    );
}
