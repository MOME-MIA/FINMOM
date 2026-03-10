"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCategoryAction, deleteCategoryAction } from '@/app/actions';
import { DimCategory } from '@/types/finance';
import { toast } from 'sonner';
import {
    Tag, Plus, Trash2, X, ShoppingCart, Coffee, Car, Home,
    Briefcase, Zap, Box, Heart, Laptop, Gift, Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const ALL_ICONS: Record<string, any> = {
    Tag, ShoppingCart, Coffee, Car, Home,
    Briefcase, Zap, Box, Heart, Laptop, Gift, Plane
};

const COLORS = [
    '#f43f5e', // rose
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#84cc16', // lime
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#52525b', // zinc
];

export default function CategoriesClient({ initialCategories }: { initialCategories: DimCategory[] }) {
    const [categories, setCategories] = useState<DimCategory[]>(initialCategories);
    const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Tag');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    const router = useRouter();

    const filteredCategories = categories.filter(c => c.type === activeTab);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("El nombre es requerido");

        setIsLoading(true);
        const res = await createCategoryAction({
            name: name.trim(),
            type: activeTab,
            icon: selectedIcon,
            color: selectedColor
        });

        if (res.success && res.data) {
            toast.success("Categoría creada");
            setCategories(prev => [...prev, res.data]);
            setIsAddOpen(false);
            setName('');
            setSelectedIcon('Tag');
            setSelectedColor(COLORS[0]);
            router.refresh();
        } else {
            toast.error(res.error || "Ocurrió un error");
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        setDeleteLoading(id);
        const res = await deleteCategoryAction(id);
        if (res.success) {
            toast.success("Categoría eliminada");
            setCategories(prev => prev.filter(c => c.id !== id));
            router.refresh();
        } else {
            toast.error(res.error || "Error al eliminar");
        }
        setDeleteLoading(null);
    };

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex bg-white/[0.03] border border-white/[0.05] p-1 rounded-2xl mb-8">
                {['expense', 'income'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={cn(
                            "relative flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                            activeTab === tab ? "text-white" : "text-white/40 hover:text-white/60"
                        )}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="categoryTabBg"
                                className="absolute inset-0 bg-white/10 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 capitalize">{tab === 'expense' ? 'Gastos' : 'Ingresos'}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3 mb-8">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-10 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                        <Tag className="w-10 h-10 text-white/20 mx-auto mb-3" />
                        <p className="text-white/50 text-sm font-medium">No hay categorías de {activeTab === 'expense' ? 'gasto' : 'ingreso'}</p>
                    </div>
                ) : (
                    filteredCategories.map((cat) => {
                        const Icon = ALL_ICONS[cat.icon || 'Box'] || Box;
                        const isDeleting = deleteLoading === cat.id;

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={cat.id}
                                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${cat.color}20`, color: cat.color || '#fff' }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-white/90">{cat.name}</span>
                                </div>

                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    disabled={isDeleting}
                                    className="p-2 text-rose-500/50 hover:text-rose-500 bg-rose-500/0 hover:bg-rose-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Fab Button to Add */}
            <AnimatePresence>
                {!isAddOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-center"
                    >
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex items-center gap-2 bg-white text-black px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Nueva Categoría
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Form */}
            <AnimatePresence>
                {isAddOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 rounded-3xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white tracking-tight">Crear Categoría</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Name Input */}
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nombre</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Ej. Supermercado, Sueldo..."
                                        className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl px-4 py-3.5 focus:outline-none focus:border-white/[0.2] transition-colors"
                                        autoFocus
                                    />
                                </div>

                                {/* Icon Selector */}
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Ícono</label>
                                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                                        {Object.keys(ALL_ICONS).map(iconName => {
                                            const IconComp = ALL_ICONS[iconName];
                                            const isSelected = selectedIcon === iconName;
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setSelectedIcon(iconName)}
                                                    className={cn(
                                                        "aspect-square rounded-xl flex items-center justify-center transition-all",
                                                        isSelected ? "bg-white text-black" : "bg-white/[0.02] border border-white/[0.05] text-white/50 hover:bg-white/[0.06] hover:text-white"
                                                    )}
                                                >
                                                    <IconComp className="w-5 h-5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Color Selector */}
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Color</label>
                                    <div className="flex flex-wrap gap-3">
                                        {COLORS.map(color => {
                                            const isSelected = selectedColor === color;
                                            return (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full transition-all flex items-center justify-center ring-offset-2 ring-offset-[#0A0A0A]",
                                                        isSelected ? "ring-2 ring-white scale-110" : "hover:scale-110"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        'Guardar Categoría'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
