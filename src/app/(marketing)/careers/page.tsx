"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Sparkles, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

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

const POSITIONS = [
    {
        title: "Senior Frontend Engineer",
        team: "Producto",
        location: "Remoto (LATAM)",
        type: "Full-time",
        desc: "Construí interfaces financieras premium con Next.js 16, Framer Motion y nuestro glassmorphic design system. Se requiere obsesión por el detalle visual.",
        tags: ["React", "Next.js", "TypeScript", "Framer Motion"],
        color: "#0A84FF",
    },
    {
        title: "AI/ML Engineer — M.I.A.",
        team: "Inteligencia Artificial",
        location: "Remoto (Global)",
        type: "Full-time",
        desc: "Evolucioná M.I.A. con modelos de NLP financiero, sistemas de recomendación y analítica predictiva. Trabajo directo con Gemini y modelos propietarios.",
        tags: ["Python", "LLMs", "RAG", "FinTech AI"],
        color: "#BF5AF2",
    },
    {
        title: "Security Engineer",
        team: "Infraestructura",
        location: "Remoto (LATAM)",
        type: "Full-time",
        desc: "Protegé datos financieros con arquitectura zero-trust, RLS, auditorías de seguridad y cumplimiento regulatorio.",
        tags: ["AppSec", "Supabase RLS", "SOC2", "Cryptography"],
        color: "#30D158",
    },
];

export default function CareersPage() {
    return (
        <SubPageLayout
            title="Carreras"
            subtitle="Estamos construyendo el futuro de las finanzas personales. ¿Querés ser parte?"
            badge="Compañía"
        >
            {/* Culture */}
            <FadeIn className="mb-16">
                <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/[0.04] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A84FF]/[0.03] rounded-full blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-2xl font-bold mb-4 text-white/90">Nuestra Cultura</h2>
                        <p className="text-[16px] text-white/50 leading-[1.8] font-medium mb-4">
                            En Finmom no buscamos gente que cumpla tareas — buscamos constructores obsesivos que quieran redefinir cómo funciona el dinero. Trabajamos remoto, en ciclos de impacto, con autonomía total y responsabilidad real.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {["100% Remoto", "Ciclos de 6 semanas", "Sin reuniones innecesarias", "Equity desde día 1"].map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/50 uppercase tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Open Positions */}
            <div className="mb-20">
                <h2 className="text-2xl font-bold mb-8 text-white/90">Posiciones Abiertas</h2>
                <div className="space-y-4">
                    {POSITIONS.map((pos, i) => (
                        <FadeIn key={i} delay={i * 0.08}>
                            <div className="p-8 rounded-[24px] bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors group cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white/90">{pos.title}</h3>
                                        <p className="text-[13px] text-white/50 font-medium">{pos.team} · {pos.location} · {pos.type}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-2.5 transition-all" style={{ color: pos.color }}>
                                        Aplicar <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium mb-4">{pos.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {pos.tags.map((tag, j) => (
                                        <span key={j} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-bold text-white/50 tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <FadeIn className="text-center">
                <p className="text-white/50 text-[15px] mb-6">
                    ¿No ves tu posición ideal? Mandanos un email a <strong className="text-white/60">careers@momentum.finance</strong>
                </p>
                <Link href="/contact">
                    <button className="h-12 px-6 bg-white/[0.04] text-white/70 border border-white/[0.08] hover:bg-white/[0.08] rounded-full text-[14px] font-semibold transition-all mx-auto flex items-center gap-2">
                        Contactanos <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </FadeIn>
        </SubPageLayout>
    );
}
