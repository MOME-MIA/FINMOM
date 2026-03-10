"use client";

import { useState, useTransition } from "react";
import { DimAccount } from "@/types/finance";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import { Wallet, Plus, CreditCard, Landmark, Box, TrendingUp, MoreHorizontal, ArrowUpRight, ArrowDownRight, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyIcon } from "@/components/ui/CurrencyIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { saveAccountAction, deleteAccountAction, updateAccountAction } from "@/app/actions";
import { getProviderIcon, getProviderBrandColor } from "@/components/ui/ProviderLogos";

const POPULAR_PROVIDERS = [
    "Mercado Pago",
    "Ualá",
    "Brubank",
    "Banco Santander",
    "HSBC",
    "Binance",
    "Payoneer",
    "DolarApp",
    "Personal Pay",
    "Naranja X",
    "Lemon Cash",
    "Belo",
    "Buenbit",
    "Banco Galicia",
    "Banco BBVA",
    "Banco Macro",
    "Banco Provincia",
    "Banco Nación",
    "Efectivo",
    "Otro"
];

interface AccountsClientProps {
    initialAccounts: DimAccount[];
}

export function AccountsClient({ initialAccounts }: AccountsClientProps) {
    const { display, convert } = useCurrency();
    const [accounts, setAccounts] = useState<DimAccount[]>(initialAccounts);
    const [isPending, startTransition] = useTransition();

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<DimAccount | null>(null);
    const [isCustomProvider, setIsCustomProvider] = useState(false);
    const [isCustomCurrency, setIsCustomCurrency] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        provider: "",
        customProvider: "",
        currencyCode: "USD",
        customCurrency: "",
        currentBalance: "0"
    });

    // Total Portfolio Value in selected display currency
    const totalPortfolioValue = accounts.reduce((acc, account) => {
        if (!account.isActive) return acc;
        return acc + convert(account.currentBalance, account.currencyCode, display);
    }, 0);

    // The local getIcon has been replaced by the imported getProviderIcon

    const formatMoney = (amount: number, currencyFormat: string) => {
        const isExact = amount % 1 === 0;
        if (currencyFormat === 'USD') return `US$${amount.toLocaleString('en-US', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        if (currencyFormat === 'EUR') return `€${amount.toLocaleString('es-ES', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
        return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: isExact ? 0 : 2, maximumFractionDigits: 2 })}`;
    };

    // Group accounts by currency explicitly
    const groupedAccounts = accounts.reduce((acc, account) => {
        if (!acc[account.currencyCode]) acc[account.currencyCode] = [];
        acc[account.currencyCode].push(account);
        return acc;
    }, {} as Record<string, DimAccount[]>);

    const handleSaveAccount = async () => {
        if (!formData.name || !formData.provider) return;

        startTransition(async () => {
            const finalProvider = formData.provider === "Otro" ? formData.customProvider : formData.provider;
            const finalCurrency = formData.currencyCode === "Otro" ? formData.customCurrency.toUpperCase() : formData.currencyCode;
            const dataToSave = {
                name: formData.name,
                provider: finalProvider || "Cuenta",
                currencyCode: (finalCurrency || "USD") as any,
                initialBalance: parseFloat(formData.currentBalance) || 0,
                currentBalance: parseFloat(formData.currentBalance) || 0,
                color: getProviderBrandColor(finalProvider || "Cuenta")
            };

            if (selectedAccount) {
                // Edit mode
                const updated = await updateAccountAction(selectedAccount.id, {
                    name: dataToSave.name,
                    provider: dataToSave.provider,
                    currencyCode: dataToSave.currencyCode,
                    currentBalance: dataToSave.currentBalance,
                    color: dataToSave.color
                });

                if (updated) {
                    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
                    setIsAddModalOpen(false);
                    setSelectedAccount(null);
                    setFormData({ name: "", provider: "", customProvider: "", currencyCode: "USD", customCurrency: "", currentBalance: "0" });
                    setIsCustomProvider(false);
                    setIsCustomCurrency(false);
                }
            } else {
                // Create mode
                const saved = await saveAccountAction(dataToSave);
                if (saved) {
                    setAccounts(prev => [saved, ...prev]);
                    setIsAddModalOpen(false);
                    setFormData({ name: "", provider: "", customProvider: "", currencyCode: "USD", customCurrency: "", currentBalance: "0" });
                    setIsCustomProvider(false);
                    setIsCustomCurrency(false);
                }
            }
        });
    };

    const handleDeleteAccount = async () => {
        if (!selectedAccount) return;

        startTransition(async () => {
            const success = await deleteAccountAction(selectedAccount.id);
            if (success) {
                setAccounts(prev => prev.filter(a => a.id !== selectedAccount.id));
                setIsEditModalOpen(false);
                setSelectedAccount(null);
            }
        });
    };

    const openEditModal = (account: DimAccount) => {
        setSelectedAccount(account);
        const isPopular = POPULAR_PROVIDERS.includes(account.provider);
        const isPopularCurrency = ["ARS", "USD", "EUR", "USDT", "BTC", "USDC", "ETH"].includes(account.currencyCode);
        setFormData({
            name: account.name,
            provider: isPopular ? account.provider : "Otro",
            customProvider: isPopular ? "" : account.provider,
            currencyCode: isPopularCurrency ? account.currencyCode : "Otro",
            customCurrency: isPopularCurrency ? "" : account.currencyCode,
            currentBalance: account.currentBalance.toString()
        });
        setIsCustomProvider(!isPopular);
        setIsCustomCurrency(!isPopularCurrency);
        setIsAddModalOpen(true);
    };

    const openDeleteModal = (account: DimAccount) => {
        setSelectedAccount(account);
        setIsEditModalOpen(true);
    };

    return (
        <div className="relative flex-1 w-full min-h-screen overflow-hidden">

            <div className="flex flex-col h-full pb-32 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 md:pt-12 relative z-10">
                {/* Header Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-5xl font-sans tracking-tight font-medium text-white/95">
                            Patrimonio
                        </h1>
                        <p className="text-[15px] md:text-base text-white/50 font-normal">
                            Valor total consolidado de todas tus billeteras y bóvedas.
                        </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                        <span className="text-[11px] uppercase tracking-widest text-white/50 font-medium">Valor Total ({display})</span>
                        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {formatMoney(totalPortfolioValue, display)}
                        </h2>
                    </div>
                </motion.div>

                {/* Quick Actions / Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 flex items-center gap-3 mb-10"
                >
                    <button
                        onClick={() => {
                            setSelectedAccount(null);
                            setFormData({ name: "", provider: "", customProvider: "", currencyCode: "USD", customCurrency: "", currentBalance: "0" });
                            setIsCustomProvider(false);
                            setIsCustomCurrency(false);
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/[0.15] text-white px-5 py-2.5 rounded-[16px] font-medium text-[14px] transition-all duration-300 ease-out outline-none backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(255,255,255,0.05)]"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        Agregar Cuenta
                    </button>
                </motion.div>

                {/* Content Grouped by Currency */}
                <div className="flex flex-col gap-10">
                    <AnimatePresence>
                        {Object.entries(groupedAccounts).map(([currencyCode, currencyAccounts], gIndex) => {
                            const subTotal = currencyAccounts.reduce((sum, a) => sum + (a.isActive ? a.currentBalance : 0), 0);

                            return (
                                <motion.section
                                    key={currencyCode}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 + (gIndex * 0.1), ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col gap-4"
                                >
                                    {/* Currency Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <CurrencyIcon code={currencyCode} className="w-8 h-8 pointer-events-none opacity-90 drop-shadow-md" />
                                            <h3 className="text-[19px] font-medium text-white/90 tracking-tight">{currencyCode}</h3>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[11px] uppercase tracking-widest text-white/50 font-medium">Subtotal Nominal</span>
                                            <span className="text-[17px] font-sans font-medium text-white/90 tabular-nums tracking-tight">
                                                {formatMoney(subTotal, currencyCode)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Accounts Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currencyAccounts.map((account, index) => (
                                            <motion.div
                                                key={account.id}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.3 + (index * 0.05), ease: [0.22, 1, 0.36, 1] }}
                                                className="group relative z-10 flex flex-col justify-between overflow-hidden bg-white/[0.02] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-7 transition-all duration-500 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                                            >
                                                {/* Subtle inner top highlight */}
                                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>

                                                <div className="absolute top-0 left-0 w-full h-[2px] opacity-30" style={{ background: `linear-gradient(90deg, ${account.color || '#fff'}, transparent)` }} />

                                                <div className="flex items-start justify-between mb-10">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="w-12 h-12 rounded-[16px] flex items-center justify-center bg-white/5 border border-white/10 shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]"
                                                            style={{ color: account.color || '#fff' }}
                                                        >
                                                            {getProviderIcon(account.provider)}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[16px] font-medium tracking-tight text-white/90">{account.name}</span>
                                                            <span className="text-[13px] text-white/50 font-normal">{account.provider}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => openEditModal(account)}
                                                        className="p-2 text-white/50 group-hover:text-white/80 transition-colors duration-300 rounded-full hover:bg-white/10 outline-none"
                                                    >
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-end justify-between mt-auto">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] uppercase tracking-widest text-white/50 font-medium">Balance</span>
                                                        <span className="text-[26px] font-sans font-medium tracking-tight text-white tabular-nums drop-shadow-sm">
                                                            {formatMoney(account.currentBalance, account.currencyCode)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {!account.isActive && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center rounded-[32px] z-20">
                                                        <span className="bg-white/[0.05] px-4 py-2 border border-white/10 rounded-full text-[13px] font-medium text-white/60 shadow-lg">Cuenta Inactiva</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.section>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Account Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>{selectedAccount ? "Editar Cuenta" : "Agregar Nueva Cuenta"}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider">Nombre de la cuenta</label>
                            <Input
                                placeholder="Ej: Cuenta Sueldo"
                                value={formData.name}
                                onChange={(e) => setFormData(s => ({ ...s, name: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider">Proveedor/Institución</label>
                            <Select
                                value={formData.provider}
                                onValueChange={(val: string) => {
                                    setFormData(s => ({ ...s, provider: val }));
                                    setIsCustomProvider(val === "Otro");
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Ej: Mercado Pago, Galicia, Binance" />
                                </SelectTrigger>
                                <SelectContent>
                                    {POPULAR_PROVIDERS.map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {isCustomProvider && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex flex-col gap-2"
                            >
                                <label className="text-xs text-white/50 uppercase tracking-wider">Especificar Institución</label>
                                <Input
                                    placeholder="Nombre de tu institución"
                                    value={formData.customProvider}
                                    onChange={(e) => setFormData(s => ({ ...s, customProvider: e.target.value }))}
                                />
                            </motion.div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider">Moneda</label>
                            <Select
                                value={formData.currencyCode}
                                onValueChange={(val: string) => {
                                    setFormData(s => ({ ...s, currencyCode: val }));
                                    setIsCustomCurrency(val === "Otro");
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona Moneda" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="ARS">ARS - Pesos Argentinos</SelectItem>
                                    <SelectItem value="USD">USD - Dólares</SelectItem>
                                    <SelectItem value="EUR">EUR - Euros</SelectItem>
                                    <SelectItem value="USDT">USDT - Tether</SelectItem>
                                    <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                                    <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                                    <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                                    <SelectItem value="Otro">Otra moneda / Token Custom...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {isCustomCurrency && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex flex-col gap-2"
                            >
                                <label className="text-xs text-white/50 uppercase tracking-wider">Código de la Moneda/Token</label>
                                <Input
                                    placeholder="Ej: GBP, ADA, SOL"
                                    value={formData.customCurrency}
                                    maxLength={8}
                                    className="uppercase"
                                    onChange={(e) => setFormData(s => ({ ...s, customCurrency: e.target.value.toUpperCase() }))}
                                />
                            </motion.div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider">Balance Inicial</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.currentBalance}
                                onChange={(e) => setFormData(s => ({ ...s, currentBalance: e.target.value }))}
                            />
                        </div>

                        <button
                            onClick={handleSaveAccount}
                            disabled={isPending || !formData.name || !formData.provider || (isCustomProvider && !formData.customProvider) || (isCustomCurrency && !formData.customCurrency)}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-black px-5 py-3.5 rounded-[16px] font-medium text-[15px] transition-all duration-300 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (selectedAccount ? "Actualizar Cuenta" : "Guardar Cuenta")}
                        </button>
                    </div>

                    {selectedAccount && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <span className="text-xs font-medium text-red-500 mb-3 block">Zona de Peligro</span>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setIsEditModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-3 rounded-[12px] font-medium text-[14px] transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar Cuenta
                            </button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Account Modal (Confirmation) */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Eliminar Cuenta</DialogTitle>
                    </DialogHeader>
                    {selectedAccount && (
                        <div className="flex flex-col gap-6 mt-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[16px] font-medium text-white">{selectedAccount.name}</span>
                                <span className="text-[13px] text-white/50">{selectedAccount.provider} • {selectedAccount.currencyCode}</span>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col gap-3">
                                <span className="text-sm font-medium text-red-500">Zona de Peligro</span>
                                <p className="text-xs text-red-500/70">
                                    Al eliminar esta cuenta también se podrían ver afectadas sus transacciones. Esta acción no se puede deshacer.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isPending}
                                    className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium text-[14px] transition-colors disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Eliminar Cuenta
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}
