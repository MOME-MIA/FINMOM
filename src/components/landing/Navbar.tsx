"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Layers, Brain, ShieldCheck, CreditCard, Building2, ArrowRight, Sparkles } from "lucide-react";

const NAV_LINKS = [
    { label: "Producto", href: "/features", description: "Funcionalidades y capacidades", icon: Layers },
    { label: "M.I.A.", href: "/mia", description: "Tu inteligencia financiera autónoma", icon: Brain },
    { label: "Seguridad", href: "/security", description: "Encriptación de grado militar", icon: ShieldCheck },
    { label: "Precios", href: "/pricing", description: "Planes que se adaptan a vos", icon: CreditCard },
    { label: "Compañía", href: "/about", description: "La visión detrás de FINMOM", icon: Building2 },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3.5 transition-all duration-300 ${scrolled
                    ? "bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "bg-transparent border-b border-transparent"
                    }`}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity z-10">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <img src="/logos/LOGO FINMOM APP.svg" alt="FINMOM Logo" className="w-full h-full object-contain pointer-events-none select-none" />
                    </div>
                    <span className="font-bold text-[16px] sm:text-[18px] tracking-tight">FINMOM</span>
                </Link>

                {/* Desktop Nav Links — Centered */}
                <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3.5 py-2 text-[13px] font-medium text-white/50 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.04]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden sm:block text-[13px] font-medium text-white/50 hover:text-white transition-colors px-3 py-2">
                        Iniciar Sesión
                    </Link>
                    <Link href="/register">
                        <button className="bg-white text-black hover:bg-white/90 font-semibold px-4 sm:px-5 h-8 sm:h-9 rounded-full text-[12px] sm:text-[13px] transition-all active:scale-95 whitespace-nowrap">
                            Unirse a la Waitlist
                        </button>
                    </Link>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5 text-white/80" /> : <Menu className="w-5 h-5 text-white/80" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay — Premium Redesign */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-40 lg:hidden overflow-y-auto"
                    >
                        {/* Background layers */}
                        <div className="absolute inset-0 bg-black/98" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.01]" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

                        <motion.nav
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="relative flex flex-col pt-24 px-5 pb-10 min-h-full"
                        >
                            {/* Decorative gradient line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="h-[1px] mb-6 origin-left"
                                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.06) 80%, transparent)" }}
                            />

                            {/* Navigation Links */}
                            <div className="space-y-2">
                                {NAV_LINKS.map((link, i) => {
                                    const Icon = link.icon;
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 + 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="group flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white/[0.08] group-hover:border-white/[0.1] transition-all duration-200">
                                                    <Icon className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors duration-200" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="block text-[16px] font-semibold text-white/80 group-hover:text-white transition-colors duration-200">
                                                        {link.label}
                                                    </span>
                                                    <span className="block text-[12px] text-white/30 font-medium mt-0.5 group-hover:text-white/40 transition-colors duration-200">
                                                        {link.description}
                                                    </span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* CTA Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-8 pt-6 space-y-3"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                            >
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                                    <button className="w-full h-[52px] border border-white/[0.08] text-white/60 rounded-2xl text-[15px] font-semibold hover:bg-white/[0.04] hover:text-white/80 hover:border-white/[0.12] transition-all duration-200 active:scale-[0.98]">
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)} className="block">
                                    <button className="w-full h-[52px] bg-white text-black rounded-2xl text-[15px] font-bold hover:bg-white/90 transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Unirse a la Waitlist
                                    </button>
                                </Link>
                            </motion.div>

                            {/* Footer info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="mt-auto pt-10 flex items-center justify-between text-[11px] text-white/20 font-medium"
                            >
                                <span>FINMOM v0.4.0</span>
                                <span>© {new Date().getFullYear()} MOMENTUM</span>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
