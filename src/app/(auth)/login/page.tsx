"use client";

import { FinmomAccessCard } from "@/components/login/FinmomAccessCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Shield, Lock, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

function WaitlistMessages() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const status = searchParams.get("waitlist");
        if (status === "success") {
            setTimeout(() => {
                toast.success("¡Identidad registrada en la lista de espera!", {
                    description: "Te avisaremos cuando tu acceso cerrado esté habilitado.",
                    duration: 5000,
                });
            }, 300);
            window.history.replaceState(null, "", "/login");
        } else if (status === "pending") {
            setTimeout(() => {
                toast.error("Bóveda Restringida", {
                    description: "Tu identidad aún está bajo revisión en la lista de espera. Te notificaremos cuando se apruebe tu acceso.",
                    duration: 6000,
                });
            }, 300);
            window.history.replaceState(null, "", "/login");
        } else if (status === "system_error") {
            setTimeout(() => {
                toast.error("Error de Sistema", {
                    description: "No se pudo validar tu estado en la lista de espera. Intenta de nuevo más tarde.",
                    duration: 5000,
                });
            }, 300);
            window.history.replaceState(null, "", "/login");
        }
    }, [searchParams]);

    return null;
}

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="relative w-full min-h-screen overflow-hidden bg-[#000000] text-white font-sans selection:bg-[#0A84FF]/30">
            {/* ─── Ambient Background ─── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#0A84FF]/[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#64D2FF]/[0.02] rounded-full blur-[120px]" />
            </div>

            {/* Grain Overlay */}
            <div className="fixed inset-0 bg-noise opacity-[0.015] pointer-events-none z-10 mix-blend-overlay" />

            <Suspense fallback={null}>
                <WaitlistMessages />
            </Suspense>

            {/* ─── Top Navbar ─── */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
            >
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 flex items-center justify-center">
                        <img src="/logos/logo-blanco.svg" alt="FINMOM Logo" className="w-full h-full object-contain pointer-events-none select-none" />
                    </div>
                    <span className="font-bold text-[15px] text-white/60">FINMOM</span>
                </Link>
                <Link href="/register" className="text-[12px] text-white/50 hover:text-white/60 transition-colors font-medium tracking-wide">
                    Crear Cuenta →
                </Link>
            </motion.header>

            {/* ─── Split Layout ─── */}
            <div className="relative z-20 w-full min-h-screen flex flex-col lg:flex-row">

                {/* Left Panel — Copy & Trust (hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex flex-col justify-center px-16 xl:px-24 w-1/2 max-w-[640px]"
                >
                    <span className="text-[11px] font-bold text-[#0A84FF]/60 uppercase tracking-[0.25em] mb-4">Bienvenido de vuelta</span>
                    <h1 className="text-4xl xl:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Tu bóveda financiera te espera.
                    </h1>
                    <p className="text-[15px] text-white/35 leading-relaxed font-medium mb-10 max-w-md">
                        M.I.A. ha estado analizando el mercado mientras no estabas. Ingresá para ver qué descubrió.
                    </p>

                    {/* Trust Signals */}
                    <div className="space-y-4">
                        {[
                            { icon: <Lock className="w-4 h-4 text-[#30D158]" />, text: "Encriptación AES-256 en todos tus datos" },
                            { icon: <Shield className="w-4 h-4 text-[#0A84FF]" />, text: "Autenticación con bloqueo progresivo" },
                            { icon: <Zap className="w-4 h-4 text-[#FF9F0A]" />, text: "M.I.A. activa y analizando 24/7" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-[13px] text-white/50 font-medium">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Panel — Card */}
                <div className="flex-1 flex items-center justify-center px-4 py-20 lg:py-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="access"
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-[440px]"
                        >
                            <FinmomAccessCard mode="login" />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Minimalist Watermark */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 left-0 right-0 text-center z-20 pointer-events-none"
            >
                <p className="text-white/15 text-[10px] uppercase font-sans tracking-[0.4em]">
                    FINMOM Platform • 2026
                </p>
            </motion.div>
        </main>
    );
}
