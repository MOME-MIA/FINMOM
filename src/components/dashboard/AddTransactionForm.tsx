'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpDown,
    Wallet,
    CalendarDays,
    Tag,
    StickyNote,
    Briefcase,
    TrendingDown,
    TrendingUp,
    Repeat,
    Zap,
    Loader2,
    ChevronDown,
} from 'lucide-react';
import { TransactionFormValues, transactionSchema } from '@/lib/validations/transaction';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { Button } from '@/components/ui/Button';
import { addTransaction, fetchAccounts, fetchCategories } from '@/lib/db';
import { DimAccount, DimCategory } from '@/types/finance';
import { toast } from 'sonner';

const fieldVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
    }),
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
};

export function AddTransactionForm() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<DimAccount[]>([]);
    const [categories, setCategories] = useState<DimCategory[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [accs, cats] = await Promise.all([
                    fetchAccounts(),
                    fetchCategories('expense'),
                ]);
                setAccounts(accs);
                setCategories(cats.length > 0 ? cats : [{ id: 'cat_1', name: 'General', type: 'expense', icon: 'Box', color: '#666', parentId: null, sortOrder: 0 }]);
            } catch (err) {
                console.error("Failed to load dependency data", err);
            } finally {
                setIsFetchingData(false);
            }
        };
        loadInitialData();
    }, []);

    const {
        exchangeRate,
        baseCurrency,
        setBaseCurrency,
        baseAmount,
        setBaseAmount,
        convertedAmount,
        convertedCurrency,
    } = useCurrencyConversion('ARS');

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting, isValid },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        mode: 'onChange',
        defaultValues: {
            type: 'expense',
            currency: 'ARS',
            date: new Date(),
            accountId: '',
            exchangeRate: 1000,
        },
    });

    const parsedAmount = parseFloat(baseAmount) || 0;
    const transactionType = watch('type');

    const handleAmountChange = (val: string) => {
        if (/^\d*\.?\d*$/.test(val)) {
            setBaseAmount(val);
            setValue('amount', parseFloat(val) || 0, { shouldValidate: true });
        }
    };

    const toggleCurrency = () => {
        const nextCurrency = baseCurrency === 'ARS' ? 'USD' : 'ARS';
        setBaseCurrency(nextCurrency);
        setValue('currency', nextCurrency, { shouldValidate: true });
    };

    const onSubmit = async (data: TransactionFormValues) => {
        try {
            const amountUsd = data.currency === 'USD' ? data.amount : data.amount / exchangeRate;
            const amountArs = data.currency === 'ARS' ? data.amount : data.amount * exchangeRate;

            const res = await addTransaction({
                date: data.date.toISOString().split('T')[0],
                type: data.type,
                amountARS: amountArs,
                amountUSD: amountUsd,
                category: data.categoryId || (data.type === 'income' ? 'income_cat' : ''),
                description: data.type === 'income' ? data.source : data.note,
                accountId: data.accountId,
                fxRate: exchangeRate,
                fxSource: 'dolarapi_blue',
                fxTimestamp: new Date().toISOString()
            });

            if (!res) throw new Error("Database insertion failed");

            toast.success(data.type === 'income' ? 'Ingreso registrado' : 'Gasto registrado');
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to create transaction:', error);
            toast.error('Ocurrió un error al guardar la transacción');
        }
    };

    if (isFetchingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-zinc-800/60" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
                </div>
                <p className="text-zinc-500 text-sm font-medium tracking-wide">Preparando formulario...</p>
            </div>
        );
    }

    const isIncome = transactionType === 'income';

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

            {/* ── HEADER: Type Toggle (centered) ── */}
            <div className="flex items-center justify-center">
                <div className="flex bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-1 border border-white/[0.06] shadow-lg shadow-black/20">
                    <motion.button
                        type="button"
                        onClick={() => setValue('type', 'expense', { shouldValidate: true })}
                        className={`relative px-5 sm:px-7 py-2.5 rounded-xl text-[13px] sm:text-sm font-semibold transition-colors min-h-[44px] ${!isIncome ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        whileTap={{ scale: 0.97 }}
                    >
                        {!isIncome && (
                            <motion.div
                                layoutId="typeToggle"
                                className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-xl shadow-sm"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            <TrendingDown className="w-3.5 h-3.5" />
                            Gasto
                        </span>
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={() => setValue('type', 'income', { shouldValidate: true })}
                        className={`relative px-5 sm:px-7 py-2.5 rounded-xl text-[13px] sm:text-sm font-semibold transition-colors min-h-[44px] ${isIncome ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isIncome && (
                            <motion.div
                                layoutId="typeToggle"
                                className="absolute inset-0 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl shadow-sm"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Ingreso
                        </span>
                    </motion.button>
                </div>
            </div>

            {/* ── HERO: Amount Input ── */}
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isIncome ? 'income-input' : 'expense-input'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex items-baseline justify-center gap-1"
                    >
                        <span className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-none transition-colors duration-300 ${isIncome ? 'text-emerald-500' : 'text-rose-500'
                            }`}>
                            $
                        </span>
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0"
                            value={baseAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className={`w-full max-w-[240px] sm:max-w-[280px] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-none bg-transparent border-none text-center focus:outline-none focus:ring-0 placeholder-zinc-800 transition-colors duration-300 ${isIncome ? 'text-emerald-400' : 'text-white'
                                }`}
                            style={{ caretColor: isIncome ? '#34d399' : '#f43f5e' }}
                            autoFocus
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Currency Badge */}
                <motion.div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                    initial={false}
                >
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{baseCurrency}</span>
                </motion.div>

                {/* Dual Currency Toggle */}
                <AnimatePresence mode="wait">
                    <motion.button
                        type="button"
                        key={baseCurrency}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all bg-white/[0.02] hover:bg-white/[0.05] px-4 py-2.5 min-h-[44px] rounded-2xl border border-white/[0.06]"
                        onClick={toggleCurrency}
                        title="Cambiar moneda principal"
                    >
                        <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-sm font-medium tabular-nums">
                            ≈ {convertedCurrency === 'ARS' ? '$' : 'US$'}{' '}
                            {convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                            <span className="text-zinc-500">{convertedCurrency}</span>
                        </span>
                    </motion.button>
                </AnimatePresence>

                {errors.amount && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-rose-400 text-xs sm:text-sm font-medium"
                    >
                        {errors.amount.message}
                    </motion.p>
                )}
            </div>

            {/* ── FORM FIELDS CARD ── */}
            <motion.div
                layout
                className="bg-white/[0.02] rounded-[20px] sm:rounded-[24px] border border-white/[0.06] shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-sm"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isIncome ? 'income-fields' : 'expense-fields'}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Account Selector */}
                        <motion.div variants={fieldVariants} custom={0} className="px-4 sm:px-5 py-4 sm:py-5 border-b border-white/[0.04]">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                <Wallet className="w-3.5 h-3.5" />
                                Cuenta {isIncome ? 'Destino' : 'Origen'}
                            </label>
                            <Controller
                                control={control}
                                name="accountId"
                                render={({ field }) => (
                                    <div className="relative">
                                        <select
                                            {...field}
                                            className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 appearance-none focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium min-h-[48px]"
                                        >
                                            <option value="" disabled className="text-zinc-500 bg-zinc-900">Seleccionar cuenta...</option>
                                            {accounts.map((acc) => (
                                                <option key={acc.id} value={acc.id} className="text-zinc-200 bg-zinc-900">{acc.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    </div>
                                )}
                            />
                            {errors.accountId && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.accountId.message}</p>}
                        </motion.div>

                        {/* Date Selector */}
                        <motion.div variants={fieldVariants} custom={1} className="px-4 sm:px-5 py-4 sm:py-5 border-b border-white/[0.04]">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                <CalendarDays className="w-3.5 h-3.5" />
                                Fecha
                            </label>
                            <Controller
                                control={control}
                                name="date"
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                        className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium min-h-[48px]"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                )}
                            />
                            {errors.date && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.date.message}</p>}
                        </motion.div>

                        {/* EXPENSE-ONLY Fields */}
                        {!isIncome && (
                            <>
                                {/* Category */}
                                <motion.div variants={fieldVariants} custom={2} className="px-4 sm:px-5 py-4 sm:py-5 border-b border-white/[0.04]">
                                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                        <Tag className="w-3.5 h-3.5" />
                                        Categoría
                                    </label>
                                    <Controller
                                        control={control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <div className="relative">
                                                <select
                                                    {...field}
                                                    className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 appearance-none focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium min-h-[48px]"
                                                >
                                                    <option value="" disabled className="text-zinc-500 bg-zinc-900">Seleccionar categoría...</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id} className="text-zinc-200 bg-zinc-900">{cat.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                            </div>
                                        )}
                                    />
                                    {errors.categoryId && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.categoryId.message}</p>}
                                </motion.div>

                                {/* Expense Nature Toggle */}
                                <motion.div variants={fieldVariants} custom={3} className="px-4 sm:px-5 py-4 sm:py-5 border-b border-white/[0.04]">
                                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                                        <Zap className="w-3.5 h-3.5" />
                                        Tipo de Gasto
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        <Controller
                                            control={control}
                                            name="expenseNature"
                                            render={({ field }) => (
                                                <>
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => field.onChange('variable')}
                                                        whileTap={{ scale: 0.97 }}
                                                        className={`flex flex-col items-center gap-1.5 py-3.5 sm:py-4 px-3 rounded-xl sm:rounded-2xl border text-sm font-medium transition-all min-h-[48px] ${field.value === 'variable'
                                                            ? 'bg-rose-500/[0.08] border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/5'
                                                            : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/[0.1] hover:bg-white/[0.04]'
                                                            }`}
                                                    >
                                                        <Zap className={`w-4 h-4 ${field.value === 'variable' ? 'text-rose-400' : 'text-zinc-500'}`} />
                                                        <span className="text-[13px] font-semibold">Variable</span>
                                                        <span className="text-[10px] text-zinc-500 font-medium">Extra</span>
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => field.onChange('fixed')}
                                                        whileTap={{ scale: 0.97 }}
                                                        className={`flex flex-col items-center gap-1.5 py-3.5 sm:py-4 px-3 rounded-xl sm:rounded-2xl border text-sm font-medium transition-all min-h-[48px] ${field.value === 'fixed'
                                                            ? 'bg-amber-500/[0.08] border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/5'
                                                            : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/[0.1] hover:bg-white/[0.04]'
                                                            }`}
                                                    >
                                                        <Repeat className={`w-4 h-4 ${field.value === 'fixed' ? 'text-amber-400' : 'text-zinc-500'}`} />
                                                        <span className="text-[13px] font-semibold">Fijo</span>
                                                        <span className="text-[10px] text-zinc-500 font-medium">Recurrente</span>
                                                    </motion.button>
                                                </>
                                            )}
                                        />
                                    </div>
                                    {errors.expenseNature && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.expenseNature.message}</p>}
                                </motion.div>

                                {/* Note */}
                                <motion.div variants={fieldVariants} custom={4} className="px-4 sm:px-5 py-4 sm:py-5">
                                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                        <StickyNote className="w-3.5 h-3.5" />
                                        Nota <span className="text-zinc-600 normal-case font-normal">(Opcional)</span>
                                    </label>
                                    <Controller
                                        control={control}
                                        name="note"
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="Ej. Cena con amigos..."
                                                className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium placeholder-zinc-600 min-h-[48px]"
                                            />
                                        )}
                                    />
                                </motion.div>
                            </>
                        )}

                        {/* INCOME-ONLY Fields */}
                        {isIncome && (
                            <motion.div variants={fieldVariants} custom={2} className="px-4 sm:px-5 py-4 sm:py-5">
                                <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    Fuente
                                </label>
                                <Controller
                                    control={control}
                                    name="source"
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Ej. Sueldo, Freelance..."
                                            className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium placeholder-zinc-600 min-h-[48px]"
                                        />
                                    )}
                                />
                                {errors.source && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.source.message}</p>}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* ── FX Rate Info ── */}
            {exchangeRate > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <p className="text-[11px] text-zinc-600 font-medium tracking-wide">
                        TC Blue: 1 USD = {exchangeRate.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                    </p>
                </motion.div>
            )}

            {/* Bottom spacer to prevent content from hiding behind sticky button + navbar */}
            <div className="h-28 md:h-24" />

            {/* ── STICKY SUBMIT BUTTON ── */}
            <div className="fixed bottom-[var(--nav-height)] md:bottom-0 left-0 right-0 z-20 pointer-events-none">
                <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-6 pb-3 md:pb-[max(1.25rem,env(safe-area-inset-bottom))] px-4 sm:px-6">
                    <div className="max-w-2xl w-full mx-auto pointer-events-auto">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting || parsedAmount <= 0}
                                className={`w-full py-4 sm:py-5 text-[15px] sm:text-base font-bold rounded-2xl shadow-2xl transition-all duration-300 min-h-[56px] flex items-center justify-center gap-2 ${!isValid || parsedAmount <= 0
                                    ? 'bg-white/[0.04] text-zinc-600 cursor-not-allowed border border-white/[0.04]'
                                    : isIncome
                                        ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/30 border border-emerald-500/20'
                                        : 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-900/30 border border-rose-500/20'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    `Guardar ${isIncome ? 'Ingreso' : 'Gasto'}`
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </form>
    );
}
