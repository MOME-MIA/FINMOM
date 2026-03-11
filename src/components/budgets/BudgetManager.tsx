"use client";

import { Budget, DimCategory } from "@/types/finance";
import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, AlertTriangle, Info, Target, CalendarDays, TrendingUp, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { updateBudgetAction, deleteBudgetAction, addBudgetAction } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

interface BudgetManagerProps {
    budgets: Budget[];
    categories: DimCategory[];
}

export function BudgetManager({ budgets, categories }: BudgetManagerProps) {
    const router = useRouter();
    const { display, convert } = useCurrency();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [formData, setFormData] = useState({ categoryId: "", limit: 0 });
    const [loading, setLoading] = useState(false);

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

    const handleOpenModal = (budget?: Budget) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({ categoryId: budget.categoryId || '', limit: budget.budgetLimit });
        } else {
            setEditingBudget(null);
            setFormData({ categoryId: "", limit: 0 });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.categoryId || formData.limit <= 0) {
            toast.error("Completá todos los campos");
            return;
        }
        setLoading(true);
        try {
            if (editingBudget) {
                const success = await updateBudgetAction(editingBudget.id, { budgetLimit: formData.limit });
                if (success) toast.success("Presupuesto actualizado");
                else toast.error("Error al actualizar");
            } else {
                const success = await addBudgetAction({ categoryId: formData.categoryId, budgetLimit: formData.limit, period: 'monthly', currencyCode: 'ARS' });
                if (success) toast.success("Presupuesto creado");
                else toast.error("Error al crear");
            }
            router.refresh();
            setIsModalOpen(false);
        } catch {
            toast.error("Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este presupuesto?")) return;
        const success = await deleteBudgetAction(id);
        if (success) {
            toast.success("Eliminado");
            router.refresh();
        } else {
            toast.error("Error al eliminar");
        }
    };

    // Calculate overall budget DNA
    const { totalBudget, totalSpent, highestCategory } = useMemo(() => {
        let totalLimit = 0;
        let totalExp = 0;
        let highest = { name: "N/A", pct: 0 };

        budgets.forEach(b => {
            totalLimit += b.budgetLimit;
            totalExp += (b.spent || 0);
        });

        if (totalLimit > 0) {
            budgets.forEach(b => {
                const pct = (b.budgetLimit / totalLimit) * 100;
                if (pct > highest.pct) highest = { name: b.categoryName || "Otros", pct };
            });
        }

        return { totalBudget: totalLimit, totalSpent: totalExp, highestCategory: highest };
    }, [budgets]);

    const globalPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    const currentWeek = useMemo(() => {
        const date = new Date().getDate();
        return Math.min(Math.ceil(date / 7), 4);
    }, []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-24">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                        Mi ADN Financiero <Fingerprint className="h-6 w-6 text-[#0A84FF]" />
                    </h2>
                    <p className="text-[15px] text-white/50">
                        Proyectá y controlá tu dinero inteligente con la lógica de 4 semanas.
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white rounded-full px-5 py-2.5 h-auto font-medium transition-all shadow-[0_0_15px_rgba(10,132,255,0.3)] hover:shadow-[0_0_25px_rgba(10,132,255,0.5)] flex items-center shrink-0"
                >
                    <Plus className="h-5 w-5 mr-2" strokeWidth={2} />
                    Nuevo Presupuesto
                </Button>
            </div>

            {/* Financial DNA Global Overview */}
            {budgets.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[32px] bg-[#1C1C1E] border border-white/[0.05] p-6 lg:p-8"
                >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0A84FF]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Global Status */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                                <Target className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">Presupuesto Global</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold tracking-tight text-white mb-1">
                                    {formatMoney(totalBudget)}
                                </h3>
                                <p className="text-white/50 text-sm">
                                    Consumido: {formatMoney(totalSpent)}
                                </p>
                            </div>

                            <div className="space-y-2 mt-6">
                                <div className="flex justify-between text-sm font-medium">
                                    <span style={{ color: globalPercent > 90 ? '#FF453A' : globalPercent > 75 ? '#FF9F0A' : '#30D158' }}>
                                        {globalPercent.toFixed(1)}% Consumido
                                    </span>
                                    <span className="text-white/40">100%</span>
                                </div>
                                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden backdrop-blur-sm border border-white/[0.05]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${globalPercent}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: globalPercent > 90 ? 'linear-gradient(90deg, #FF453A, #FF6961)' :
                                                globalPercent > 75 ? 'linear-gradient(90deg, #FF9F0A, #FFB340)' :
                                                    'linear-gradient(90deg, #30D158, #34C759)'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* DNA Breakdown */}
                        <div className="lg:col-span-2 flex flex-col justify-center">
                            <div className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Composición del ADN</div>

                            {/* DNA Bar */}
                            <div className="flex h-6 rounded-full overflow-hidden border border-white/[0.05] gap-0.5 bg-white/[0.02]">
                                {budgets.sort((a, b) => b.budgetLimit - a.budgetLimit).map((b, i) => {
                                    const pct = (b.budgetLimit / totalBudget) * 100;
                                    const colors = ['#0A84FF', '#5E5CE6', '#14b8a6', '#FF375F', '#FF9F0A', '#32ADE6', '#30D158'];
                                    const color = colors[i % colors.length];
                                    return (
                                        <div
                                            key={b.id}
                                            className="h-full relative group transition-all"
                                            style={{ width: `${pct}%`, backgroundColor: color }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#2C2C2E] border border-white/10 rounded-xl text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                                <div className="font-semibold">{b.categoryIcon} {b.categoryName}</div>
                                                <div className="text-white/60">{pct.toFixed(1)}% ({formatMoney(b.budgetLimit)})</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex max-w-full overflow-x-auto gap-4 mt-6 pb-2 scrollbar-hide">
                                {budgets.slice(0, 4).map((b, i) => {
                                    const pct = (b.budgetLimit / totalBudget) * 100;
                                    const colors = ['#0A84FF', '#5E5CE6', '#14b8a6', '#FF375F', '#FF9F0A', '#32ADE6', '#30D158'];
                                    const color = colors[i % colors.length];
                                    return (
                                        <div key={b.id} className="flex items-center gap-2 shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-[13px] text-white/70">{b.categoryName} <span className="text-white/40 ml-1">{pct.toFixed(0)}%</span></span>
                                        </div>
                                    )
                                })}
                                {budgets.length > 4 && (
                                    <div className="text-[13px] text-white/40 flex items-center shrink-0">
                                        + {budgets.length - 4} más
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {budgets.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-white/[0.05] rounded-[32px] text-center">
                    <div className="w-16 h-16 rounded-full bg-[#0A84FF]/10 flex items-center justify-center mb-4">
                        <Fingerprint className="h-8 w-8 text-[#0A84FF]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Completá tu ADN Financiero</h3>
                    <p className="text-white/50 max-w-md mb-6">
                        No tenés ningún presupuesto configurado. Creá uno para comenzar a darle estructura a tus gastos mensuales.
                    </p>
                    <Button onClick={() => handleOpenModal()} className="bg-white text-black hover:bg-white/90 rounded-full px-6">
                        Comenzar
                    </Button>
                </div>
            )}

            {/* Individual Budgets Grid (4-Week Logic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {budgets.map((budget, index) => {
                    const spent = budget.spent || 0;

                    // 4-Week Logic Calculations
                    // Limit unlocks 25% each week
                    const weeklyLimit = budget.budgetLimit / 4;
                    const activeLimit = weeklyLimit * currentWeek;
                    const availableNow = Math.max(activeLimit - spent, 0);

                    const percent = Math.min((spent / activeLimit) * 100, 100);
                    const isOver = spent > activeLimit;
                    const isNear = percent > 80;

                    const spentWeeks = spent / weeklyLimit;

                    let barColor = "#30D158"; // Green
                    let glowColor = "rgba(48,209,88,0.2)";
                    if (isOver) {
                        barColor = "#FF453A"; // Red
                        glowColor = "rgba(255,69,58,0.2)";
                    } else if (isNear) {
                        barColor = "#FF9F0A"; // Orange
                        glowColor = "rgba(255,159,10,0.2)";
                    }

                    return (
                        <motion.div
                            key={budget.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                            className="group relative bg-[#1C1C1E] border border-white/[0.06] rounded-[24px] overflow-hidden hover:border-white/[0.12] transition-colors"
                        >
                            {/* Subtle background glow based on status */}
                            <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none transition-colors duration-500" style={{ backgroundColor: barColor }} />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6 w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-xl shadow-inner">
                                            {budget.categoryIcon || '🔹'}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-white tracking-tight">
                                                {budget.categoryName || 'Sin categoría'}
                                            </h3>
                                            <p className="text-[13px] text-white/50 font-medium">Global: {formatMoney(budget.budgetLimit)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(budget)} className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white rounded-xl transition-colors backdrop-blur-md">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(budget.id)} className="p-2 bg-white/[0.04] hover:bg-[#FF453A]/20 text-white/60 hover:text-[#FF453A] rounded-xl transition-colors backdrop-blur-md">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Main Progress */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[12px] text-white/40 uppercase tracking-wider font-semibold mb-1">Disponible Sem {currentWeek}</p>
                                            <div className="text-[22px] font-bold tabular-nums tracking-tight leading-none" style={{ color: isOver ? '#FF453A' : '#30D158' }}>
                                                {formatMoney(availableNow)}
                                            </div>
                                            <p className="text-[12px] text-white/50 mt-1">De {formatMoney(activeLimit)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] text-white/40 uppercase tracking-wider font-semibold mb-1 flex justify-end">Consumido</p>
                                            <span className="text-[18px] font-bold" style={{ color: isOver ? '#FF453A' : 'white' }}>
                                                {formatMoney(spent)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-[11px] font-semibold text-white/30 mb-1 px-1">
                                        <span>0%</span>
                                        <span style={{ color: barColor }}>{percent.toFixed(1)}% del límite activo</span>
                                    </div>
                                    <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden shadow-inner border border-white/[0.02]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${percent}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                            className="h-full rounded-full relative"
                                            style={{ backgroundColor: barColor }}
                                        >
                                            {/* Shine effect */}
                                            <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/20 rounded-full" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* 4-Week Logic Visualizer */}
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/[0.03]">
                                    <div className="flex items-center justify-between mb-3 text-white/60 text-[12px] font-medium uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            <span>Regla 4 Semanas</span>
                                        </div>
                                        <span>{formatMoney(weeklyLimit)} / sem</span>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3, 4].map((week) => {
                                            // Determine visual state of this week's block
                                            let weekStatus: 'full' | 'partial' | 'empty' = 'empty';
                                            let fillPct = 0;

                                            if (spentWeeks >= week) {
                                                weekStatus = 'full';
                                                fillPct = 100;
                                            } else if (spentWeeks > week - 1) {
                                                weekStatus = 'partial';
                                                fillPct = (spentWeeks - (week - 1)) * 100;
                                            }

                                            return (
                                                <div key={week} className="relative h-8 rounded-lg bg-white/[0.05] border border-white/[0.05] overflow-hidden flex items-center justify-center">
                                                    {/* Fill Layer */}
                                                    <div className="absolute inset-y-0 left-0 bg-white/[0.1] z-0" style={{ width: `${fillPct}%` }} />

                                                    {/* Value Label */}
                                                    <span className="text-[11px] font-semibold text-white/40 z-10 relative">
                                                        S{week}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Insight text based on pace */}
                                    <div className="mt-3 flex items-start gap-2">
                                        <TrendingUp className="h-3.5 w-3.5 mt-0.5 text-white/40 shrink-0" />
                                        <p className="text-[12px] text-white/50 leading-relaxed">
                                            {spentWeeks > 4
                                                ? "Has excedido el presupuesto de las 4 semanas."
                                                : spentWeeks > 3
                                                    ? "Entrando a la última semana de presupuesto disponible."
                                                    : `Has consumido el equivalente a ${spentWeeks.toFixed(1)} semanas.`}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="relative w-full max-w-md bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/[0.1] text-white rounded-[32px] shadow-2xl p-6 p-0 overflow-hidden sm:p-0">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight">
                                {editingBudget ? 'Editar Presupuesto' : 'Crear Presupuesto'}
                            </DialogTitle>
                            <p className="text-sm text-white/50 mt-1">
                                Definí cuánto querés gastar al mes. M.I.A controlará el límite por vos.
                            </p>
                        </DialogHeader>

                        <div className="space-y-5 py-6 w-full">
                            <div className="space-y-2 w-full relative z-[60]">
                                <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wide">Categoría</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(val: string) => setFormData({ ...formData, categoryId: val })}
                                    disabled={!!editingBudget}
                                >
                                    <SelectTrigger className="w-full bg-black/20 border-white/[0.08] hover:border-white/[0.15] hover:bg-black/40 text-white rounded-2xl h-12 transition-all">
                                        <SelectValue placeholder="Seleccioná una categoría..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#2C2C2E]/95 backdrop-blur-xl border border-white/[0.08] text-white rounded-2xl z-[100] max-h-[250px] shadow-2xl p-1">
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id} className="rounded-xl focus:bg-white/[0.08] py-2.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{c.icon}</span>
                                                    <span className="font-medium">{c.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 w-full relative z-[50]">
                                <Label className="text-[13px] font-medium text-white/70 uppercase tracking-wide">Límite Mensual</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">{display === 'USD' ? 'US$' : display === 'EUR' ? '€' : '$'}</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.limit === 0 ? "" : formData.limit}
                                        onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
                                        className="pl-8 bg-black/20 border-white/[0.08] hover:border-white/[0.15] text-white rounded-2xl h-12 text-lg font-semibold tabular-nums transition-all focus-visible:ring-1 focus-visible:ring-[#0A84FF] focus-visible:bg-white/[0.05]"
                                    />
                                </div>
                                <p className="text-[12px] text-white/40 mt-2 flex items-center gap-1">
                                    <Info className="h-3.5 w-3.5" /> Equivale a {formatMoney(formData.limit / 4)} por semana.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="gap-3 sm:gap-0 mt-6 pt-6 border-t border-white/[0.05]">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl h-12 px-6">
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={loading} className="bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white rounded-xl h-12 px-8 shadow-lg shadow-[#0A84FF]/20">
                                {loading ? 'Guardando...' : 'Guardar ADN'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

