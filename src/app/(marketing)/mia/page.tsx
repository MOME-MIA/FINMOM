"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Sparkles, MessageCircle, TrendingUp, ShieldCheck, Eye, Zap, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const MiaOrb = dynamic(
    () => import("@/components/login/MiaOrb").then((m) => ({ default: m.MiaOrb })),
    { ssr: false, loading: () => <div className="w-full h-full rounded-full bg-white/5 animate-pulse" /> }
);

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
            {children}
        </motion.div>
    );
}

const MIA_CAPABILITIES = [
    { icon: <Brain className="w-5 h-5" />, title: "Analiza", desc: "Procesa cada transacción, identifica patrones y construye tu perfil financiero único." },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Predice", desc: "Modela escenarios futuros basados en tu comportamiento real — no en promedios genéricos." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Protege", desc: "Detecta cobros duplicados, anomalías y riesgos antes de que impacten tu patrimonio." },
    { icon: <Zap className="w-5 h-5" />, title: "Optimiza", desc: "Propone movimientos inteligentes: transferencias, ahorros y redistribuciones automáticas." },
    { icon: <MessageCircle className="w-5 h-5" />, title: "Comunica", desc: "Habla tu idioma. Te explica cada insight en lenguaje claro y directo." },
    { icon: <Eye className="w-5 h-5" />, title: "Vigila", desc: "Monitoreo 24/7 de tus flujos con alertas proactivas en el momento exacto." },
];

const CHAT_EXAMPLES = [
    { text: "Tu gasto en delivery subió 23% este mes. ¿Quieres que configure un límite automático?", from: "mia" },
    { text: "¿Cuánto gasté en café este mes?", from: "user" },
    { text: "$847 en 12 transacciones. Un 15% más que el mes pasado. ¿Te ayudo a optimizarlo?", from: "mia" },
    { text: "Detecté una suscripción de $19.99/mes que no usás hace 47 días. ¿La cancelo?", from: "mia" },
];

export default function MiaPage() {
    return (
        <SubPageLayout
            title="Conoce a M.I.A."
            subtitle="Finmom Intelligence Agent — tu consciencia financiera autónoma. No es un chatbot. Es una mente que aprende de vos."
            badge="M.I.A."
        >
            {/* Hero Orb */}
            <FadeIn className="flex justify-center mb-20">
                <div className="relative">
                    <div className="absolute inset-0 scale-[2] bg-[#0A84FF]/[0.04] rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10">
                        <MiaOrb size={180} state="thinking" />
                    </div>
                </div>
            </FadeIn>

            {/* What M.I.A. Does */}
            <FadeIn className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">¿Qué hace M.I.A.?</h2>
                    <p className="text-white/50 text-[15px]">Seis capacidades fundamentales que la hacen única.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {MIA_CAPABILITIES.map((cap, i) => (
                        <FadeIn key={i} delay={i * 0.06}>
                            <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.04] group hover:border-white/[0.08] transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/10 border border-[#0A84FF]/15 flex items-center justify-center mb-4 text-[#0A84FF]">
                                    {cap.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white/90">{cap.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{cap.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </FadeIn>

            {/* Chat Preview */}
            <FadeIn className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">M.I.A. en acción</h2>
                    <p className="text-white/50 text-[15px]">Conversaciones reales. Inteligencia real.</p>
                </div>
                <div className="max-w-lg mx-auto p-6 rounded-[28px] bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
                        <div className="w-6 h-6"><MiaOrb size={24} state="idle" /></div>
                        <span className="text-[13px] font-bold text-white/60 tracking-wide">M.I.A. Chat</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {CHAT_EXAMPLES.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className={cn(
                                    "flex max-w-[85%]",
                                    msg.from === "user" ? "self-end" : "self-start"
                                )}
                            >
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium",
                                    msg.from === "mia"
                                        ? "bg-white/[0.04] border border-white/[0.06] text-white/70 rounded-tl-sm"
                                        : "bg-[#0A84FF]/10 border border-[#0A84FF]/15 text-[#4DA6FF] rounded-tr-sm"
                                )}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* XAI Section */}
            <FadeIn className="mb-20">
                <div className="p-10 rounded-[32px] bg-gradient-to-br from-[#BF5AF2]/[0.04] to-transparent border border-[#BF5AF2]/10 text-center">
                    <Eye className="w-10 h-10 text-[#BF5AF2] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3 text-white/90">IA Explicable (XAI)</h3>
                    <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-2xl mx-auto mb-6">
                        M.I.A. no es una caja negra. Cada recomendación viene con su razonamiento explícito. El AI Audit Trail registra cada decisión, cada dato procesado y cada insight generado — para que siempre sepas por qué.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {["Transparencia total", "Trail de auditoría", "Sin sesgos ocultos", "Control del usuario"].map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-full bg-[#BF5AF2]/10 border border-[#BF5AF2]/15 text-[11px] font-bold text-[#BF5AF2] uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Activa tu consciencia financiera
                </h2>
                <p className="text-white/50 text-[16px] mb-8 max-w-lg mx-auto">
                    M.I.A. está lista para aprender de vos. Cuanto antes empieces, más inteligente se vuelve.
                </p>
                <Link href="/register">
                    <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                        Activar M.I.A. <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
            </FadeIn>
        </SubPageLayout>
    );
}
