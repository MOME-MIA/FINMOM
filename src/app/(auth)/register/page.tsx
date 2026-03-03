"use client";

import { FinmomAccessCard } from "@/components/login/FinmomAccessCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Sparkles, Shield, Brain, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="relative w-full min-h-screen overflow-hidden bg-[#000000] text-white font-sans selection:bg-[#30D158]/30">
            {/* ─── Ambient Background ─── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-[#30D158]/[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[550px] h-[550px] bg-[#0A84FF]/[0.02] rounded-full blur-[120px]" />
            </div>

            {/* Grain Overlay */}
            <div className="fixed inset-0 bg-noise opacity-[0.015] pointer-events-none z-10 mix-blend-overlay" />

            {/* ─── Top Navbar ─── */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
            >
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 flex items-center justify-center">
                        <img src="/logo.png" alt="Finmom Logo" className="w-full h-full object-contain filter invert opacity-80 pointer-events-none select-none" />
                    </div>
                    <span className="font-bold text-[15px] text-white/60">Finmom</span>
                </Link>
                <Link href="/login" className="text-[12px] text-white/50 hover:text-white/60 transition-colors font-medium tracking-wide">
                    Ya tengo cuenta →
                </Link>
            </motion.header>

            {/* ─── Split Layout ─── */}
            <div className="relative z-20 w-full min-h-screen flex flex-col lg:flex-row">

                {/* Left Panel — Value Props (hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex flex-col justify-center px-16 xl:px-24 w-1/2 max-w-[640px]"
                >
                    <span className="text-[11px] font-bold text-[#BF5AF2]/60 uppercase tracking-[0.25em] mb-4">Closed Beta Access</span>
                    <h1 className="text-4xl xl:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Solicitá tu lugar.
                    </h1>
                    <p className="text-[15px] text-white/35 leading-relaxed font-medium mb-10 max-w-md">
                        Finmom actualmente opera bajo estricta invitación. Ingresá tu email para unirte a la lista de espera fundacional y desbloquear a M.I.A.
                    </p>

                    {/* Steps */}
                    <div className="space-y-5">
                        {[
                            { step: "01", icon: <Sparkles className="w-4 h-4 text-[#BF5AF2]" />, title: "Reserva tu Identidad", desc: "Completá con tu email. Ingresás al pool de 'Pending evaluation'." },
                            { step: "02", icon: <Brain className="w-4 h-4 text-[#0A84FF]" />, title: "Supervisión M.I.A.", desc: "Tu solicitud será revisada manualmente por nuestro equipo fundador." },
                            { step: "03", icon: <Shield className="w-4 h-4 text-[#FF9F0A]" />, title: "Pase de Acceso", desc: "Recibirás la confirmación privada con tu token de habilitación." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold text-white/60 mb-0.5">{item.title}</h3>
                                    <p className="text-[13px] text-white/50 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="mt-10 flex items-center gap-2 text-[11px] text-white/50 font-medium tracking-wide"
                    >
                        <div className="w-1 h-1 rounded-full bg-[#BF5AF2]" />
                        Cupos Limitados • Audición Continua • Cifrado Absoluto
                    </motion.div>
                </motion.div>

                {/* Right Panel — Card */}
                <div className="flex-1 flex items-center justify-center px-4 py-20 lg:py-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-[440px]"
                        >
                            <FinmomAccessCard mode="register" />
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
                    Finmom Platform • 2026
                </p>
            </motion.div>
        </main>
    );
}
