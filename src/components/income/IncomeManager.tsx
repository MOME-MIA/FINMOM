"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateIncomeAction } from "@/app/actions";
import { toast } from "sonner";
import { Loader2, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface IncomeManagerProps {
    isOpen: boolean;
    onClose: () => void;
    currentIncome: number;
    month: string;
}

export function IncomeManager({ isOpen, onClose, currentIncome, month }: IncomeManagerProps) {
    const router = useRouter();
    const [amount, setAmount] = useState(currentIncome);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await updateIncomeAction(month, amount);
            if (success) {
                toast.success("Ingreso actualizado correctamente");
                router.refresh();
                onClose();
            } else {
                toast.error("Error al actualizar ingreso");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] bg-[#0A0A0A] border border-white/10 text-white shadow-2xl p-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                <DialogHeader className="p-6 pb-2 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Wallet className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Gestor de Ingresos</DialogTitle>
                            <p className="text-xs text-muted-foreground">Administra tu flujo de entrada mensual</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6 relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Ingreso Total Mensual</Label>
                            <div className="relative group">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="pl-9 h-12 bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-lg font-mono font-bold"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                <TrendingUp className="h-3 w-3" />
                                Este valor impactará directamente en tu presupuesto disponible.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                            <h4 className="text-xs font-bold text-white">Desglose (Próximamente)</h4>
                            <div className="space-y-2 opacity-50 pointer-events-none grayscale">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Sueldo Neto</span>
                                    <span className="font-mono text-white">$0</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Freelance / Extras</span>
                                    <span className="font-mono text-white">$0</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Inversiones</span>
                                    <span className="font-mono text-white">$0</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-white/50 italic pt-1">
                                El desglose detallado estará disponible en futuras actualizaciones.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                            className="hover:bg-white/10 hover:text-white"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Actualizar Ingreso
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
