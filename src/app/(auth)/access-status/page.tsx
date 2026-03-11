"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { checkWaitlistStatusAction, reapplyWaitlistAction } from "@/app/actions";
import { useMiaStore } from "@/store/miaStore";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { QuantumInput } from "@/components/login/QuantumInput";
import { SingularityButton } from "@/components/login/SingularityButton";
import { MiaOrb } from "@/components/login/MiaOrb";
import {
    Clock, CheckCircle2, XCircle, HelpCircle,
    ArrowRight, Shield, Sparkles, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

type WaitlistStatus = 'pending' | 'approved' | 'rejected' | null;

interface StatusResult {
    found: boolean;
    status: WaitlistStatus;
    fullName: string | null;
    createdAt: string | null;
}

const STATUS_CONFIG = {
    pending: {
        icon: Clock,
        color: "#FF9F0A",
        title: "Solicitud en Evaluación",
        subtitle: "Tu identidad está siendo revisada por nuestro equipo fundador.",
        detail: "Recibirás una notificación cuando tu acceso sea habilitado. El proceso puede tomar entre 24 y 72 horas.",
        orbState: "thinking" as const,
        badgeText: "EN COLA",
        badgeColor: "bg-[#FF9F0A]/10 border-[#FF9F0A]/20 text-[#FF9F0A]",
    },
    approved: {
        icon: CheckCircle2,
        color: "#30D158",
        title: "Acceso Concedido",
        subtitle: "¡Tu identidad fue verificada y aprobada!",
        detail: "Ya podés iniciar sesión con tu email y contraseña. Tu pase de acceso está activo.",
        orbState: "success" as const,
        badgeText: "APROBADO",
        badgeColor: "bg-[#30D158]/10 border-[#30D158]/20 text-[#30D158]",
    },
    rejected: {
        icon: XCircle,
        color: "#FF453A",
        title: "Solicitud no Aprobada",
        subtitle: "Tu solicitud fue revisada pero no calificó en esta ronda.",
        detail: "Podés volver a solicitar acceso en cualquier momento. Te recomendamos completar tu perfil con más detalle.",
        orbState: "error" as const,
        badgeText: "NO APROBADO",
        badgeColor: "bg-[#FF453A]/10 border-[#FF453A]/20 text-[#FF453A]",
    },
    not_found: {
        icon: HelpCircle,
        color: "#14b8a6",
        title: "Sin Registros",
        subtitle: "No encontramos una solicitud asociada a este email.",
        detail: "Si aún no solicitaste acceso, podés hacerlo desde la página de registro.",
        orbState: "idle" as const,
        badgeText: "NO ENCONTRADO",
        badgeColor: "bg-[#14b8a6]/10 border-[#14b8a6]/20 text-[#14b8a6]",
    },
};

export default function AccessStatusPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<StatusResult | null>(null);
    const [hasChecked, setHasChecked] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isReapplying, setIsReapplying] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Auto-check if email comes from URL
    useEffect(() => {
        const urlEmail = searchParams.get("email");
        if (urlEmail && !hasChecked && mounted) {
            handleCheck(urlEmail);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    const handleCheck = async (emailToCheck?: string) => {
        const target = emailToCheck || email;
        if (!target || !target.includes("@")) return;

        setIsLoading(true);
        setHasChecked(false);

        try {
            const data = await checkWaitlistStatusAction(target.toLowerCase().trim());
            setResult(data);
        } catch {
            setResult({ found: false, status: null, fullName: null, createdAt: null });
        } finally {
            setIsLoading(false);
            setHasChecked(true);
        }
    };

    const handleReapply = async () => {
        setIsReapplying(true);
        const res = await reapplyWaitlistAction(email);
        setIsReapplying(false);
        if (res.success) {
            useMiaStore.getState().notify({ status: 'success', message: "¡Solicitud enviada nuevamente!" });
            setResult(prev => prev ? { ...prev, status: 'pending' } : null);
        } else {
            useMiaStore.getState().notify({ status: 'error', message: res.error || "Hubo un error" });
        }
    };

    const statusKey = hasChecked
        ? (result?.found ? result.status! : "not_found")
        : null;

    const config = statusKey ? STATUS_CONFIG[statusKey] : null;

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!mounted) return null;

    return (
        <AuthLayout
            theme={{
                primaryGlow: config?.color || "#5E5CE6",
                secondaryGlow: "#30D158",
                accentGlow: "#0A84FF",
                selectionColor: "rgba(94, 92, 230, 0.3)",
            }}
            headerLink={{ href: "/login", label: "Iniciar Sesión" }}
            mobileTitle="FINMOM"
            mobileSubtitle="Estado de Acceso"
            orbState={config?.orbState || "idle"}
            trustBadges={[
                { icon: <Shield className="w-3.5 h-3.5 text-[#30D158]" />, text: "Cifrado E2E" },
                { icon: <Sparkles className="w-3.5 h-3.5 text-[#14b8a6]" />, text: "Beta cerrada" },
            ]}
            leftPanel={
                <div className="space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5E5CE6]/5 border border-[#5E5CE6]/10"
                    >
                        <Shield className="w-3.5 h-3.5 text-[#5E5CE6]" />
                        <span className="text-[11px] font-bold text-[#5E5CE6]/70 uppercase tracking-[0.2em]">
                            Verificación de Estado
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-[42px] xl:text-[50px] font-extrabold tracking-[-0.03em] leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                            Consultá
                            <br />
                            tu acceso.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="text-[15px] text-white/35 leading-[1.7] font-medium max-w-[380px]"
                    >
                        Ingresá el email con el que solicitaste acceso a FINMOM para verificar el estado de tu evaluación en tiempo real.
                    </motion.p>

                    {/* Status legend */}
                    <div className="space-y-2.5 pt-2">
                        {(["pending", "approved", "rejected"] as const).map((key, i) => {
                            const c = STATUS_CONFIG[key];
                            const Icon = c.icon;
                            const isActive = statusKey === key;
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-500",
                                        isActive
                                            ? `bg-[${c.color}]/[0.04] border-[${c.color}]/15`
                                            : "bg-white/[0.02] border-white/[0.04]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all",
                                        isActive ? `border-[${c.color}]/20` : "border-white/[0.05]"
                                    )}>
                                        <Icon className="w-3.5 h-3.5" style={{ color: c.color }} />
                                    </div>
                                    <div>
                                        <span className={cn(
                                            "text-[12px] font-bold uppercase tracking-[0.1em] transition-colors",
                                            isActive ? "text-white/70" : "text-white/40"
                                        )}>{c.badgeText}</span>
                                        <p className="text-[10px] text-white/25 font-medium">{c.subtitle.slice(0, 50)}...</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            }
        >
            {/* Right Panel: The Status Card */}
            <div className="flex items-center justify-center w-full h-full relative z-30">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                        "relative w-full h-auto rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] text-center",
                        "bg-white/[0.025] backdrop-blur-[80px]",
                        "border border-white/[0.06] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)]",
                        "flex flex-col overflow-hidden z-10",
                        "transition-all duration-700 ease-out"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-[inherit]" />

                    <div className="relative z-30 flex flex-col h-full p-6 sm:p-8 md:p-10 lg:p-14 space-y-6 sm:space-y-8 lg:space-y-10">

                        {/* Header Orb — desktop only */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="hidden lg:flex flex-col items-center justify-center space-y-1"
                        >
                            <MiaOrb
                                size={88}
                                state={config?.orbState || (isLoading ? "thinking" : "idle")}
                            />
                            <h1 className="font-sans font-medium text-2xl tracking-[0.05em] text-white/80 leading-none">
                                FINMOM
                            </h1>
                            <span className="text-xs text-white/50 font-medium tracking-[0.1em] mt-2 uppercase">
                                Estado de Acceso
                            </span>
                        </motion.div>

                        {/* Email Input */}
                        <AnimatePresence mode="wait">
                            {!hasChecked ? (
                                <motion.div
                                    key="input-phase"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full flex flex-col items-center gap-3"
                                >
                                    <QuantumInput
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                                        placeholder="Tu email de solicitud"
                                        isError={false}
                                        isCoolingDown={false}
                                        disabled={isLoading}
                                        type="email"
                                        autoFocus
                                        autoComplete="email"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result-phase"
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full flex flex-col items-center gap-5"
                                >
                                    {config && (() => {
                                        const Icon = config.icon;
                                        return (
                                            <>
                                                {/* Status Badge */}
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className={cn(
                                                        "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-[0.2em]",
                                                        config.badgeColor
                                                    )}
                                                >
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {config.badgeText}
                                                </motion.div>

                                                {/* Main Status */}
                                                <div className="space-y-3 text-center">
                                                    <h2 className="text-[20px] sm:text-[24px] font-bold text-white/90 tracking-[-0.02em]">
                                                        {config.title}
                                                    </h2>
                                                    <p className="text-[14px] text-white/50 font-medium leading-[1.6] max-w-[340px] mx-auto">
                                                        {config.subtitle}
                                                    </p>
                                                </div>

                                                {/* Detail Card */}
                                                <div className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-3">
                                                    <p className="text-[13px] text-white/40 leading-[1.7] font-medium">
                                                        {config.detail}
                                                    </p>

                                                    {result?.fullName && (
                                                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                                                            <span className="text-[11px] text-white/25 uppercase tracking-[0.15em] font-bold">Identidad</span>
                                                            <span className="text-[13px] text-white/60 font-medium">{result.fullName}</span>
                                                        </div>
                                                    )}
                                                    {result?.createdAt && (
                                                        <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                                                            <span className="text-[11px] text-white/25 uppercase tracking-[0.15em] font-bold">Fecha</span>
                                                            <span className="text-[12px] text-white/50 font-medium tabular-nums">{formatDate(result.createdAt)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                                                        <span className="text-[11px] text-white/25 uppercase tracking-[0.15em] font-bold">Email</span>
                                                        <span className="text-[12px] text-white/50 font-medium">{email}</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-3 w-full pt-2">
                                                    {statusKey === "approved" && (
                                                        <button
                                                            onClick={() => router.push("/login")}
                                                            className="w-full h-14 rounded-2xl bg-[#30D158] text-black font-bold text-[13px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[#30D158]/90 transition-all active:scale-[0.98]"
                                                        >
                                                            INICIAR SESIÓN
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {statusKey === "rejected" && (
                                                        <button
                                                            onClick={handleReapply}
                                                            disabled={isReapplying}
                                                            className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white/70 font-bold text-[13px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-white/[0.1] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                                                        >
                                                            {isReapplying ? "PROCESANDO..." : "RE-SOLICITAR ACCESO"}
                                                            <RefreshCw className={`w-4 h-4 ${isReapplying ? "animate-spin" : ""}`} />
                                                        </button>
                                                    )}
                                                    {statusKey === "not_found" && (
                                                        <button
                                                            onClick={() => router.push("/register")}
                                                            className="w-full h-14 rounded-2xl bg-[#14b8a6] text-white font-bold text-[13px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[#14b8a6]/90 transition-all active:scale-[0.98]"
                                                        >
                                                            SOLICITAR ACCESO
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setHasChecked(false);
                                                            setResult(null);
                                                        }}
                                                        className="text-[12px] text-white/40 hover:text-white/60 font-medium tracking-wide transition-colors min-h-[44px]"
                                                    >
                                                        Consultar otro email
                                                    </button>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Check Button — only shown before checking */}
                        {!hasChecked && (
                            <div className="w-full pb-2 sm:pb-4 lg:pb-6">
                                <SingularityButton
                                    isUnlocked={false}
                                    isLoading={isLoading}
                                    onAuthenticate={() => handleCheck()}
                                    disabled={!email.includes("@")}
                                    customIdleText="VERIFICAR ESTADO"
                                    customSuccessText="CONSULTANDO..."
                                />
                            </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-col items-center gap-1 pt-1">
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="text-[13px] text-white/50 hover:text-white/70 transition-colors font-medium tracking-wide min-h-[44px] flex items-center justify-center"
                            >
                                Volver a Iniciar Sesión
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AuthLayout>
    );
}
