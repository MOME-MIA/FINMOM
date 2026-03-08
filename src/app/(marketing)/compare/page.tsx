"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, X, Brain, Zap, Shield, Clock } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
            {children}
        </motion.div>
    );
}

const COMPARISON_ROWS = [
    { feature: "Unificación de cuentas", traditional: false, finmom: true },
    { feature: "Multi-moneda nativo (ARS, USD, EUR, Crypto)", traditional: false, finmom: true },
    { feature: "Categorización con IA", traditional: false, finmom: true },
    { feature: "Presupuestos adaptativos", traditional: false, finmom: true },
    { feature: "Alertas proactivas en tiempo real", traditional: false, finmom: true },
    { feature: "Encriptación AES-256 E2E", traditional: false, finmom: true },
    { feature: "Proyección de runway y flujo de caja", traditional: false, finmom: true },
    { feature: "IA Explicable (Audit Trail)", traditional: false, finmom: true },
    { feature: "Zero-Knowledge Privacy", traditional: false, finmom: true },
    { feature: "Separación personal vs. laboral automática", traditional: false, finmom: true },
    { feature: "Interfaz mobile-first premium", traditional: "Parcial", finmom: true },
    { feature: "Soporte humano", traditional: true, finmom: "Soon" },
];

export default function ComparePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-16 px-6 max-w-5xl mx-auto text-center">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A84FF]/[0.03] rounded-full blur-[120px] pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.05]">
                        FINMOM vs. Bancos
                        <br />Tradicionales
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
                        Tu banco te da una cuenta. FINMOM te da un sistema operativo financiero autónomo.
                    </p>
                </motion.div>
            </section>

            {/* Comparison Table */}
            <section className="py-12 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 border-b border-white/[0.06] p-6">
                            <div className="text-[13px] font-bold text-white/50 uppercase tracking-wider">Funcionalidad</div>
                            <div className="text-center">
                                <span className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                    Bancos Tradicionales
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="px-3 py-1.5 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[11px] font-bold text-[#0A84FF] uppercase tracking-widest">
                                    FINMOM + M.I.A.
                                </span>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {COMPARISON_ROWS.map((row, i) => (
                            <div key={i} className={`grid grid-cols-3 items-center p-5 ${i < COMPARISON_ROWS.length - 1 ? "border-b border-white/[0.03]" : ""} hover:bg-white/[0.02] transition-colors`}>
                                <span className="text-[14px] text-white/70 font-medium">{row.feature}</span>
                                <div className="flex justify-center">
                                    {row.traditional === true ? (
                                        <Check className="w-5 h-5 text-white/30" />
                                    ) : row.traditional === false ? (
                                        <X className="w-5 h-5 text-white/15" />
                                    ) : (
                                        <span className="text-[12px] text-white/30 font-medium">{row.traditional}</span>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    {row.finmom === true ? (
                                        <Check className="w-5 h-5 text-[#30D158]" />
                                    ) : (
                                        <span className="text-[12px] text-[#0A84FF] font-bold">{row.finmom}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>

            {/* Key Differentiators */}
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Brain className="w-6 h-6 text-[#0A84FF]" />, title: "IA Autónoma", desc: "M.I.A. trabaja 24/7 sin que le pidas nada. Tu banco solo reacciona.", color: "#0A84FF" },
                        { icon: <Shield className="w-6 h-6 text-[#30D158]" />, title: "Privacidad Real", desc: "Zero-Knowledge Architecture. Tu banco vende tus datos. Nosotros no.", color: "#30D158" },
                        { icon: <Zap className="w-6 h-6 text-[#FF9F0A]" />, title: "Velocidad", desc: "Insights en tiempo real. Tu banco te muestra datos de ayer.", color: "#FF9F0A" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div whileHover={{ y: -4 }} className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] text-center">
                                <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white/90">{item.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Cambiá al futuro.
                    </h2>
                    <Link href="/register">
                        <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                            Unirme a la Waitlist <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
