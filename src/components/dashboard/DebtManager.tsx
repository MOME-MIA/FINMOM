"use client";

import { DebtItem } from "@/types/finance";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toggleDebtStatusAction } from "@/app/actions";
import { toast } from "sonner";
import { playKineticSound, playKineticVibration } from "@/lib/audio";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DebtManagerProps {
    debts: DebtItem[];
    month: string;
}

export function DebtManager({ debts, month }: DebtManagerProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Filter out empty debts if any
    const activeDebts = debts.filter(d => d.ars > 0 || d.isPaid);

    if (activeDebts.length === 0) return null;

    const handleToggle = async (debt: DebtItem) => {
        setLoadingId(debt.name);
        try {
            const result = await toggleDebtStatusAction(month, debt.name, !!debt.isPaid);

            if (result.success) {
                playKineticSound('success');
                playKineticVibration([50, 50, 100]); // Success vibration
                toast.success(debt.isPaid ? "Deuda reactivada" : "Plata cobrada con éxito!");
            } else {
                playKineticSound('error');
                playKineticVibration(200);
                toast.error("Hubo un error al actualizar");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="glass-panel p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Plata que me deben</h3>
                <span className="text-xs text-white/50 uppercase tracking-wider">Pendientes</span>
            </div>

            <div className="space-y-3">
                {activeDebts.map((debt, index) => (
                    <motion.div
                        key={debt.name + index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "p-3 rounded-[16px] border transition-all duration-300 flex items-center justify-between group",
                            debt.isPaid
                                ? "bg-lime-500/10 border-lime-500/20"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                        )}
                    >
                        <div>
                            <p className={cn("font-medium", debt.isPaid ? "text-lime-400" : "text-white")}>
                                {debt.name}
                            </p>
                            <p className="text-sm text-white/60 font-mono">
                                {formatCurrency(debt.ars)}
                            </p>
                        </div>

                        <button
                            onClick={() => handleToggle(debt)}
                            disabled={loadingId === debt.name}
                            className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                                debt.isPaid
                                    ? "bg-lime-500/20 text-lime-400 hover:bg-lime-500/30"
                                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                            )}
                        >
                            {loadingId === debt.name ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
