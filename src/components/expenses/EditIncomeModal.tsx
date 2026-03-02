"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateIncomeAction } from "@/app/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentIncome: number;
    month: string;
}

export function EditIncomeModal({ isOpen, onClose, currentIncome, month }: EditIncomeModalProps) {
    const router = useRouter();
    const [amount, setAmount] = useState(currentIncome);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await updateIncomeAction(month, amount);
            if (success) {
                toast.success("Ingreso actualizado");
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
            <DialogContent className="sm:max-w-[425px] bg-void-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Editar Ingreso Mensual</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Monto Total</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-white/5 border-white/10"
                        />
                        <p className="text-xs text-muted-foreground">
                            Este valor actualizará el "Cobro Mensual" en la hoja de Ingresos.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
