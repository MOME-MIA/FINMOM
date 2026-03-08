"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Activity, WalletCards, Target,
    History, PlusCircle, LogOut, Wallet, User,
    ChevronsLeft, ChevronsRight, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSoundFx } from "@/hooks/useSoundFx";
import { CurrencySelector } from "@/components/layout/CurrencySelector";
import { DateSelector } from "@/components/layout/DateSelector";
import { useMia } from "@/components/chat/MiaContext";
import { MiaMicroWidget } from "@/components/chat/MiaMicroWidget";
import { useUser } from "@insforge/nextjs";
import { useSidebar } from "@/context/SidebarContext";
import { FinmomLogo } from "@/components/ui/FinmomLogo";
import { fetchProfile, type ProfileData } from "@/lib/insforgeProfile";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/accounts", label: "Cuentas", icon: Wallet },
    { href: "/dashboard/analytics", label: "Analítica", icon: Activity },
    { href: "/dashboard/expenses", label: "Gastos", icon: WalletCards },
    { href: "/dashboard/budgets", label: "Presupuestos", icon: Target },
    { href: "/dashboard/history", label: "Historial", icon: History },
];

export function Sidebar() {
    const pathname = usePathname();
    const { playHover, playClick } = useSoundFx();
    const { toggleMia, isOpen: isMiaOpen } = useMia();
    const { user } = useUser();
    const { collapsed, toggle } = useSidebar();
    const [profile, setProfile] = useState<ProfileData | null>(null);

    useEffect(() => {
        fetchProfile().then((data) => {
            if (data) setProfile(data);
        });
    }, []);

    const userEmail = user?.email || "";
    const userName = user?.profile?.name || userEmail.split("@")[0] || "User";
    const userInitials = userName.slice(0, 2).toUpperCase();

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col bg-[#050505]/80 backdrop-blur-3xl fixed left-0 top-0 bottom-0 z-40 border-r border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[40px]",
                collapsed ? "w-[72px]" : "w-[240px]"
            )}
        >
            {/* Header with Selectors & Logo */}
            <div className={cn(
                "pt-4 pb-5 flex flex-col gap-5 border-b border-white/[0.04] transition-all duration-300 items-center",
                collapsed ? "px-3" : "px-5"
            )}>
                <div className="flex flex-row items-center justify-center gap-3 w-full">
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                        <FinmomLogo className="w-full h-full" animate={false} showText={false} />
                    </div>
                    {!collapsed && (
                        <span className="text-[16px] font-sans font-medium tracking-[0.2em] uppercase text-white">
                            FINMOM
                        </span>
                    )}
                </div>

                {!collapsed && (
                    <div className="flex flex-row items-center gap-2 w-full">
                        <CurrencySelector />
                        <div className="flex-1 w-full relative">
                            <DateSelector className="w-full justify-between !py-0.5 !px-1 h-[36px]" />
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-[36px] h-[36px] rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                        <span className="text-[11px] font-bold text-white/60">$</span>
                    </div>
                )}
            </div>

            <nav className={cn("flex-1 space-y-0.5 overflow-hidden", collapsed ? "px-2" : "px-3")}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block"
                            onClick={() => playClick()}
                            onMouseEnter={() => playHover()}
                            title={collapsed ? item.label : undefined}
                        >
                            <motion.div
                                whileTap={{ scale: 0.97 }}
                                className={cn(
                                    "flex items-center rounded-xl transition-all duration-300 relative overflow-hidden",
                                    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                                    isActive
                                        ? "bg-gradient-to-r from-white/[0.12] to-white/[0.06] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-white/[0.08]"
                                        : "text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent"
                                )}
                            >
                                {/* Active State Inner Glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
                                )}
                                <item.icon
                                    className={cn(
                                        isActive ? "text-white" : "text-white/50",
                                        collapsed ? "w-[18px] h-[18px]" : "w-[16px] h-[16px]"
                                    )}
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                                {!collapsed && (
                                    <span className={cn("text-[13px] whitespace-nowrap", isActive ? "font-medium" : "font-normal")}>
                                        {item.label}
                                    </span>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}

            </nav>

            <div className={cn("mt-auto flex flex-col gap-3 transition-all duration-300", collapsed ? "p-2" : "px-4 pb-4 pt-2")}>
                {/* ACCIÓN PRINCIPAL (Desktop) */}
                <div className="w-full">
                    <Link
                        href="/dashboard/add"
                        className="flex flex-row items-center justify-center gap-2 py-2.5 px-3 w-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] text-white/80 hover:text-white rounded-[16px] transition-all text-[12px] font-medium tracking-wide active:scale-95"
                    >
                        <Plus className="w-4 h-4 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.2)] bg-neutral-800 rounded-full p-0.5" />
                        {!collapsed && <span>Nueva Transacción</span>}
                    </Link>
                </div>

                {/* User Profile & M.I.A Matching Mobile Layout */}
                <div className={cn(
                    "flex mt-1 mb-1 items-center",
                    collapsed ? "flex-col justify-center gap-4" : "flex-row justify-center gap-6 px-2"
                )}>
                    {/* Settings / Profile link */}
                    <Link
                        href="/dashboard/settings"
                        title="Ajustes de Perfil"
                        onClick={() => playClick()}
                        className="w-[38px] h-[38px] flex flex-col items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors active:scale-95 shrink-0 overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5"
                    >
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Perfil" className="w-[38px] h-[38px] rounded-full object-cover" />
                        ) : (
                            <span className="text-[10px] font-medium text-white/70 uppercase">
                                {userInitials}
                            </span>
                        )}
                    </Link>

                    {/* M.I.A Orb replacing Logout */}
                    <button
                        onClick={() => { playClick(); toggleMia(); }}
                        title="M.I.A."
                        className="w-[38px] h-[38px] flex items-center justify-center rounded-full transition-colors active:scale-95 shrink-0"
                    >
                        <MiaMicroWidget showOrb={true} orbSize={38} className="w-[38px] h-[38px] flex items-center justify-center pointer-events-none" />
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => { playClick(); toggle(); }}
                    aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                    className="flex items-center justify-center w-full py-1.5 text-white/50 hover:text-white/50 transition-colors rounded-lg hover:bg-white/[0.02]"
                >
                    {collapsed
                        ? <ChevronsRight className="w-4 h-4" strokeWidth={1.5} />
                        : <ChevronsLeft className="w-4 h-4" strokeWidth={1.5} />
                    }
                </button>
            </div>
        </aside>
    );
}
