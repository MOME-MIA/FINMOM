import { DetailedExpenseRecord } from "@/types/finance";
import { X, Check, Loader2, Edit2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toggleFixedExpenseStatusAction, updateFixedExpenseValueAction } from "@/app/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";

interface FixedExpensesModalProps {
    data: DetailedExpenseRecord | null;
    onClose: () => void;
}

export function FixedExpensesModal({ data, onClose }: FixedExpensesModalProps) {
    const router = useRouter();
    const { display, convert } = useCurrency();
    const [localData, setLocalData] = useState<DetailedExpenseRecord | null>(data);
    const [updating, setUpdating] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState<Record<string, number>>({});

    if (!localData) return null;

    const formatMoney = (amount: number) => {
        const converted = convert(amount, 'ARS', display);
        const isExact = converted % 1 === 0;

        if (display === 'USD') {
            return `US$${converted.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        if (display === 'EUR') {
            return `€${converted.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        }
        return `$${converted.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    // Define the items to show with their keys
    const items = [
        { key: 'alquiler', label: "Alquiler", value: localData.alquiler },
        { key: 'luz', label: "Luz", value: localData.luz },
        { key: 'wifi', label: "Wifi", value: localData.wifi },
        { key: 'segAuto', label: "Seguro Auto", value: localData.segAuto },
        { key: 'jardin', label: "Jardín", value: localData.jardin },
        { key: 'celu', label: "Celular", value: localData.celu },
        { key: 'entretenimiento', label: "Entretenimiento", value: localData.entretenimiento },
        { key: 'mecanico', label: "Mecánico", value: localData.mecanico },
        { key: 'extras', label: "Extras", value: localData.extras },
        { key: 'estudio', label: "Estudio", value: localData.estudio },
        { key: 'contador', label: "Contador", value: localData.contador },
        { key: 'expensasCasa', label: "Expensas Casa", value: localData.expensasCasa },
    ];

    const total = items.reduce((acc, item) => acc + item.value, 0);

    const handleToggle = async (key: string, currentStatus: boolean) => {
        if (isEditing) return;
        setUpdating(key);
        const newStatus = !currentStatus;

        // Optimistic update
        setLocalData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                status: {
                    ...prev.status,
                    [key]: newStatus
                }
            };
        });

        const success = await toggleFixedExpenseStatusAction(localData.date, key, currentStatus);

        if (success) {
            toast.success("Estado actualizado");
            router.refresh();
        } else {
            toast.error("Error al actualizar");
            // Revert
            setLocalData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    status: {
                        ...prev.status,
                        [key]: !newStatus
                    }
                };
            });
        }
        setUpdating(null);
    };

    const toggleEditMode = () => {
        if (isEditing) {
            // Cancel edit
            setIsEditing(false);
            setEditValues({});
        } else {
            // Start edit
            const initialValues: Record<string, number> = {};
            items.forEach(item => {
                initialValues[item.key] = item.value;
            });
            setEditValues(initialValues);
            setIsEditing(true);
        }
    };

    const handleSaveEdit = async (key: string) => {
        const newValue = editValues[key];
        if (newValue === undefined) return;

        setUpdating(key);
        try {
            const success = await updateFixedExpenseValueAction(localData.date, key, newValue);
            if (success) {
                toast.success("Monto actualizado");
                setLocalData(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        [key]: newValue
                    };
                });
                router.refresh();
            } else {
                toast.error("Error al actualizar monto");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md glass-panel bg-void-900 border-void-800 shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b border-void-800 bg-void-900/50">
                    <h3 className="text-lg font-bold text-void-50">Detalle Gastos Fijos</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleEditMode}
                            className={cn(
                                "p-2 rounded-full hover:bg-void-800 transition-colors",
                                isEditing ? "text-violet-400 bg-violet-500/10" : "text-void-400 hover:text-void-50"
                            )}
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-void-800 text-void-400 hover:text-void-50 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-0 max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-void-400 uppercase bg-void-900/80 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 w-10">Estado</th>
                                <th className="px-6 py-3">Concepto</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-void-800">
                            {items.map((item, index) => {
                                const isPaid = localData.status?.[item.key] || false;
                                return (
                                    <tr key={index} className={cn(
                                        "hover:bg-void-800/30 transition-colors",
                                        isPaid && !isEditing && "bg-lime-500/5"
                                    )}>
                                        <td className="px-6 py-3">
                                            {!isEditing && (
                                                <button
                                                    onClick={() => handleToggle(item.key, isPaid)}
                                                    disabled={updating === item.key}
                                                    className={cn(
                                                        "h-5 w-5 rounded-md flex items-center justify-center transition-all border",
                                                        isPaid
                                                            ? "bg-lime-500 border-lime-500 text-void-950"
                                                            : "bg-void-950 border-void-700 text-transparent hover:border-void-500"
                                                    )}
                                                >
                                                    {updating === item.key ? (
                                                        <Loader2 className="h-3 w-3 animate-spin text-void-50" />
                                                    ) : (
                                                        <Check className="h-3 w-3" />
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                        <td className={cn(
                                            "px-6 py-3 font-medium text-void-50 transition-all",
                                            isPaid && !isEditing && "line-through text-void-500"
                                        )}>{item.label}</td>
                                        <td className={cn(
                                            "px-6 py-3 text-right font-mono transition-all",
                                            isPaid && !isEditing ? "text-void-500" : "text-void-200"
                                        )}>
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Input
                                                        type="number"
                                                        value={editValues[item.key] || 0}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValues({ ...editValues, [item.key]: Number(e.target.value) })}
                                                        className="h-8 w-24 text-right bg-void-950 border-void-700"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEdit(item.key)}
                                                        disabled={updating === item.key}
                                                        className="p-1.5 rounded-md bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
                                                    >
                                                        {updating === item.key ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <Save className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                formatMoney(item.value)
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-void-900 font-bold text-void-50 sticky bottom-0 z-10">
                            <tr>
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3">Total</td>
                                <td className="px-6 py-3 text-right font-mono">{formatMoney(total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
