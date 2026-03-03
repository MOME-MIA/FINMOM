"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
    ArrowRight,
    Wallet,
    Activity,
    Target,
    Shield,
    Zap,
    Brain,
    TrendingUp,
    Lock,
    Check,
    Sparkles,
    MessageCircle,
    Eye,
    BarChart3,
    Globe,
    Fingerprint,
    ShieldCheck,
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
            if (v > 0.15 && v < 0.25) {
                setBubble("Mis algoritmos procesan datos bancarios al instante.");
                setActive(true);
            } else if (v > 0.40 && v < 0.50) {
                setBubble("Seguridad de grado financiero. Tus bóvedas están encriptadas.");
                setActive(true);
            } else if (v > 0.65 && v < 0.75) {
                setBubble("No soy un chatbot. Soy tu consciencia financiera.");
                setActive(true);
            } else if (v > 0.88) {
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

// ─── How it Works Step ───────────────────────────────
function StepCard({ number, title, desc, icon, accentColor }: {
    number: string; title: string; desc: string; icon: React.ReactNode; accentColor: string;
}) {
    return (
        <FadeInSection delay={Number(number) * 0.15}>
            <div className="flex gap-6 items-start group">
                <div className="flex flex-col items-center shrink-0">
                    <div
                        className="w-12 h-12 rounded-2xl border border-white/[0.08] flex items-center justify-center mb-2 transition-colors group-hover:border-white/[0.15]"
                        style={{ backgroundColor: `${accentColor}10` }}
                    >
                        {icon}
                    </div>
                    <div className="w-px h-16 bg-gradient-to-b from-white/[0.08] to-transparent hidden md:block" />
                </div>
                <div className="flex-1 pb-8">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: accentColor }}>
                        Paso {number}
                    </span>
                    <h3 className="text-xl font-bold mb-2 text-white/90">{title}</h3>
                    <p className="text-[15px] text-white/50 leading-relaxed font-medium">{desc}</p>
                </div>
            </div>
        </FadeInSection>
    );
}


// ═══════════════════════════════════════════════════════
// ═══ MAIN LANDING PAGE ════════════════════════════════
// ═══════════════════════════════════════════════════════
export default function EpicLandingPage() {
    const { scrollY } = useScroll();

    // Parallax Transforms for Hero
    const orbY = useTransform(scrollY, [0, 600], [0, 150]);
    const orbScale = useTransform(scrollY, [0, 600], [1, 0.85]);
    const orbOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const bgY = useTransform(scrollY, [0, 1000], [0, 300]);

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <InteractiveBackground />

            <StickyLandingMia />

            {/* ─── Navbar ─────────────────────────────── */}
            <Navbar />

            {/* ═══ HERO: M.I.A. SECTION ═══════════════ */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
                <motion.div
                    style={{ y: bgY }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-900/10 rounded-full blur-[150px] pointer-events-none"
                />

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
                            <Brain className="w-3.5 h-3.5 text-[#0A84FF]" />
                            <span className="text-[12px] font-bold text-white/60 tracking-wider uppercase">
                                Consciencia Financiera Inmersiva
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.1] sm:leading-[1.05]">
                            Conoce a M.I.A.
                            <br />
                            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/90 font-extrabold tracking-tight">El ADN de tu patrimonio, evolucionado.</span>
                        </h1>

                        <p className="text-[16px] md:text-[19px] text-white/50 max-w-xl mb-10 font-medium leading-relaxed">
                            Más que un algoritmo. M.I.A. procesa tu historial, predice fluctuaciones con precisión algorítmica y asegura tu patrimonio con niveles de criptografía bancaria AES-256. No es un chatbot — es tu mente maestra financiera.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                            <Link href="/register">
                                <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2">
                                    Desbloquear el Futuro <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="h-14 px-8 bg-black text-white border border-white/10 hover:bg-white/[0.04] rounded-full text-[16px] font-semibold transition-all backdrop-blur-md">
                                    Login (Miembros)
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* M.I.A. Orb Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ y: orbY, scale: orbScale, opacity: orbOpacity }}
                        className="flex-1 flex flex-col items-center gap-8 w-full max-w-md"
                    >
                        <div className="relative">
                            {/* Ambient glow behind orb */}
                            <div className="absolute inset-0 scale-150 bg-[#0A84FF]/[0.04] rounded-full blur-[80px] pointer-events-none" />
                            <div className="hidden md:flex relative z-10">
                                <MiaOrb size={220} />
                            </div>
                            <div className="flex md:hidden relative z-10">
                                <MiaOrb size={160} />
                            </div>
                        </div>

                        {/* Floating Chat Previews */}
                        <div className="flex flex-col gap-3 w-full px-2">
                            {[
                                { text: "Tu gasto en delivery subió 23%. ¿Configuro un límite?", side: "left" as const, delay: 0 },
                                { text: "Detecté un cobro duplicado de $42.50 en tu Visa.", side: "right" as const, delay: 0.4 },
                                { text: "Ahorraste $1,240 más que el mes pasado. ¡Vas bien!", side: "left" as const, delay: 0.8 },
                            ].map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: msg.delay + 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className={cn(
                                        "flex items-start gap-3 max-w-[320px]",
                                        msg.side === "left" ? "self-start" : "self-end flex-row-reverse"
                                    )}
                                >
                                    {msg.side === "left" && (
                                        <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#0A84FF]/20 to-transparent border border-white/[0.08] flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-[#0A84FF]" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed font-medium",
                                        msg.side === "left"
                                            ? "bg-white/[0.04] border border-white/[0.06] text-white/70 rounded-tl-sm"
                                            : "bg-[#0A84FF]/10 border border-[#0A84FF]/15 text-[#4DA6FF] rounded-tr-sm"
                                    )}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ SOCIAL PROOF / TRUST ═══════════════ */}
            <section className="py-16 px-6 border-y border-white/[0.04]">
                <FadeInSection className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        {[
                            { icon: <ShieldCheck className="w-5 h-5" />, label: "Encriptación AES-256" },
                            { icon: <Lock className="w-5 h-5" />, label: "Auth Biométrica" },
                            { icon: <Eye className="w-5 h-5" />, label: "Zero-Knowledge Privacy" },
                            { icon: <Fingerprint className="w-5 h-5" />, label: "Verificación Continua" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/50 group">
                                <div className="text-white/50 group-hover:text-[#30D158] transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-[13px] font-semibold tracking-wide uppercase group-hover:text-white/50 transition-colors">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </FadeInSection>
            </section>

            {/* ═══ HOW IT WORKS ═══════════════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-4xl mx-auto">
                <FadeInSection>
                    <SectionLabel text="Cómo funciona" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            De la incertidumbre al <span className="bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] bg-clip-text text-transparent">dominio patrimonial</span>
                        </h2>
                        <p className="text-white/50 text-[16px] max-w-2xl mx-auto">
                            Tres pasos separan tu situación actual de un control financiero absoluto.
                        </p>
                    </div>
                </FadeInSection>

                <div className="flex flex-col gap-2">
                    <StepCard
                        number="1"
                        title="Unifica tus finanzas"
                        desc="Todas tus cuentas, monedas y patrimonio en un solo panel. ARS, USD, EUR — todo convertido y sincronizado automáticamente."
                        icon={<Globe className="w-5 h-5 text-[#0A84FF]" />}
                        accentColor="#0A84FF"
                    />
                    <StepCard
                        number="2"
                        title="M.I.A. procesa tu ADN"
                        desc="La inteligencia autónoma categoriza transacciones, alerta sobre patrones de fuga de capital y te permite anticipar escenarios con máxima previsibilidad."
                        icon={<Brain className="w-5 h-5 text-[#BF5AF2]" />}
                        accentColor="#BF5AF2"
                    />
                    <StepCard
                        number="3"
                        title="Actúa con decisiones informadas"
                        desc="Presupuestos inteligentes, alertas proactivas y proyecciones reales. M.I.A. no solo observa — te protege y optimiza."
                        icon={<Zap className="w-5 h-5 text-[#30D158]" />}
                        accentColor="#30D158"
                    />
                </div>
            </section>

            {/* ═══ FEATURES BENTO GRID ═══════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-7xl mx-auto">
                <FadeInSection>
                    <SectionLabel text="Capacidades" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Ingeniería Financiera Pura</h2>
                        <p className="text-white/50 text-[16px] max-w-2xl mx-auto">
                            Arquitectura diseñada para velocidad, exactitud y privacidad absoluta.
                        </p>
                    </div>
                </FadeInSection>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Large Card - ADN Financiero */}
                    <FadeInSection className="md:col-span-4">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 md:p-10 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group relative overflow-hidden"
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

                    {/* Small Card - Multi-Moneda */}
                    <FadeInSection className="md:col-span-2" delay={0.1}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#FF9F0A]/10 border border-[#FF9F0A]/15 flex items-center justify-center mb-6 group-hover:border-[#FF9F0A]/30 transition-colors">
                                <Globe className="w-6 h-6 text-[#FF9F0A]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white/90">Multi-Moneda</h3>
                            <p className="text-[14px] text-white/50 leading-relaxed font-medium">
                                ARS, USD, EUR y más. Conversión en tiempo real. Bóvedas separadas por divisa.
                            </p>
                        </motion.div>
                    </FadeInSection>

                    {/* Small Card - Presupuestos */}
                    <FadeInSection className="md:col-span-2" delay={0.15}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/15 flex items-center justify-center mb-6 group-hover:border-[#30D158]/30 transition-colors">
                                <Target className="w-6 h-6 text-[#30D158]" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white/90">Precisión Absoluta</h3>
                            <p className="text-[14px] text-white/50 leading-relaxed font-medium">
                                Presupuestos estrictos con alertas en tiempo real y fricción intencional contra gastos impulsivos.
                            </p>
                        </motion.div>
                    </FadeInSection>

                    {/* Large Card - Proyecciones */}
                    <FadeInSection className="md:col-span-4" delay={0.2}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 md:p-10 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#BF5AF2]/[0.03] rounded-full blur-[80px] pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-[#BF5AF2]/10 border border-[#BF5AF2]/15 flex items-center justify-center mb-6 group-hover:border-[#BF5AF2]/30 transition-colors">
                                    <TrendingUp className="w-6 h-6 text-[#BF5AF2]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white/90">Proyecciones M.I.A.</h3>
                                <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-md">
                                    Algoritmos de machine learning que predicen tu comportamiento financiero y proponen optimizaciones antes de que las necesites.
                                </p>
                            </div>
                        </motion.div>
                    </FadeInSection>
                </div>
            </section>

            {/* ═══ M.I.A. DIFFERENTIATOR ═══════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-5xl mx-auto">
                <FadeInSection>
                    <SectionLabel text="Una IA que realmente entiende" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            No es un chatbot.{" "}
                            <span className="bg-gradient-to-r from-[#0A84FF] to-[#64D2FF] bg-clip-text text-transparent">
                                Es una mente autónoma.
                            </span>
                        </h2>
                        <p className="text-white/50 text-[16px] max-w-xl mx-auto">
                            M.I.A. no espera a que preguntes. Anticipa, analiza y actúa por vos.
                        </p>
                    </div>
                </FadeInSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FadeInSection>
                        <div className="p-8 rounded-[28px] bg-white/[0.015] border border-white/[0.04] relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Tradicional</span>
                            </div>
                            <MessageCircle className="w-8 h-8 text-white/50 mb-5" />
                            <h3 className="text-xl font-bold mb-3 text-white/50">Banca Reactiva</h3>
                            <ul className="space-y-3">
                                {[
                                    "Revisa tu balance manualmente",
                                    "Categoriza gastos uno por uno",
                                    "Descubre cobros duplicados... tarde",
                                    "Presupuestos estáticos sin inteligencia",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-[14px] text-white/50 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInSection>

                    <FadeInSection delay={0.15}>
                        <div className="p-8 rounded-[28px] bg-gradient-to-br from-[#0A84FF]/[0.04] to-transparent border border-[#0A84FF]/10 relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/20">
                                <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest">Momentum</span>
                            </div>
                            <Brain className="w-8 h-8 text-[#0A84FF] mb-5" />
                            <h3 className="text-xl font-bold mb-3 text-white/90">M.I.A. Proactiva</h3>
                            <ul className="space-y-3">
                                {[
                                    "Monitoreo autónomo 24/7 de todos tus flujos",
                                    "Categorización automática con IA",
                                    "Detecta anomalías y te alerta al instante",
                                    "Presupuestos adaptativos que evolucionan contigo",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-[14px] text-white/60 font-medium">
                                        <Check className="w-4 h-4 text-[#30D158] shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ═══ SECURITY ═══════════════════════════ */}
            <section className="py-16 md:py-28 px-6 max-w-5xl mx-auto">
                <FadeInSection>
                    <SectionLabel text="Seguridad" />
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Radicalmente seguro.
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
            </section>

            {/* ═══ FINAL CTA ═════════════════════════ */}
            <section className="py-20 md:py-32 px-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A84FF]/[0.02] to-transparent pointer-events-none" />
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
                            <span className="relative z-10 flex items-center gap-3">Solicitar Acceso (Closed Beta) <ArrowRight className="w-5 h-5" /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    </Link>
                </FadeInSection>
            </section>

            {/* ═══ FOOTER ════════════════════════════ */}
            <Footer />
        </div>
    );
}
