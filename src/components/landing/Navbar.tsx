"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

const NAV_LINKS = [
    { label: "Producto", href: "/features" },
    { label: "M.I.A.", href: "/mia" },
    { label: "Seguridad", href: "/security" },
    { label: "Precios", href: "/pricing" },
    { label: "Compañía", href: "/about" },
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
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <img src="/logos/logo-blanco.svg" alt="FINMOM Logo" className="w-full h-full object-contain pointer-events-none select-none" />
                    </div>
                    <span className="font-bold text-[16px] sm:text-[18px] tracking-tight">FINMOM</span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-1">
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
                        Login
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden"
                    >
                        <motion.nav
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-1 pt-24 px-6"
                        >
                            {NAV_LINKS.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 + 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between py-4 px-4 text-[18px] font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                                    >
                                        {link.label}
                                        <ChevronRight className="w-5 h-5 text-white/30" />
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="mt-8 pt-8 border-t border-white/[0.06] space-y-3">
                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                    <button className="w-full h-12 border border-white/10 text-white/70 rounded-xl text-[15px] font-semibold hover:bg-white/[0.04] transition-colors">
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)}>
                                    <button className="w-full h-12 bg-white text-black rounded-xl text-[15px] font-bold hover:bg-white/90 transition-colors active:scale-[0.98]">
                                        Unirse a la Waitlist
                                    </button>
                                </Link>
                            </div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
