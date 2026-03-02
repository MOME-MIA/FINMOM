"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, ArrowLeft } from "lucide-react";

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
                        <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-xl flex items-center justify-center border border-white/10">
                            <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-[18px] tracking-tight">Momentum</span>
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
            <footer className="border-t border-white/[0.04] py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Wallet className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="font-bold text-[15px]">Momentum</span>
                            </div>
                            <p className="text-[13px] text-white/50 leading-relaxed font-medium">
                                Sistema operativo financiero con inteligencia artificial autónoma.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-4">Producto</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { label: "Funcionalidades", href: "/features" },
                                    { label: "Seguridad", href: "/security" },
                                    { label: "M.I.A.", href: "/mia" },
                                    { label: "Changelog", href: "/changelog" },
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link href={item.href} className="text-[13px] text-white/50 hover:text-white/50 transition-colors font-medium">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-4">Compañía</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { label: "Sobre Nosotros", href: "/about" },
                                    { label: "Contacto", href: "/contact" },
                                    { label: "Carreras", href: "/careers" },
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link href={item.href} className="text-[13px] text-white/50 hover:text-white/50 transition-colors font-medium">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-4">Legal</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { label: "Privacidad", href: "/privacy" },
                                    { label: "Términos", href: "/terms" },
                                    { label: "Licencias", href: "/licenses" },
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link href={item.href} className="text-[13px] text-white/50 hover:text-white/50 transition-colors font-medium">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[12px] text-white/15 font-medium">© 2026 Momentum Finance. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-[12px] text-white/50 hover:text-white/50 transition-colors font-medium">Iniciar Sesión</Link>
                            <Link href="/register" className="text-[12px] text-white/50 hover:text-white/50 transition-colors font-medium">Crear Cuenta</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
