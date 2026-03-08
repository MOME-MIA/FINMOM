"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
    BarChart3,
    ArrowRight,
    Calculator,
    TrendingUp,
    FileText,
    Shield,
    Zap,
    DollarSign,
    Check,
    Brain,
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

export default function FreelancersPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#30D158]/[0.04] rounded-full blur-[120px] pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#30D158]/10 border border-[#30D158]/20 mb-8">
                        <BarChart3 className="w-4 h-4 text-[#30D158]" />
                        <span className="text-[12px] font-bold text-[#30D158] uppercase tracking-wider">Para Freelancers & Agencias</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.05]">
                        Tu CFO autónomo.
                        <br />
                        <span className="text-3xl sm:text-4xl md:text-5xl">Sin el costo.</span>
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        Separación automática de finanzas personales vs. corporativas.
                        Runway projection, previsión de impuestos y control de flujo de caja — todo con M.I.A.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2">
                                Empezá a automatizar <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Pain Points */}
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">La realidad del independiente</h2>
                        <p className="text-white/50 text-[16px] max-w-xl mx-auto">
                            Sos tu propio CEO, CFO y contable. Pero nadie te dio las herramientas correctas.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <DollarSign className="w-6 h-6 text-[#FF9F0A]" />, title: "Mezcla personal + laboral", desc: "¿Cuánto es ganancia y cuánto es gasto personal? Sin separación clara, nunca sabés tu margen real.", color: "#FF9F0A" },
                        { icon: <Calculator className="w-6 h-6 text-[#FF453A]" />, title: "Impuestos sorpresa", desc: "Llegás a fin de año y los impuestos te golpean sin aviso. Sin previsión, tu flujo de caja colapsa.", color: "#FF453A" },
                        { icon: <TrendingUp className="w-6 h-6 text-[#0A84FF]" />, title: "Runway invisible", desc: "¿Para cuántos meses te alcanza? Sin runway projection, cualquier sequía de clientes es una crisis.", color: "#0A84FF" },
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
                            M.I.A. es tu <span className="bg-gradient-to-r from-[#30D158] to-[#0A84FF] bg-clip-text text-transparent">CFO autónomo</span>
                        </h2>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: <Shield className="w-6 h-6 text-[#30D158]" />, title: "Separación Personal vs. Business", desc: "M.I.A. categoriza automáticamente cada transacción como personal o laboral. Dos vistas, un patrimonio.", color: "#30D158" },
                        { icon: <TrendingUp className="w-6 h-6 text-[#0A84FF]" />, title: "Runway Projection", desc: "Visualizá para cuántos meses te alcanza tu capital actual. Proyecciones dinámicas basadas en tu flujo real.", color: "#0A84FF" },
                        { icon: <FileText className="w-6 h-6 text-[#FF9F0A]" />, title: "Previsión de Impuestos", desc: "M.I.A. calcula tu exposición fiscal en tiempo real. Sin sorpresas al cierre. Provisiones automáticas sugeridas.", color: "#FF9F0A" },
                        { icon: <Brain className="w-6 h-6 text-[#FF453A]" />, title: "Insight Engine", desc: "Reportes mensuales automáticos con métricas clave: margen neto, burn rate, ratio gasto/ingreso. Decisiones con datos.", color: "#FF453A" },
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

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Automatizá tu gestión
                        <br />financiera hoy.
                    </h2>
                    <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10 font-medium">
                        Tu negocio merece la misma precisión financiera que una empresa de Fortune 500.
                    </p>
                    <Link href="/register">
                        <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                            Empezá a automatizar <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
