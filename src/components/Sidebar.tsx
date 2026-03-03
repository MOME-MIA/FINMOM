"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Activity, WalletCards, Target,
    History, PlusCircle, LogOut, Settings, Wallet,
    ChevronsLeft, ChevronsRight, Shield
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

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/accounts", label: "Cuentas", icon: Wallet },
    { href: "/dashboard/analytics", label: "Analítica", icon: Activity },
    { href: "/dashboard/expenses", label: "Gastos", icon: WalletCards },
    { href: "/dashboard/budgets", label: "Presupuestos", icon: Target },
    { href: "/dashboard/history", label: "Historial", icon: History },
    { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { playHover, playClick } = useSoundFx();
    const { toggleMia, isOpen: isMiaOpen } = useMia();
    const { user } = useUser();
    const { collapsed, toggle } = useSidebar();

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
            {/* Header with Selectors */}
            <div className={cn(
                "pt-8 pb-4 flex flex-col gap-4 border-b border-white/[0.04] transition-all duration-300",
                collapsed ? "px-3 items-center" : "px-5"
            )}>
                {!collapsed && <CurrencySelector />}
                {!collapsed && <DateSelector className="w-full justify-between px-3 py-2 bg-white/[0.02]" />}
                {collapsed && (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
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

                {/* Secrect Admin Route */}
                {userEmail === "agenciamom.contacto@gmail.com" && (
                    <Link
                        href="/admin"
                        className="block mt-4"
                        onClick={() => playClick()}
                        onMouseEnter={() => playHover()}
                        title={collapsed ? "Admin Panel" : undefined}
                    >
                        <motion.div
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                                "flex items-center rounded-xl transition-all duration-300 relative overflow-hidden",
                                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                                pathname === "/admin"
                                    ? "bg-gradient-to-r from-[#BF5AF2]/20 to-[#BF5AF2]/5 text-[#BF5AF2] shadow-[0_4px_12px_rgba(191,90,242,0.2)] border border-[#BF5AF2]/20"
                                    : "text-[#BF5AF2]/50 hover:text-[#BF5AF2] hover:bg-[#BF5AF2]/10 border border-transparent"
                            )}
                        >
                            <Shield
                                className={cn(
                                    pathname === "/admin" ? "text-[#BF5AF2]" : "text-[#BF5AF2]/50",
                                    collapsed ? "w-[18px] h-[18px]" : "w-[16px] h-[16px]"
                                )}
                                strokeWidth={pathname === "/admin" ? 2 : 1.5}
                            />
                            {!collapsed && (
                                <span className={cn("text-[13px] whitespace-nowrap", pathname === "/admin" ? "font-medium" : "font-normal")}>
                                    Terminal M.O.M.
                                </span>
                            )}
                        </motion.div>
                    </Link>
                )}
            </nav>

            <div className={cn("mt-auto flex flex-col gap-3 transition-all duration-300", collapsed ? "p-2" : "p-4")}>
                {/* Nueva Transacción */}
                <Link
                    href="/dashboard/add"
                    title={collapsed ? "Nueva Transacción" : undefined}
                    className={cn(
                        "flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.02] py-2.5 rounded-lg text-white transition-colors group",
                        collapsed ? "w-full" : "gap-2 w-full"
                    )}
                >
                    <PlusCircle className="w-4 h-4 text-white/50 group-hover:text-white transition-colors shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span className="text-[12px] font-medium tracking-wide">Nueva Transacción</span>}
                </Link>

                {/* System Intelligence */}
                <button
                    onClick={() => { playClick(); toggleMia(); }}
                    title={collapsed ? "M.I.A." : undefined}
                    className={cn(
                        "flex items-center justify-center border py-2.5 rounded-lg transition-colors group relative overflow-hidden",
                        collapsed ? "w-full" : "gap-3 px-3",
                        isMiaOpen
                            ? "bg-[#0A84FF]/10 border-[#0A84FF]/20 text-[#0A84FF]"
                            : "bg-transparent border-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.04]"
                    )}
                >
                    <div className="pointer-events-none shrink-0">
                        <MiaMicroWidget showOrb={true} orbSize={20} className="w-5 h-5 flex items-center justify-center" />
                    </div>
                    {!collapsed && <span className="text-[13px] font-medium tracking-wide">M.I.A.</span>}
                </button>

                {/* User Profile */}
                <div className={cn(
                    "flex items-center group hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer mt-2",
                    collapsed ? "justify-center p-2" : "gap-3 px-2 py-2"
                )}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-[10px] font-medium text-white/70 uppercase shrink-0">
                        {userInitials}
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-white/90 truncate">{userName}</p>
                                <p className="text-[10px] text-white/50 truncate">{userEmail}</p>
                            </div>
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const { logoutAction } = await import("@/app/actions");
                                    await logoutAction();
                                }}
                                className="w-[36px] h-[36px] flex items-center justify-center text-white/50 hover:text-white/70 transition-colors rounded-md hover:bg-white/[0.06] shrink-0 active:scale-95"
                                title="Cerrar Sesión"
                                aria-label="Cerrar Sesión"
                            >
                                <LogOut className="w-4 h-4 ml-0.5" strokeWidth={1.5} />
                            </button>
                        </>
                    )}
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
