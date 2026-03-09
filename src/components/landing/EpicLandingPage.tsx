"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
    ArrowRight,
    Activity,
    Shield,
    Zap,
    Brain,
    TrendingUp,
    Lock,
    Check,
    Sparkles,
    Eye,
    BarChart3,
    Globe,
    Fingerprint,
    ShieldCheck,
    Target,
    Users,
    Clock,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { InteractiveBackground } from "./InteractiveBackground";

const MiaOrb = dynamic(
    () => import("@/components/login/MiaOrb").then((m) => ({ default: m.MiaOrb })),
    { ssr: false, loading: () => <div className="w-full h-full rounded-full bg-white/5 animate-pulse" /> }
);

// ─── Animated Section Wrapper ────────────────────────
function FadeInSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Sticky Landing M.I.A. ──────────────────────────
function StickyLandingMia() {
    const { scrollYProgress } = useScroll();
    const [bubble, setBubble] = useState<string | null>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        return scrollYProgress.onChange((v) => {
            if (v > 0.12 && v < 0.22) {
                setBubble("Mis algoritmos procesan datos bancarios al instante.");
                setActive(true);
            } else if (v > 0.35 && v < 0.45) {
                setBubble("Seguridad de grado financiero. Tus bóvedas están encriptadas.");
                setActive(true);
            } else if (v > 0.55 && v < 0.65) {
                setBubble("No soy un chatbot. Soy tu consciencia financiera.");
                setActive(true);
            } else if (v > 0.80 && v < 0.90) {
                setBubble("Cada decisión de M.I.A. es explicable y transparente.");
                setActive(true);
            } else if (v > 0.92) {
                setBubble("Comienza tu viaje. Yo te guiaré desde adentro.");
                setActive(true);
            } else {
                setBubble(null);
                setActive(false);
            }
        });
    }, [scrollYProgress]);

    const isVisible = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    return (
        <motion.div
            style={{ opacity: isVisible, pointerEvents: useTransform(isVisible, v => v > 0.5 ? 'auto' : 'none') as any }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
        >
            <AnimatePresence>
                {bubble && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 10 }}
                        className="absolute right-full mr-5 bottom-3 w-56 p-3.5 rounded-2xl rounded-br-sm bg-[#111111]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                    >
                        <span className="text-[9px] text-white/50 uppercase tracking-widest block mb-1">M.I.A.</span>
                        <p className="text-[12px] text-white/80 font-medium leading-relaxed tracking-wide">{bubble}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="w-[72px] h-[72px] rounded-full bg-black border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <MiaOrb size={64} state={active ? "thinking" : "idle"} />
            </div>
        </motion.div>
    );
}

// ─── Section Divider ─────────────────────────────────
function SectionLabel({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">{text}</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>
    );
}

// ─── Animated Counter ────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, end]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

// ═══════════════════════════════════════════════════════
// ═══ MAIN LANDING PAGE — "THE AUTONOMOUS CONSCIOUSNESS"
// ═══════════════════════════════════════════════════════
export default function EpicLandingPage() {
    const { scrollY } = useScroll();

    const orbY = useTransform(scrollY, [0, 800], [0, 200]);
    const orbScale = useTransform(scrollY, [0, 800], [1, 0.7]);
    const orbOpacity = useTransform(scrollY, [0, 600], [1, 0]);
    const bgY = useTransform(scrollY, [0, 1000], [0, 300]);

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <InteractiveBackground />
            <StickyLandingMia />
            <Navbar />

            {/* ═══ HERO: THE CONSCIOUSNESS ═══════════════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10 pt-20">
                <motion.div
                    style={{ y: bgY }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0A84FF]/[0.03] rounded-full blur-[150px] pointer-events-none"
                />

                {/* M.I.A. Orb — Giant, Centered, Breathing */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ y: orbY, scale: orbScale, opacity: orbOpacity }}
                    className="relative mb-10 md:mb-14"
                >
                    <div className="absolute inset-0 scale-[2] bg-[#0A84FF]/[0.04] rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10 hidden md:flex">
                        <MiaOrb size={280} />
                    </div>
                    <div className="relative z-10 flex md:hidden">
                        <MiaOrb size={180} />
                    </div>
                </motion.div>

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
                        <Brain className="w-3.5 h-3.5 text-[#0A84FF]" />
                        <span className="text-[12px] font-bold text-white/60 tracking-wider uppercase">
                            Sistema Operativo Financiero Autónomo
                        </span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-4xl"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent leading-[1.05]">
                        Tu conciencia
                        <br />
                        financiera autónoma.
                    </h1>
                    <p className="text-[16px] md:text-[19px] text-white/50 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        M.I.A. no es un chatbot. Es una inteligencia que aprende cómo pensás,
                        anticipa tus movimientos y protege tu patrimonio con criptografía de grado militar.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link href="/register">
                        <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_60px_-15px_rgba(255,255,255,0.3)] flex items-center gap-2">
                            Únete al 1% <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <Link href="/sandbox">
                        <button className="h-14 px-8 bg-black text-white border border-white/10 hover:bg-white/[0.04] rounded-full text-[16px] font-semibold transition-all backdrop-blur-md flex items-center gap-2">
                            Ver demo interactiva <ChevronRight className="w-4 h-4 text-white/50" />
                        </button>
                    </Link>
                </motion.div>


            </section>

            {/* ═══ SOCIAL PROOF — METRICS BAR ═══════════ */}
            <section className="py-16 px-6 border-y border-white/[0.04] relative z-10">
                <FadeInSection className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: <AnimatedCounter end={256} />, label: "Encriptación AES-Bit", icon: <Lock className="w-4 h-4" /> },
                            { value: <AnimatedCounter end={99} suffix="%" prefix="" />, label: "Uptime Garantizado", icon: <ShieldCheck className="w-4 h-4" /> },
                            { value: <AnimatedCounter end={24} suffix="/7" />, label: "Monitoreo Autónomo", icon: <Eye className="w-4 h-4" /> },
                            { value: <AnimatedCounter end={0} suffix=" datos vendidos" />, label: "Zero-Knowledge Privacy", icon: <Fingerprint className="w-4 h-4" /> },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 group">
                                <div className="text-white/40 group-hover:text-[#0A84FF] transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
                                    {item.value}
                                </span>
                                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em]">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </FadeInSection>
            </section>

            {/* ═══ NARRATIVE — PAS FRAMEWORK ═══════════ */}
            <section className="py-20 md:py-32 px-6 max-w-5xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="El Problema" />
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
                            Tus finanzas son un <span className="bg-gradient-to-r from-[#FF453A] to-[#FF9F0A] bg-clip-text text-transparent">caos invisible.</span>
                        </h2>
                        <p className="text-white/50 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
                            10 apps bancarias. Planillas manuales. Comisiones ocultas. Presupuestos que fallan.
                            El 82% de las personas no sabe exactamente cuánto vale su patrimonio hoy.
                        </p>
                    </div>
                </FadeInSection>

                {/* Agitation → Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <FadeInSection>
                        <div className="p-8 rounded-[28px] bg-white/[0.015] border border-white/[0.04] relative overflow-hidden h-full">
                            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Sin M.I.A.</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
                                <Clock className="w-5 h-5 text-white/40" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white/40">El método tradicional</h3>
                            <ul className="space-y-3">
                                {[
                                    "Revisás tu balance bancario manualmente cada semana",
                                    "Planillas Excel que te roban horas de tu vida",
                                    "Descubrís cobros duplicados cuando ya es tarde",
                                    "Presupuestos estáticos sin ninguna inteligencia",
                                    "Cero visibilidad sobre tu patrimonio real",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-white/40 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/15 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInSection>

                    <FadeInSection delay={0.15}>
                        <div className="p-8 rounded-[28px] bg-gradient-to-br from-[#0A84FF]/[0.05] to-transparent border border-[#0A84FF]/10 relative overflow-hidden h-full">
                            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/20">
                                <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest">Con M.I.A.</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/15 flex items-center justify-center mb-5">
                                <Brain className="w-5 h-5 text-[#0A84FF]" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white/90">Conciencia autónoma</h3>
                            <ul className="space-y-3">
                                {[
                                    "Monitoreo autónomo 24/7 de todos tus flujos financieros",
                                    "Categorización y predicción con Machine Learning",
                                    "Alertas proactivas antes de que el daño ocurra",
                                    "Presupuestos inquebrantables que evolucionan con vos",
                                    "Net Worth unificado en tiempo real: ARS, USD, Crypto",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-white/60 font-medium">
                                        <Check className="w-4 h-4 text-[#30D158] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ═══ HOW IT WORKS — 3 STEPS ═══════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-4xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="Cómo funciona" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                            De la incertidumbre al{" "}
                            <span className="bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] bg-clip-text text-transparent">
                                dominio patrimonial
                            </span>
                        </h2>
                        <p className="text-white/50 text-[16px] max-w-2xl mx-auto">
                            Tres pasos separan tu situación actual de un control financiero absoluto.
                        </p>
                    </div>
                </FadeInSection>

                <div className="flex flex-col gap-2">
                    {[
                        {
                            number: "1",
                            title: "Conectá tus flujos financieros",
                            desc: "Sincronizá cuentas bancarias, exchanges y billeteras. ARS, USD, Crypto. Todo unificado en una bóveda encriptada con conversión en tiempo real.",
                            icon: <Globe className="w-5 h-5 text-[#0A84FF]" />,
                            color: "#0A84FF",
                        },
                        {
                            number: "2",
                            title: "M.I.A. asimila tu ADN Financiero",
                            desc: "La IA aprende tus patrones de gasto, previene fugas de capital y te alerta sobre riesgos antes de que impacten tu Net Worth.",
                            icon: <Brain className="w-5 h-5 text-[#30D158]" />,
                            color: "#30D158",
                        },
                        {
                            number: "3",
                            title: "Ejecución con precisión autónoma",
                            desc: "Presupuestos inquebrantables, automatización de objetivos y escalamiento patrimonial con cero fricción. M.I.A. opera por vos.",
                            icon: <Zap className="w-5 h-5 text-[#FF9F0A]" />,
                            color: "#FF9F0A",
                        },
                    ].map((step) => (
                        <FadeInSection key={step.number} delay={Number(step.number) * 0.15}>
                            <div className="flex gap-6 items-start group">
                                <div className="flex flex-col items-center shrink-0">
                                    <div
                                        className="w-12 h-12 rounded-2xl border border-white/[0.08] flex items-center justify-center mb-2 transition-colors group-hover:border-white/[0.15]"
                                        style={{ backgroundColor: `${step.color}10` }}
                                    >
                                        {step.icon}
                                    </div>
                                    <div className="w-px h-16 bg-gradient-to-b from-white/[0.08] to-transparent hidden md:block" />
                                </div>
                                <div className="flex-1 pb-8">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: step.color }}>
                                        Paso {step.number}
                                    </span>
                                    <h3 className="text-xl font-bold mb-2 text-white/90">{step.title}</h3>
                                    <p className="text-[15px] text-white/50 leading-relaxed font-medium">{step.desc}</p>
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </section>

            {/* ═══ FEATURES BENTO GRID ═══════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-7xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="Capacidades" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Ingeniería Financiera Pura</h2>
                        <p className="text-white/50 text-[16px] max-w-2xl mx-auto">
                            Arquitectura diseñada para velocidad, exactitud y privacidad absoluta.
                        </p>
                    </div>
                </FadeInSection>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Large — ADN Financiero */}
                    <FadeInSection className="md:col-span-4">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 md:p-10 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group relative overflow-hidden transition-all hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A84FF]/[0.03] rounded-full blur-[80px] pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/15 flex items-center justify-center mb-6 group-hover:border-[#0A84FF]/30 transition-colors">
                                    <Activity className="w-6 h-6 text-[#0A84FF]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white/90">ADN Financiero</h3>
                                <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-md">
                                    Estrategias hiper-personalizadas basadas en tu comportamiento financiero único. Analítica predictiva y categorización automática con precisión quirúrgica.
                                </p>
                            </div>
                        </motion.div>
                    </FadeInSection>

                    {/* Small — Multi-Moneda */}
                    <FadeInSection className="md:col-span-2" delay={0.1}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group transition-all hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(255,159,10,0.05)]"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#FF9F0A]/10 border border-[#FF9F0A]/15 flex items-center justify-center mb-6 group-hover:border-[#FF9F0A]/30 transition-colors">
                                <Globe className="w-6 h-6 text-[#FF9F0A]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white/90">Multi-Moneda Nativo</h3>
                            <p className="text-[14px] text-white/50 leading-relaxed font-medium">
                                ARS, USD, EUR, Crypto. Bóvedas individuales con conversión FX en tiempo real. Tu Net Worth global unificado.
                            </p>
                        </motion.div>
                    </FadeInSection>

                    {/* Small — Presupuestos */}
                    <FadeInSection className="md:col-span-2" delay={0.15}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group transition-all hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(48,209,88,0.05)]"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/15 flex items-center justify-center mb-6 group-hover:border-[#30D158]/30 transition-colors">
                                <Target className="w-6 h-6 text-[#30D158]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white/90">Presupuestos Inquebrantables</h3>
                            <p className="text-[14px] text-white/50 leading-relaxed font-medium">
                                Alertas proactivas. Límites que se adaptan. Tu escudo contra compras impulsivas y fugas de capital.
                            </p>
                        </motion.div>
                    </FadeInSection>

                    {/* Large — Proyecciones */}
                    <FadeInSection className="md:col-span-4" delay={0.2}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 md:p-10 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group relative overflow-hidden transition-all hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(48,209,88,0.03)]"
                        >
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#30D158]/[0.03] rounded-full blur-[80px] pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/15 flex items-center justify-center mb-6 group-hover:border-[#30D158]/30 transition-colors">
                                    <TrendingUp className="w-6 h-6 text-[#30D158]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white/90">Proyecciones Inteligentes</h3>
                                <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-md">
                                    Simulaciones predictivas de tu flujo de caja. Visualizá tu runway, planificá tu futuro y anticipá escenarios con datos reales.
                                </p>
                            </div>
                        </motion.div>
                    </FadeInSection>
                </div>
            </section>

            {/* ═══ M.I.A. EXPLAINABLE AI (AUDIT TRAIL) ═══ */}
            <section className="py-16 md:py-28 px-6 max-w-5xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="IA Explicable" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                            Cada decisión de M.I.A. es{" "}
                            <span className="bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] bg-clip-text text-transparent">
                                transparente.
                            </span>
                        </h2>
                        <p className="text-white/50 text-[16px] max-w-xl mx-auto">
                            No confiás a ciegas. Ves exactamente cómo razona, qué datos usó y por qué tomó cada decisión.
                        </p>
                    </div>
                </FadeInSection>

                {/* Audit Trail Visualization */}
                <FadeInSection delay={0.1}>
                    <div className="p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-white/[0.04] relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#0A84FF]/[0.03] rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            {[
                                {
                                    time: "hace 3 min",
                                    action: "Anomalía detectada",
                                    detail: "Cobro duplicado de $14.500 ARS en MercadoPago. Patrón inusual vs. historial de 90 días.",
                                    reasoning: "Comparé 847 transacciones similares. Probabilidad de error: 94.2%",
                                    status: "alert",
                                    color: "#FF9F0A",
                                },
                                {
                                    time: "hace 12 min",
                                    action: "Presupuesto ajustado",
                                    detail: "Categoría 'Delivery' excedió el 85% del límite mensual. Reasigné $3.200 desde 'Reserva'.",
                                    reasoning: "Tu patrón histórico sugiere un gasto promedio de $18k/mes en esta categoría. Ajuste preventivo aplicado.",
                                    status: "success",
                                    color: "#30D158",
                                },
                                {
                                    time: "hace 1 hora",
                                    action: "FX optimizado",
                                    detail: "Tipo de cambio ARS/USD favorable detectado. Sugerí conversión de USD 200 a mejor tasa.",
                                    reasoning: "Analicé variación de 30 días. Tasa actual 2.3% por debajo del promedio. Window de oportunidad: ~4 horas.",
                                    status: "info",
                                    color: "#0A84FF",
                                },
                            ].map((entry, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 0.6 }}
                                    className="flex gap-4 items-start group"
                                >
                                    <div className="flex flex-col items-center shrink-0">
                                        <div
                                            className="w-3 h-3 rounded-full border-2"
                                            style={{ borderColor: entry.color, backgroundColor: `${entry.color}30` }}
                                        />
                                        {i < 2 && <div className="w-px h-full min-h-[60px] bg-white/[0.06]" />}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-[13px] font-bold text-white/80">{entry.action}</span>
                                            <span className="text-[10px] text-white/30 font-medium">{entry.time}</span>
                                        </div>
                                        <p className="text-[13px] text-white/50 font-medium mb-2">{entry.detail}</p>
                                        <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                            <span className="text-[10px] text-[#0A84FF] font-bold uppercase tracking-widest block mb-1">Razonamiento de M.I.A.</span>
                                            <p className="text-[12px] text-white/40 font-medium italic">&quot;{entry.reasoning}&quot;</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* ═══ SECURITY FORTRESS ═══════════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-5xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="Seguridad" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                            Privacidad Inquebrantable.
                        </h2>
                        <p className="text-white/50 text-[16px] max-w-xl mx-auto">
                            Arquitectura diseñada para la paz mental. Tus datos nunca salen de tu bóveda personal.
                        </p>
                    </div>
                </FadeInSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Lock className="w-6 h-6 text-[#FF453A]" />, title: "End-to-End Encryption", desc: "Encriptación AES-256 en tránsito y en reposo. Imposible de interceptar.", color: "#FF453A" },
                        { icon: <Fingerprint className="w-6 h-6 text-[#30D158]" />, title: "Auth Biométrica", desc: "FaceID, huella dactilar y verificación comportamental continua.", color: "#30D158" },
                        { icon: <Shield className="w-6 h-6 text-[#0A84FF]" />, title: "Zero-Knowledge", desc: "Sin anuncios. Sin venta de datos. Sin compromisos. Tu privacidad es sagrada.", color: "#0A84FF" },
                    ].map((item, i) => (
                        <FadeInSection key={i} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] text-center group"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6 transition-colors"
                                    style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white/90">{item.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        </FadeInSection>
                    ))}
                </div>

                {/* Trust badges below security */}
                <FadeInSection delay={0.3}>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                        {[
                            { icon: <ShieldCheck className="w-4 h-4 text-[#30D158]/70" />, label: "SOC 2 Ready" },
                            { icon: <Lock className="w-4 h-4 text-[#0A84FF]/70" />, label: "GDPR Compliant" },
                            { icon: <Eye className="w-4 h-4 text-[#FF9F0A]/70" />, label: "Ley 25.326 (ARG)" },
                            { icon: <Fingerprint className="w-4 h-4 text-[#FF453A]/70" />, label: "Row-Level Security" },
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                {badge.icon}
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </FadeInSection>
            </section>

            {/* ═══ FOUNDER STORY ═══════════════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-4xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="El Fundador" />
                    <div className="p-8 md:p-12 rounded-[32px] bg-white/[0.02] border border-white/[0.04] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0A84FF]/[0.02] rounded-full blur-[100px] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A84FF]/20 to-[#30D158]/10 border border-white/[0.08] flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white/90">NS</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white/90">Nahuel Silva</h3>
                                    <p className="text-[13px] text-white/50 font-medium">CEO & Founder · MOMENTUM</p>
                                </div>
                            </div>

                            <blockquote className="text-[17px] md:text-[20px] text-white/70 leading-relaxed font-medium mb-8 italic">
                                &quot;Construí FINMOM porque estaba harto de que mis finanzas dependieran de 10 apps que no se hablan entre sí.
                                Quería una inteligencia que piense por mí, que proteja mi patrimonio y que evolucione conmigo.
                                M.I.A. no es un producto. Es la conciencia financiera que todos merecemos.&quot;
                            </blockquote>

                            <div className="flex flex-wrap gap-3">
                                {["Solo Founder", "Full-Stack Engineer", "Buenos Aires, Argentina", "Beta Activa"].map((tag, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* ═══ SOLUTIONS TEASER ═══════════════════ */}
            <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto relative z-10">
                <FadeInSection>
                    <SectionLabel text="Soluciones" />
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                            Diseñado para <span className="bg-gradient-to-r from-[#0A84FF] to-[#30D158] bg-clip-text text-transparent">tu realidad.</span>
                        </h2>
                    </div>
                </FadeInSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FadeInSection>
                        <Link href="/solutions/nomads" className="block">
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group transition-all hover:bg-white/[0.04] hover:border-[#0A84FF]/15 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/15 flex items-center justify-center mb-6">
                                    <Globe className="w-6 h-6 text-[#0A84FF]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white/90">Nómadas Digitales</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium mb-4">
                                    Tu dinero viaja contigo. Multi-divisa, bóvedas por país y tipo de cambio optimizado automáticamente.
                                </p>
                                <span className="text-[13px] font-semibold text-[#0A84FF] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                    Explorar solución <ArrowRight className="w-4 h-4" />
                                </span>
                            </motion.div>
                        </Link>
                    </FadeInSection>

                    <FadeInSection delay={0.1}>
                        <Link href="/solutions/freelancers" className="block">
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group transition-all hover:bg-white/[0.04] hover:border-[#30D158]/15 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/15 flex items-center justify-center mb-6">
                                    <BarChart3 className="w-6 h-6 text-[#30D158]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white/90">Freelancers & Agencias</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium mb-4">
                                    Tu CFO autónomo. Runway, separación de finanzas personales vs. corporativas, y previsión de impuestos.
                                </p>
                                <span className="text-[13px] font-semibold text-[#30D158] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                    Explorar solución <ArrowRight className="w-4 h-4" />
                                </span>
                            </motion.div>
                        </Link>
                    </FadeInSection>
                </div>
            </section>

            {/* ═══ FINAL CTA — WAITLIST ════════════════ */}
            <section className="py-20 md:py-32 px-6 text-center relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A84FF]/[0.03] to-transparent pointer-events-none" />
                <FadeInSection className="relative z-10">
                    <div className="flex justify-center mb-8">
                        <MiaOrb size={80} state="idle" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        El futuro de tus finanzas
                        <br />
                        empieza ahora.
                    </h2>
                    <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10 font-medium">
                        Únete a la nueva generación de gestión patrimonial con M.I.A. como tu copiloto financiero autónomo.
                    </p>
                    <Link href="/register">
                        <button className="h-16 px-10 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[18px] font-bold shadow-[0_0_60px_-15px_rgba(255,255,255,0.3)] flex items-center gap-3 mx-auto relative overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-3">Asegura tu lugar <ArrowRight className="w-5 h-5" /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0A84FF]/0 via-[#0A84FF]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    </Link>
                </FadeInSection>
            </section>

            {/* ═══ FOOTER ════════════════════════════ */}
            <Footer />
        </div>
    );
}
