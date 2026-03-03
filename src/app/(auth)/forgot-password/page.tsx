"use client";

import { FinmomAccessCard } from "@/components/login/FinmomAccessCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Mail, Clock, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="relative w-full min-h-screen overflow-hidden bg-[#000000] text-white font-sans selection:bg-[#FF9F0A]/30">
            {/* ─── Ambient Background ─── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
                <div className="absolute top-[-10%] left-[30%] w-[450px] h-[450px] bg-[#FF9F0A]/[0.02] rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-[#FF453A]/[0.02] rounded-full blur-[120px]" />
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
                    ← Volver al login
                </Link>
            </motion.header>

            {/* ─── Split Layout ─── */}
            <div className="relative z-20 w-full min-h-screen flex flex-col lg:flex-row">

                {/* Left Panel — Reassurance (hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:flex flex-col justify-center px-16 xl:px-24 w-1/2 max-w-[640px]"
                >
                    <span className="text-[11px] font-bold text-[#FF9F0A]/60 uppercase tracking-[0.25em] mb-4">Recuperación de acceso</span>
                    <h1 className="text-4xl xl:text-5xl font-bold tracking-tighter leading-[1.1] mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        No te preocupes. M.I.A. cuida tu bóveda.
                    </h1>
                    <p className="text-[15px] text-white/35 leading-relaxed font-medium mb-10 max-w-md">
                        Ingresá tu email y te enviaremos un enlace seguro para restablecer tu contraseña. Tu información financiera está protegida en todo momento.
                    </p>

                    {/* Process */}
                    <div className="space-y-5">
                        {[
                            { icon: <Mail className="w-4 h-4 text-[#FF9F0A]" />, title: "Ingresá tu email", desc: "El mismo que usaste al registrarte en Finmom." },
                            { icon: <Clock className="w-4 h-4 text-[#64D2FF]" />, title: "Revisá tu correo", desc: "El enlace de recuperación llega en segundos. Revisá spam si no lo ves." },
                            { icon: <ShieldCheck className="w-4 h-4 text-[#30D158]" />, title: "Acceso restaurado", desc: "Creá una nueva contraseña y volvé a tu bóveda con total seguridad." },
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

                    {/* Security Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                        <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                            🔒 <strong className="text-white/50">Nota de seguridad:</strong> Finmom nunca te pedirá tu contraseña por email. Si recibís un correo sospechoso, contactá a <span className="text-[#FF9F0A]/60">support@momentum.finance</span>.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Right Panel — Card */}
                <div className="flex-1 flex items-center justify-center px-4 py-20 lg:py-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="forgot-password"
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-[440px]"
                        >
                            <FinmomAccessCard mode="forgot-password" />
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
