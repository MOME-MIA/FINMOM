"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, ArrowLeft } from "lucide-react";
import { Footer } from "./Footer";

interface SubPageLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: string;
}

export default function SubPageLayout({ children, title, subtitle, badge }: SubPageLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            {/* ─── Navbar ──────────── */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-2xl border-b border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <img src="/logo.svg" alt="Finmom Logo" className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                        </div>
                        <span className="font-bold text-[18px] tracking-tight">Finmom</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-[14px] font-medium text-white/50 hover:text-white transition-colors">
                        Iniciar Sesión
                    </Link>
                    <Link href="/register">
                        <button className="bg-white text-black hover:bg-white/90 font-semibold px-5 h-9 rounded-full text-[13px] transition-all active:scale-95">
                            Comenzar gratis
                        </button>
                    </Link>
                </div>
            </header>

            {/* ─── Page Header ──────── */}
            <section className="relative pt-32 pb-16 px-6 max-w-5xl mx-auto text-center">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0A84FF]/[0.02] rounded-full blur-[120px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white/60 transition-colors mb-8 font-medium"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
                    </Link>
                    {badge && (
                        <div className="flex justify-center mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                {badge}
                            </span>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.1]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </section>

            {/* ─── Content ─────────── */}
            <main className="px-6 pb-28 max-w-5xl mx-auto">
                {children}
            </main>

            {/* ─── Footer ─────────── */}
            <Footer />
        </div>
    );
}
