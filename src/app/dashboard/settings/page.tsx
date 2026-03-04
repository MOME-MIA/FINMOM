"use client";

import { User, Bell, Shield, ChevronRight, LogOut, PieChart, Loader2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { StackHeader } from "@/components/layout/StackHeader";
import { toast } from "sonner";
import { logoutAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { fetchProfile, performLogout, type ProfileData } from "@/lib/insforgeProfile";

// ─── Animation Variants ─────────────────────────────────
const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.04 },
    },
};

const itemVars: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 420, damping: 28 },
    },
};

// ─── Gradient Icon ──────────────────────────────────────
function GradientIcon({ icon: Icon, color }: { icon: React.ElementType; color: string }) {
    const gradients: Record<string, string> = {
        blue: "bg-gradient-to-br from-[#0A84FF] to-[#005bb5]",
        red: "bg-gradient-to-br from-[#FF453A] to-[#b3261c]",
        green: "bg-gradient-to-br from-[#32D74B] to-[#1e8c2f]",
        purple: "bg-gradient-to-br from-[#BF5AF2] to-[#802aab]",
        orange: "bg-gradient-to-br from-[#FF9F0A] to-[#b87002]",
        gray: "bg-gradient-to-br from-[#8E8E93] to-[#5c5c60]",
    };
    return (
        <div className={cn("flex items-center justify-center shrink-0 h-[30px] w-[30px] rounded-[9px] text-white shadow-sm", gradients[color] || "bg-[#1c1c1e]")}>
            <Icon className="h-[14px] w-[14px]" strokeWidth={2.2} />
        </div>
    );
}

// ─── Menu Button ────────────────────────────────────────
function MenuButton({ icon, label, color, onClick }: { icon: React.ElementType; label: string; color: string; onClick?: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between transition-colors p-4 group hover:bg-white/[0.03] active:bg-white/[0.05]"
        >
            <div className="flex items-center gap-3.5">
                <GradientIcon icon={icon} color={color} />
                <span className="text-white/85 font-medium text-[15px] leading-none">{label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-white/12 group-hover:text-white/50 transition-colors" />
        </motion.button>
    );
}

// ─── Settings Page ──────────────────────────────────────
export default function SettingsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        fetchProfile().then(setProfile);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await performLogout();
        } catch (error) {
            console.error("Error al cerrar sesión (Supabase):", error);
            // Ignoramos el error para forzar la limpieza de cookies local de todos modos
        }
        // logoutAction arroja un NEXT_REDIRECT internally, por lo que DEBE ir fuera de nuestro try-catch
        await logoutAction();
    };

    return (
        <div className="flex flex-col min-h-full pb-24 max-w-2xl mx-auto w-full">
            <StackHeader title="Ajustes" backPath="/dashboard" />

            {/* ─── User Identity Card ─── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex flex-col items-center mb-8 mt-2"
            >
                {/* Avatar with glow */}
                <div className="relative mb-5">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.04] to-transparent blur-3xl scale-[1.7] opacity-40 pointer-events-none" />
                    <button
                        onClick={() => router.push("/dashboard/settings/profile")}
                        className={cn(
                            "relative h-[96px] w-[96px] rounded-full overflow-hidden",
                            "ring-[1.5px] ring-white/[0.08] ring-offset-[3px] ring-offset-black",
                            "shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
                            "transition-all duration-300",
                            "hover:ring-white/[0.15] hover:scale-[1.04] active:scale-95"
                        )}
                    >
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                                <User className="h-10 w-10 text-white/50" strokeWidth={1.5} />
                            </div>
                        )}
                    </button>
                </div>

                <h2 className="text-[22px] font-semibold text-white tracking-[-0.02em] text-center leading-tight">
                    {profile?.display_name || "..."}
                </h2>
                <p className="text-[13px] text-white/50 font-normal mt-1.5 tracking-wide">
                    {profile?.email || "..."}
                </p>

                <button
                    onClick={() => router.push("/dashboard/settings/profile")}
                    className={cn(
                        "mt-5 px-6 py-2 rounded-full",
                        "bg-white/[0.04] border border-white/[0.06]",
                        "text-[13px] font-medium text-white/60",
                        "hover:bg-white/[0.08] hover:text-white hover:border-white/[0.1]",
                        "transition-all duration-300 ease-out",
                        "active:scale-[0.96]"
                    )}
                >
                    Editar Perfil
                </button>
            </motion.div>

            {/* ─── Menu Groups ─── */}
            <motion.div
                className="space-y-3 w-full"
                variants={containerVars}
                initial="hidden"
                animate="show"
            >
                {/* Financial DNA */}
                <motion.div variants={itemVars} className="bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04]">
                    <MenuButton
                        icon={PieChart}
                        label="Financial DNA"
                        color="purple"
                        onClick={() => router.push("/dashboard/settings/dna")}
                    />
                </motion.div>

                {/* Notifications & Security */}
                <motion.div variants={itemVars} className="bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04]">
                    <MenuButton
                        icon={Bell}
                        label="Notificaciones"
                        color="red"
                        onClick={() => router.push("/dashboard/settings/notifications")}
                    />
                    <div className="h-px w-full bg-white/[0.03] ml-[52px]" />
                    <MenuButton
                        icon={Shield}
                        label="Seguridad y Acceso"
                        color="blue"
                        onClick={() => router.push("/dashboard/settings/security")}
                    />
                </motion.div>

                {/* Admin Panel — visible for admin emails */}
                {profile?.email && profile.email.toLowerCase().includes("agenciamom.contacto") && (
                    <div className="bg-white/[0.02] rounded-2xl overflow-hidden border border-[#BF5AF2]/20 shadow-[0_0_15px_rgba(191,90,242,0.1)] mt-3 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
                        <MenuButton
                            icon={Shield}
                            label="Terminal M.O.M. (Admin)"
                            color="purple"
                            onClick={() => router.push("/admin")}
                        />
                    </div>
                )}

                {/* Logout */}
                <motion.div variants={itemVars} className="bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04] mt-6">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="w-full py-4 text-red-400/80 text-[15px] font-medium transition-colors flex items-center justify-center gap-2 hover:bg-red-500/[0.04] active:bg-red-500/[0.08]"
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </button>
                </motion.div>
            </motion.div>

            {/* ─── Logout Confirmation Modal ─── */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl"
                            onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.92, y: 16, filter: "blur(6px)" }}
                                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                                className="relative w-full max-w-sm bg-[#0a0a0a]/90 backdrop-blur-[60px] border border-white/[0.06] rounded-[28px] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.8)] pointer-events-auto"
                            >
                                <h3 className="text-[20px] font-semibold text-white tracking-[-0.02em] mb-2">
                                    ¿Cerrar Sesión?
                                </h3>
                                <p className="text-[14px] text-white/50 mb-6 leading-relaxed">
                                    Tendrás que volver a autenticarte con tu código de acceso para reingresar.
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsLogoutModalOpen(false)}
                                        disabled={isLoggingOut}
                                        className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-white/80 font-medium text-[14px] hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="flex-1 py-3 px-4 rounded-2xl bg-red-500/15 border border-red-500/25 text-red-400 font-medium text-[14px] hover:bg-red-500/25 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                        {isLoggingOut ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <LogOut className="h-4 w-4" />
                                        )}
                                        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
