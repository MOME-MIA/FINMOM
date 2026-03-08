"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface SubPageLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: string;
    heroGlow?: string;
}

export default function SubPageLayout({ children, title, subtitle, badge, heroGlow = "#0A84FF" }: SubPageLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            {/* ─── Navbar ──────────── */}
            <Navbar />

            {/* ─── Page Header ──────── */}
            <section className="relative pt-32 pb-16 px-6 max-w-5xl mx-auto text-center">
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
                    style={{ backgroundColor: `${heroGlow}05` }}
                />
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
