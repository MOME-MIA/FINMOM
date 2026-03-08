"use client";

import React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Globe,
    ArrowRight,
    Wallet,
    TrendingUp,
    ShieldCheck,
    Zap,
    MapPin,
    DollarSign,
    BarChart3,
    Check,
} from "lucide-react";
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

export default function NomadsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A84FF]/[0.04] rounded-full blur-[120px] pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/20 mb-8">
                        <Globe className="w-4 h-4 text-[#0A84FF]" />
                        <span className="text-[12px] font-bold text-[#0A84FF] uppercase tracking-wider">Para Nómadas Digitales</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.05]">
                        Tu dinero viaja contigo.
                        <br />
                        <span className="text-3xl sm:text-4xl md:text-5xl">Sin fronteras. Sin fricción.</span>
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        Cobrás en dólares desde Europa, gastás pesos en Buenos Aires y ahorrás en crypto desde Bali.
                        M.I.A. unifica todo en una sola vista patrimonial, optimizando cada conversión automáticamente.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2">
                                Reclama tu acceso prioritario <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Pain Points */}
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">El problema del nómada digital</h2>
                        <p className="text-white/50 text-[16px] max-w-xl mx-auto">
                            Múltiples países, múltiples monedas, cero visibilidad real sobre tu patrimonio.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <MapPin className="w-6 h-6 text-[#FF9F0A]" />, title: "Cuentas dispersas", desc: "Bancos en 3 países, Wise, PayPal, Binance… todo desconectado. ¿Cuánto valés realmente hoy?", color: "#FF9F0A" },
                        { icon: <DollarSign className="w-6 h-6 text-[#FF453A]" />, title: "Costos ocultos de FX", desc: "Cada conversión te cuesta entre 1-5% sin que te des cuenta. Esos spreads invisibles destruyen tu margen.", color: "#FF453A" },
                        { icon: <BarChart3 className="w-6 h-6 text-[#0A84FF]" />, title: "Impuestos multinacionales", desc: "¿Tributás en Argentina o en el país donde estás? M.I.A. te ayuda a visualizar tu exposición fiscal.", color: "#0A84FF" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full">
                                <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white/90">{item.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Solution Features */}
            <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                            Cómo M.I.A. resuelve tu vida <span className="bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] bg-clip-text text-transparent">financiera nómada</span>
                        </h2>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: <Wallet className="w-6 h-6 text-[#0A84FF]" />, title: "Bóvedas por moneda", desc: "ARS, USD, EUR, GBP, BRL, Crypto — cada una en su propia bóveda con balances en tiempo real y conversión FX optimizada.", color: "#0A84FF" },
                        { icon: <TrendingUp className="w-6 h-6 text-[#30D158]" />, title: "Net Worth unificado", desc: "M.I.A. calcula tu patrimonio real combinando todas tus cuentas, exchanges y wallets en una sola cifra actualizada al segundo.", color: "#30D158" },
                        { icon: <Zap className="w-6 h-6 text-[#FF9F0A]" />, title: "FX Intelligence", desc: "Alertas cuando el tipo de cambio es favorable. Optimización automática de conversiones para maximizar cada transferencia.", color: "#FF9F0A" },
                        { icon: <ShieldCheck className="w-6 h-6 text-[#FF453A]" />, title: "Categorización por país", desc: "M.I.A. sabe en qué país gastaste cada peso. Visualizá tus gastos por ubicación y detectá patrones geográficos.", color: "#FF453A" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div whileHover={{ y: -4 }} className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group transition-all hover:bg-white/[0.04]">
                                <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-colors" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white/90">{item.title}</h3>
                                <p className="text-[15px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Testimonial / Use Case */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-[#0A84FF]/[0.05] to-transparent border border-[#0A84FF]/10 text-center">
                        <p className="text-[18px] md:text-[22px] text-white/70 leading-relaxed font-medium italic mb-6">
                            &quot;Cobro en USD desde Upwork, gasto en pesos en Medellín, y ahorro en ETH.
                            Antes de FINMOM, no tenía idea de cuánto valía mi patrimonio real. Ahora lo sé al segundo.&quot;
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-sm font-bold text-[#0A84FF]">
                                NM
                            </div>
                            <div className="text-left">
                                <p className="text-[13px] font-bold text-white/80">Nómada Digital</p>
                                <p className="text-[11px] text-white/40">Early Access Beta Tester</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Tu patrimonio global,
                        <br />unificado y protegido.
                    </h2>
                    <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10 font-medium">
                        Acceso prioritario para nómadas digitales. Plazas limitadas.
                    </p>
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
