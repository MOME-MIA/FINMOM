"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    WalletCards,
    Bitcoin,
    Menu,
    Plus,
    Activity,
    Target,
    History,
    Database,
    X,
    Wallet,
    Settings,
    Briefcase
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSoundFx } from "@/hooks/useSoundFx";

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { playHover, playClick } = useSoundFx();

    const mainNavItems = [
        { href: "/dashboard", label: "Home", icon: LayoutDashboard },
        { href: "/dashboard/expenses", label: "Gastos", icon: WalletCards },
    ];

    const rightNavItems = [
        { href: "/dashboard/analytics", label: "Analítica", icon: Activity },
    ];

    const extendedMenuTabs = [
        { href: "/dashboard/accounts", label: "Cuentas", icon: Wallet },
        { href: "/dashboard/budgets", label: "Presupuestos", icon: Target },
        { href: "/dashboard/history", label: "Historial", icon: History },
        { href: "/dashboard/audit", label: "Auditoría", icon: Database },
    ];

    return (
        <>
            {/* Extended Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 60, scale: 0.96 }}
                            transition={{ type: "spring", damping: 22, stiffness: 300, mass: 0.8 }}
                            className="fixed bottom-[calc(env(safe-area-inset-bottom)_+_100px)] left-4 right-4 z-[60] bg-[#111111]/70 backdrop-blur-3xl border border-white/[0.08] rounded-[32px] p-6 shadow-2xl md:hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-bold text-lg tracking-tight">Más herramientas</h3>
                                <button
                                    onClick={() => { playClick(); setIsMenuOpen(false); }}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {extendedMenuTabs.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => { playClick(); setIsMenuOpen(false); }}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-[24px] border transition-all active:scale-95",
                                                isActive
                                                    ? "bg-white/[0.08] text-white border-white/[0.02]"
                                                    : "bg-white/[0.02] border-white/[0.02] text-white/60 hover:bg-white/[0.04] hover:text-white"
                                            )}
                                        >
                                            <item.icon className="w-6 h-6 mb-2" strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="text-[13px] font-bold tracking-wide">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Apple-style Hugging Dock */}
            <div
                className="fixed left-0 right-0 z-50 flex justify-center w-full px-4 md:hidden pointer-events-none pb-[calc(env(safe-area-inset-bottom)_+_24px)] bottom-0"
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
                    className="pointer-events-auto relative inline-flex items-center gap-1.5 bg-white/[0.02] backdrop-blur-[48px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[32px] px-4 py-3 md:px-5 md:py-3.5"
                >
                    {/* Left Items */}
                    <div className="flex items-center gap-1">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => playClick()}
                                    aria-label={item.label}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300",
                                        isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                    )}
                                >
                                    <item.icon className={cn("transition-transform duration-300 relative z-10", isActive ? "h-[22px] w-[22px]" : "h-5 w-5")} strokeWidth={isActive ? 2 : 1.5} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabNav"
                                            className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Center Action Button (New Transaction) */}
                    <Link
                        href="/dashboard/add"
                        onClick={() => playClick()}
                        className="relative flex items-center justify-center w-[48px] h-[48px] rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 shadow-sm"
                    >
                        <Plus className="w-5 h-5 text-white" strokeWidth={2} />
                    </Link>

                    {/* Right Items */}
                    <div className="flex items-center gap-1">
                        {rightNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => playClick()}
                                    aria-label={item.label}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300",
                                        isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                    )}
                                >
                                    <item.icon className={cn("transition-transform duration-300 relative z-10", isActive ? "h-[22px] w-[22px]" : "h-5 w-5")} strokeWidth={isActive ? 2 : 1.5} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabNav"
                                            className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Menu Toggle */}
                        <button
                            aria-label="Más herramientas"
                            onClick={() => { playClick(); setIsMenuOpen(!isMenuOpen); }}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300",
                                isMenuOpen ? "text-white" : "text-white/50 hover:text-white/80"
                            )}
                        >
                            <Menu className={cn("transition-transform duration-300 relative z-10", isMenuOpen ? "h-[22px] w-[22px]" : "h-5 w-5")} strokeWidth={isMenuOpen ? 2 : 1.5} />
                            {isMenuOpen && (
                                <motion.div
                                    layoutId="activeTabNav"
                                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
