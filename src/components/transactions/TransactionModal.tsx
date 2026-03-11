"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { MonthlyRecord, TransactionType } from "@/types/finance";
import { Loader2, Trash2, Save, CreditCard, Wallet, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { deleteRecordAction } from "@/app/actions";
import { toast } from "sonner";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<MonthlyRecord, 'id'> | MonthlyRecord) => Promise<boolean>;
    transaction?: MonthlyRecord;
    categories: string[];
}

export function TransactionModal({ isOpen, onClose, onSave, transaction, categories }: TransactionModalProps) {
    const [formData, setFormData] = useState<Partial<MonthlyRecord>>({
        date: new Date().toISOString().split('T')[0],
        type: 'Gasto Semanal',
        amountARS: 0,
        amountUSD: 0,
        category: '',
        description: '',
        paymentMethod: 'Debit'
    });
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (transaction) {
            setFormData(transaction);
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                type: 'Gasto Semanal',
                amountARS: 0,
                amountUSD: 0,
                category: categories[0] || '',
                description: '',
                paymentMethod: 'Debit'
            });
        }
    }, [transaction, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData as MonthlyRecord);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!transaction?.id) return;
        if (!confirm("¿Estás seguro de que quieres eliminar esta transacción?")) return;

        setIsDeleting(true);
        try {
            const success = await deleteRecordAction(transaction.id);
            if (success) {
                toast.success("Transacción eliminada");
                onClose();
                // Ideally trigger a refresh here if needed, but the parent usually handles revalidation via actions
            } else {
                toast.error("Error al eliminar");
            }
        } catch (error) {
            toast.error("Error al eliminar");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-void-950 border-void-800 text-void-50 p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-4 bg-void-900/50 border-b border-void-800">
                    <DialogTitle className="text-xl font-bold text-gradient-obsidian">
                        {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Type & Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Tipo</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: string) => setFormData({ ...formData, type: val as TransactionType })}
                            >
                                <SelectTrigger className="w-full bg-void-900 border-void-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Gasto Semanal">Gasto Semanal</SelectItem>
                                    <SelectItem value="Gasto Fijo">Gasto Fijo</SelectItem>
                                    <SelectItem value="Ingreso">Ingreso</SelectItem>
                                    <SelectItem value="Ahorro">Ahorro</SelectItem>
                                    <SelectItem value="Inversión">Inversión</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Fecha</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="bg-void-900 border-void-800 [color-scheme:dark]"
                                required
                            />
                        </div>
                    </div>

                    {/* Amounts Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Monto ARS</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-void-400 text-xs font-bold">ARS</span>
                                <Input
                                    type="number"
                                    value={formData.amountARS}
                                    onChange={(e) => setFormData({ ...formData, amountARS: Number(e.target.value) })}
                                    className="pl-10 bg-void-900 border-void-800 font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Monto USD</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-void-400 text-xs font-bold">USD</span>
                                <Input
                                    type="number"
                                    value={formData.amountUSD}
                                    onChange={(e) => setFormData({ ...formData, amountUSD: Number(e.target.value) })}
                                    className="pl-10 bg-void-900 border-void-800 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Payment Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Categoría</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: string) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger className="w-full bg-void-900 border-void-800">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Método de Pago</Label>
                            <Select
                                value={formData.paymentMethod || 'Debit'}
                                onValueChange={(val: string) => setFormData({ ...formData, paymentMethod: val })}
                            >
                                <SelectTrigger className="w-full bg-void-900 border-void-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Efectivo</SelectItem>
                                    <SelectItem value="Debit">Débito</SelectItem>
                                    <SelectItem value="Credit">Crédito</SelectItem>
                                    <SelectItem value="Transfer">Transferencia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-void-400 uppercase tracking-wider">Descripción</Label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-void-900 border-void-800"
                            placeholder="Detalle del gasto..."
                            required
                        />
                    </div>

                    <DialogFooter className="flex items-center justify-between gap-2 pt-4 border-t border-void-800 mt-6">
                        {transaction && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting || loading}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 mr-auto"
                            >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="text-void-400 hover:text-void-50">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
