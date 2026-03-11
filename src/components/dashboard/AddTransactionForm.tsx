'use client';

import { useState, useEffect, useRef } from 'react';
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
    ArrowLeftRight,
} from 'lucide-react';
import { TransactionFormValues, transactionSchema } from '@/lib/validations/transaction';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useCurrency } from '@/context/CurrencyContext';
import { Button } from '@/components/ui/Button';
import { addTransaction, fetchAccounts, fetchCategories } from '@/lib/db';
import { createTransferAction } from '@/app/actions';
import { DimAccount, DimCategory } from '@/types/finance';
import { toast } from 'sonner';
import { SwipeButton } from '@/components/ui/SwipeButton';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Delete } from 'lucide-react';

const formatDisplayAmount = (val: string) => {
    if (!val) return '0';
    const parts = val.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (parts.length > 1) {
        return `${integerPart},${parts[1]}`;
    }
    return integerPart;
};

const getCurrencySymbol = (code: string | undefined): string => {
    if (code === 'EUR') return '€';
    if (code === 'BTC') return '₿';
    if (code === 'GBP') return '£';
    return '$';
};

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
    const [activeField, setActiveField] = useState<string | null>(null);
    const [showNumpad, setShowNumpad] = useState(true);

    useEffect(() => {
        if (activeField) {
            setShowNumpad(false);
        }
    }, [activeField]);

    // Styling logic for Spotlight focus
    const getFieldClassName = (fieldName: string) => {
        const isOtherFocused = activeField !== null && activeField !== fieldName;

        return `relative px-4 sm:px-5 py-3 sm:py-4 transition-all duration-500 rounded-xl sm:rounded-2xl ${isOtherFocused
            ? 'opacity-30 grayscale-[0.5]'
            : ''
            }`;
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [accs, cats] = await Promise.all([
                    fetchAccounts(),
                    fetchCategories('expense'),
                ]);
                setAccounts(accs);
                console.log("Categories loaded from DB:", cats);
                setCategories(cats);
            } catch (err) {
                console.error("Failed to load dependency data", err);
            } finally {
                setIsFetchingData(false);
            }
        };
        loadInitialData();
    }, []);

    const { display: globalCurrency } = useCurrency();
    const safeGlobalCurrency = globalCurrency === 'USD' ? 'USD' : 'ARS';

    const {
        exchangeRate,
        baseCurrency,
        setBaseCurrency,
        baseAmount,
        setBaseAmount,
        convertedAmount,
        convertedCurrency,
    } = useCurrencyConversion(safeGlobalCurrency);

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
            currency: safeGlobalCurrency,
            date: new Date(),
            accountId: '',
            exchangeRate: 1000,
        },
    });

    const accountOptions = accounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        subtext: acc.currencyCode,
        color: acc.color || '#3b82f6'
    }));

    const categoryOptions = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color || '#14b8a6'
    }));

    const parsedAmount = parseFloat(baseAmount) || 0;
    const transactionType = watch('type');
    const selectedAccountId = watch('accountId');

    const prevGlobalCurrency = useRef(globalCurrency);
    const prevAccountId = useRef(selectedAccountId);

    useEffect(() => {
        const globalChanged = prevGlobalCurrency.current !== globalCurrency;
        const accountChanged = prevAccountId.current !== selectedAccountId;

        prevGlobalCurrency.current = globalCurrency;
        prevAccountId.current = selectedAccountId;

        const getSafeCurrency = (code: string | undefined): 'ARS' | 'USD' => code === 'USD' ? 'USD' : 'ARS';

        if (accountChanged) {
            const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
            if (selectedAccount && selectedAccount.currencyCode) {
                const safeCode = getSafeCurrency(selectedAccount.currencyCode);
                setBaseCurrency(safeCode);
                setValue('currency', safeCode, { shouldValidate: true });
            } else if (!selectedAccount?.currencyCode) {
                const safeCode = getSafeCurrency(globalCurrency);
                setBaseCurrency(safeCode);
                setValue('currency', safeCode, { shouldValidate: true });
            }
        } else if (globalChanged) {
            const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
            if (!selectedAccountId || !selectedAccount?.currencyCode) {
                const safeCode = getSafeCurrency(globalCurrency);
                setBaseCurrency(safeCode);
                setValue('currency', safeCode, { shouldValidate: true });
            }
        }
    }, [globalCurrency, selectedAccountId, accounts, setBaseCurrency, setValue]);

    const handleAmountChange = (val: string) => {
        if (/^\d*\.?\d{0,2}$/.test(val)) {
            setBaseAmount(val);
            setValue('amount', parseFloat(val) || 0, { shouldValidate: true });
        }
    };

    const handleNumpadPress = (key: string) => {
        if (key === 'backspace') {
            const newVal = baseAmount.slice(0, -1);
            setBaseAmount(newVal);
            setValue('amount', parseFloat(newVal) || 0, { shouldValidate: true });
        } else if (key === '.') {
            if (!baseAmount.includes('.')) {
                const newVal = baseAmount ? baseAmount + '.' : '0.';
                setBaseAmount(newVal);
                // No actualiza el schema numerico final si solo es "0."
            }
        } else {
            // Prevent leading zeros issues
            let newVal = baseAmount === '0' && key !== '.' ? key : baseAmount + key;
            if (/^\d*\.?\d{0,2}$/.test(newVal)) {
                if (newVal.length > 12) return; // limit length
                setBaseAmount(newVal);
                setValue('amount', parseFloat(newVal) || 0, { shouldValidate: true });
            }
        }
    };

    const toggleCurrency = () => {
        const nextCurrency = baseCurrency === 'ARS' ? 'USD' : 'ARS';
        setBaseCurrency(nextCurrency);
        setValue('currency', nextCurrency, { shouldValidate: true });
    };

    const onSubmit = async (data: TransactionFormValues) => {
        try {
            if (data.type === 'transfer') {
                if (!data.destAccountId) throw new Error("Missing destAccountId");

                // If it's a cross-currency transfer, use destAmount, otherwise use the same amount sent
                const destAmount = showDestAmount && data.destAmount ? data.destAmount : data.amount;

                const res = await createTransferAction({
                    date: data.date.toISOString().split('T')[0],
                    sourceAccountId: data.accountId,
                    amountSent: data.amount,
                    destAccountId: data.destAccountId,
                    amountReceived: destAmount,
                    description: data.note || ''
                });

                if (!res.success) throw new Error(res.error || "Transfer failed");

                toast.success('Transferencia registrada');
                router.push('/dashboard');
                return;
            }

            const amountUsd = data.currency === 'USD' ? data.amount : data.amount / exchangeRate;
            const amountArs = data.currency === 'ARS' ? data.amount : data.amount * exchangeRate;

            console.log("Submitting with categoryId:", data.categoryId);

            const res = await addTransaction({
                date: data.date.toISOString().split('T')[0],
                type: data.type,
                amountARS: amountArs,
                amountUSD: amountUsd,
                category: data.categoryId || null,
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
            toast.error('Ocurrió un error al guardar o transferir');
        }
    };

    if (isFetchingData) {
        return (
            <div className="flex flex-col space-y-8 py-4">
                {/* Tabs Skeleton */}
                <div className="flex items-center justify-center">
                    <div className="flex bg-zinc-900/50 rounded-2xl p-1 border border-white/[0.04] w-[300px] h-[54px] animate-pulse"></div>
                </div>

                {/* Amount Skeleton */}
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-[180px] h-[70px] bg-zinc-800/30 rounded-2xl animate-pulse"></div>
                </div>

                {/* Numpad Skeleton */}
                <div className="px-6 grid grid-cols-3 gap-y-6 gap-x-8 max-w-sm mx-auto w-full">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-16 bg-zinc-800/20 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    const isIncome = transactionType === 'income';
    const isTransfer = transactionType === 'transfer';
    const destAccountId = watch('destAccountId');

    const sourceAccount = accounts.find(a => a.id === selectedAccountId);
    const destAccount = accounts.find(a => a.id === destAccountId);
    // showDestAmount allows entering the actual received amount, addressing potential transfer fees even on same-currency transfers.
    const showDestAmount = isTransfer && sourceAccount && destAccount;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

            {/* ── HEADER: Type Toggle (centered) ── */}
            <div className="flex items-center justify-center">
                <div className="flex bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-1 border border-white/[0.06] shadow-lg shadow-black/20">
                    <motion.button
                        type="button"
                        onClick={() => setValue('type', 'expense', { shouldValidate: true })}
                        className={`relative px-5 sm:px-7 py-2.5 rounded-xl text-[13px] sm:text-sm font-semibold transition-colors min-h-[44px] ${transactionType === 'expense' ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
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
                    <motion.button
                        type="button"
                        onClick={() => setValue('type', 'transfer', { shouldValidate: true })}
                        className={`relative px-5 sm:px-7 py-2.5 rounded-xl text-[13px] sm:text-sm font-semibold transition-colors min-h-[44px] ${isTransfer ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isTransfer && (
                            <motion.div
                                layoutId="typeToggle"
                                className="absolute inset-0 bg-blue-500/[0.08] border border-blue-500/20 rounded-xl shadow-sm"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            Transf.
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
                        <span className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-none transition-colors duration-300 ${isIncome ? 'text-emerald-500' : isTransfer ? 'text-blue-500' : 'text-rose-500'
                            }`}>
                            {getCurrencySymbol(sourceAccount?.currencyCode || globalCurrency)}
                        </span>
                        <div
                            onClick={() => { setShowNumpad(true); setActiveField(null); }}
                            className={`w-full max-w-[240px] sm:max-w-[280px] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-none bg-transparent border-none text-center transition-colors duration-300 min-h-[60px] flex items-center justify-center cursor-pointer ${baseAmount === '' ? 'text-zinc-700' : isIncome ? 'text-emerald-400' : isTransfer ? 'text-blue-400' : 'text-white'
                                }`}
                        >
                            {formatDisplayAmount(baseAmount)}
                            <motion.div
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className={`w-0.5 h-10 sm:h-12 ml-1 ${isIncome ? 'bg-emerald-400' : isTransfer ? 'bg-blue-400' : 'bg-rose-400'}`}
                            />
                        </div>
                    </motion.div>
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

            {/* ── CUSTOM NUMPAD ── */}
            <AnimatePresence>
                {(parsedAmount === 0 || showNumpad) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-3 gap-y-3 gap-x-6 sm:gap-x-12 max-w-[320px] mx-auto pt-4 pb-8">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                                <motion.button
                                    key={key}
                                    type="button"
                                    onClick={() => handleNumpadPress(key)}
                                    whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    className="h-16 rounded-2xl flex items-center justify-center text-3xl font-medium text-white/90 transition-colors"
                                >
                                    {key === 'backspace' ? <Delete className="w-8 h-8 text-zinc-400" /> : key}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FORM FIELDS CARD (Progressive Disclosure) ── */}
            <AnimatePresence>
                {parsedAmount > 0 && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                        className="bg-white/[0.02] rounded-[20px] sm:rounded-[24px] border border-white/[0.06] shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-sm"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isTransfer ? 'transfer-fields' : isIncome ? 'income-fields' : 'expense-fields'}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {/* Account Selector */}
                                <motion.div variants={fieldVariants} custom={0} className={getFieldClassName('accounts')}>
                                    {isTransfer ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-start sm:items-center justify-between gap-3">
                                                <div className="flex-1 w-full">
                                                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                                        <Wallet className="w-3.5 h-3.5" />
                                                        Origen
                                                    </label>
                                                    <Controller
                                                        control={control}
                                                        name="accountId"
                                                        render={({ field }) => (
                                                            <div className="relative">
                                                                <CustomSelect
                                                                    options={accountOptions}
                                                                    placeholder="Origen..."
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    onFocus={() => setActiveField('accounts')}
                                                                    onBlur={() => { field.onBlur(); setActiveField(null); }}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    {errors.accountId && <p className="text-rose-400 text-[10px] mt-1.5 font-medium">{errors.accountId.message}</p>}
                                                </div>

                                                <div className="flex flex-col items-center justify-center pt-7 sm:pt-6 px-1">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-800/50 border border-white/[0.04] flex items-center justify-center shadow-inner">
                                                        <div className="w-3 h-3 border-t-2 border-r-2 border-zinc-400 rotate-45 translate-x-[-2px]"></div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 w-full">
                                                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                                        <Wallet className="w-3.5 h-3.5" />
                                                        Destino
                                                    </label>
                                                    <Controller
                                                        control={control}
                                                        name="destAccountId"
                                                        render={({ field }) => (
                                                            <div className="relative">
                                                                <CustomSelect
                                                                    options={accountOptions}
                                                                    placeholder="Destino..."
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    onFocus={() => setActiveField('accounts')}
                                                                    onBlur={() => { field.onBlur(); setActiveField(null); }}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    {errors.destAccountId && <p className="text-rose-400 text-[10px] mt-1.5 font-medium">{errors.destAccountId.message}</p>}
                                                </div>
                                            </div>

                                            {showDestAmount && (
                                                <div className="mt-2 p-4 bg-zinc-900/50 rounded-xl border border-white/[0.04]">
                                                    <div className="flex items-center justify-between mb-2.5">
                                                        <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                                            Monto a Recibir ({destAccount?.currencyCode})
                                                        </label>
                                                        {(sourceAccount?.currencyCode !== destAccount?.currencyCode) && exchangeRate > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const amnt = sourceAccount?.currencyCode === 'USD'
                                                                        ? parsedAmount * exchangeRate
                                                                        : parsedAmount / exchangeRate;
                                                                    setValue('destAmount', parseFloat(amnt.toFixed(2)), { shouldValidate: true });
                                                                }}
                                                                className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold transition-colors border border-blue-500/20"
                                                            >
                                                                <Zap className="w-3 h-3" />
                                                                Auto FX
                                                            </button>
                                                        )}
                                                    </div>
                                                    <Controller
                                                        control={control}
                                                        name="destAmount"
                                                        render={({ field }) => (
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                                                    placeholder="0.00"
                                                                    className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl px-4 py-3 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-[15px] font-medium placeholder-zinc-600"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    {errors.destAmount && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.destAmount.message}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                                <Wallet className="w-3.5 h-3.5" />
                                                Cuenta {isIncome ? 'Destino' : 'Origen'}
                                            </label>
                                            <Controller
                                                control={control}
                                                name="accountId"
                                                render={({ field }) => (
                                                    <div className="relative">
                                                        <CustomSelect
                                                            options={accountOptions}
                                                            placeholder="Seleccionar cuenta..."
                                                            {...field}
                                                            value={field.value || ""}
                                                            onFocus={() => setActiveField('accounts')}
                                                            onBlur={() => { field.onBlur(); setActiveField(null); }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                            {errors.accountId && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.accountId.message}</p>}
                                        </>
                                    )}
                                </motion.div>

                                {/* Date Selector */}
                                <motion.div variants={fieldVariants} custom={1} className={getFieldClassName('date')}>
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
                                                onFocus={() => setActiveField('date')}
                                                onBlur={() => { field.onBlur(); setActiveField(null); }}
                                                className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium min-h-[48px]"
                                                style={{ colorScheme: 'dark' }}
                                            />
                                        )}
                                    />
                                    {errors.date && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.date.message}</p>}
                                </motion.div>

                                {/* EXPENSE-ONLY Fields */}
                                {(!isIncome && !isTransfer) && (
                                    <>
                                        {/* Category */}
                                        <motion.div variants={fieldVariants} custom={2} className={getFieldClassName('categoryId')}>
                                            <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                                                <Tag className="w-3.5 h-3.5" />
                                                Categoría
                                            </label>
                                            <Controller
                                                control={control}
                                                name="categoryId"
                                                render={({ field }) => (
                                                    <div className="relative">
                                                        <CustomSelect
                                                            options={categoryOptions}
                                                            placeholder="Seleccionar categoría..."
                                                            {...field}
                                                            value={field.value || ""}
                                                            onFocus={() => setActiveField('categoryId')}
                                                            onBlur={() => { field.onBlur(); setActiveField(null); }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                            {errors.categoryId && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.categoryId.message}</p>}
                                        </motion.div>

                                        {/* Expense Nature Toggle */}
                                        <motion.div variants={fieldVariants} custom={3} className={getFieldClassName('expenseNature')}>
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
                                                                onClick={() => { field.onChange('variable'); setActiveField('expenseNature'); }}
                                                                onFocus={() => setActiveField('expenseNature')}
                                                                onBlur={() => { field.onBlur(); setActiveField(null); }}
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
                                                                onClick={() => { field.onChange('fixed'); setActiveField('expenseNature'); }}
                                                                onFocus={() => setActiveField('expenseNature')}
                                                                onBlur={() => { field.onBlur(); setActiveField(null); }}
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
                                    </>
                                )}

                                {/* Note (Expense & Transfer) */}
                                {!isIncome && (
                                    <>
                                        <motion.div variants={fieldVariants} custom={4} className={getFieldClassName('note')}>
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
                                                        value={field.value || ""}
                                                        type="text"
                                                        placeholder="Ej. Cena con amigos..."
                                                        onFocus={() => setActiveField('note')}
                                                        onBlur={() => { field.onBlur(); setActiveField(null); }}
                                                        className="w-full bg-white/[0.03] text-white/90 border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.08] transition-all text-sm sm:text-[15px] font-medium placeholder-zinc-600 min-h-[48px]"
                                                    />
                                                )}
                                            />
                                        </motion.div>
                                    </>
                                )}

                                {/* INCOME-ONLY Fields */}
                                {isIncome && (
                                    <motion.div variants={fieldVariants} custom={2} className={getFieldClassName('source')}>
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
                                                    value={field.value || ""}
                                                    type="text"
                                                    placeholder="Ej. Sueldo, Freelance..."
                                                    onFocus={() => setActiveField('source')}
                                                    onBlur={() => { field.onBlur(); setActiveField(null); }}
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
                )}
            </AnimatePresence>



            {/* ── SUBMIT BUTTON ── */}
            <AnimatePresence>
                {parsedAmount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="pt-6 pb-32 sm:pb-24 px-1"
                    >
                        <div className="max-w-2xl w-full mx-auto">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <SwipeButton
                                    text={`Deslizar para ${isTransfer ? 'Transferir' : isIncome ? 'Ingresar' : 'Gastar'}`}
                                    successText="¡Registrado!"
                                    loadingText="Procesando..."
                                    disabled={!isValid || isSubmitting || parsedAmount <= 0}
                                    onConfirm={async () => {
                                        let success = false;
                                        await handleSubmit(async (data) => {
                                            await onSubmit(data);
                                            success = true;
                                        })();
                                        if (!success) {
                                            throw new Error("Validation Failed");
                                        }
                                    }}
                                    className={!isValid || parsedAmount <= 0 ? "opacity-50" : ""}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form >
    );
}
