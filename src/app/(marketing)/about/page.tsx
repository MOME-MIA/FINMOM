"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
    ArrowRight,
    Shield,
    Eye,
    Code2,
    Lightbulb,
    User,
    Target,
    Rocket,
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

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A84FF]/[0.03] rounded-full blur-[120px] pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.05]">
                        Construyendo la conciencia
                        <br />financiera del futuro.
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
                        FINMOM no es otra app de finanzas. Es la primera inteligencia financiera autónoma
                        diseñada para operar a nivel institucional, accesible para cualquier persona.
                    </p>
                </motion.div>
            </section>

            {/* Mission */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-[#0A84FF]/[0.04] to-transparent border border-[#0A84FF]/10">
                        <div className="flex items-center gap-2 mb-6">
                            <Target className="w-5 h-5 text-[#0A84FF]" />
                            <span className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-widest">Nuestra Misión</span>
                        </div>
                        <p className="text-[18px] md:text-[22px] text-white/70 leading-relaxed font-medium">
                            Democratizar el acceso a inteligencia financiera de grado institucional.
                            Creemos que cada persona merece la misma precisión, privacidad y poder
                            analítico que hoy solo tienen los fondos de inversión más sofisticados del mundo.
                        </p>
                    </div>
                </FadeIn>
            </section>

            {/* Values */}
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Nuestros principios</h2>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Shield className="w-6 h-6 text-[#30D158]" />, title: "Privacidad Primero", desc: "Zero-Knowledge Architecture. Tus datos financieros son encriptados antes de salir de tu dispositivo. Ni siquiera nosotros podemos verlos.", color: "#30D158" },
                        { icon: <Eye className="w-6 h-6 text-[#0A84FF]" />, title: "Disciplina en Diseño", desc: "Cada pixel tiene un propósito. La complejidad financiera se resuelve con claridad visual, no con más botones.", color: "#0A84FF" },
                        { icon: <Code2 className="w-6 h-6 text-[#FF9F0A]" />, title: "Ingeniería Sin Atajos", desc: "Código limpio, tests rigurosos, arquitectura que escala. No hay backdoors, no hay deuda técnica aceptable.", color: "#FF9F0A" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div whileHover={{ y: -4 }} className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full transition-all hover:bg-white/[0.04]">
                                <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white/90">{item.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Founder */}
            <section className="py-16 md:py-24 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="p-8 md:p-12 rounded-[32px] bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="w-5 h-5 text-white/40" />
                            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">El Fundador</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0A84FF]/20 to-[#30D158]/20 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="text-2xl font-bold text-white/80">NS</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1 text-white/90">Nahuel Silva</h3>
                                <p className="text-[13px] text-[#0A84FF] font-bold mb-4">CEO & Fundador — MOMENTUM</p>
                                <p className="text-[15px] text-white/50 leading-relaxed font-medium mb-4">
                                    &quot;Construí FINMOM porque estaba cansado de que mis finanzas vivieran en 10 apps distintas
                                    sin que ninguna me diera una visión real de mi patrimonio. M.I.A. nació de esa frustración: la necesidad
                                    de una inteligencia que trabaje por vos las 24 horas, sin comprometer tu privacidad.&quot;
                                </p>
                                <p className="text-[14px] text-white/40 font-medium">
                                    Ingeniero de software. Nómada digital. Obsesionado con la intersección entre inteligencia artificial y finanzas personales.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Timeline */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Nuestra trayectoria</h2>
                    </div>
                </FadeIn>

                <div className="space-y-6">
                    {[
                        { year: "2024", title: "La idea", desc: "Nahuel comienza a prototipar la primera versión de FINMOM desde su laptop, viajando por Latinoamérica.", icon: <Lightbulb className="w-4 h-4" /> },
                        { year: "2025", title: "M.I.A. cobra vida", desc: "Se implementa el motor de inteligencia artificial. M.I.A. pasa de ser un chatbot a una conciencia financiera autónoma.", icon: <Rocket className="w-4 h-4" /> },
                        { year: "2026", title: "Beta Cerrada", desc: "Lanzamiento de la beta cerrada. Primeros 100 usuarios con acceso. Sistema de seguridad AES-256 y Zero-Knowledge operativo.", icon: <Shield className="w-4 h-4" /> },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="flex items-start gap-6 p-6 rounded-[20px] bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                                <div className="w-14 h-14 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center shrink-0">
                                    <div className="text-[#0A84FF]">{item.icon}</div>
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-widest">{item.year}</span>
                                    <h3 className="text-lg font-bold text-white/90 mt-1">{item.title}</h3>
                                    <p className="text-[14px] text-white/50 font-medium mt-1 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Sé parte de la historia.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold flex items-center gap-2">
                                Unirme a la Waitlist <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/careers">
                            <button className="h-14 px-8 border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.04] transition-all rounded-full text-[16px] font-medium flex items-center gap-2">
                                Trabajá con nosotros
                            </button>
                        </Link>
                    </div>
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
