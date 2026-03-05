"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Sparkles, Shield, Zap, Bug, Paintbrush } from "lucide-react";

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

const CHANGELOG = [
    {
        version: "v2.4.0",
        date: "Febrero 2026",
        tag: "Última versión",
        tagColor: "#30D158",
        items: [
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "M.I.A. Visual Overhaul — nuevo sistema de partículas iridiscentes y ojos proporcionales" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Comentario inteligente por rutas — M.I.A. reacciona al contexto de navegación" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Landing page completamente rediseñada con Bento Grid y narrativa secuencial" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Top bar hero element — M.I.A. protagonista en la interfaz móvil" },
            { icon: <Bug className="w-4 h-4" />, type: "fix", text: "Corregido double-toggle bug en MiaMicroWidget" },
            { icon: <Shield className="w-4 h-4" />, type: "security", text: "Uniformidad visual de MiaOrb con prop orbSize explícito" },
        ],
    },
    {
        version: "v2.3.0",
        date: "Febrero 2026",
        items: [
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Generative UI — M.I.A. renderiza gráficos, tablas y summaries en chat" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Spatial Awareness — M.I.A. contextual según la ruta del usuario" },
            { icon: <Zap className="w-4 h-4" />, type: "perf", text: "Persistencia de chat entre sesiones con almacenamiento local" },
            { icon: <Shield className="w-4 h-4" />, type: "security", text: "AI Audit Trail — transparencia total de decisiones de M.I.A." },
        ],
    },
    {
        version: "v2.2.0",
        date: "Enero 2026",
        items: [
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Dashboard rediseñado con Deep Analytics y visualizaciones premium" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Multi-moneda nativo con bóvedas por divisa" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Sistema de autenticación con MiaOrb integrado" },
            { icon: <Rocket className="w-4 h-4" />, type: "launch", text: "Deployment en Vercel con optimización de Core Web Vitals" },
        ],
    },
    {
        version: "v2.1.0",
        date: "Enero 2026",
        items: [
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "M.I.A. chat assistant con Gemini 1.5 Flash" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Presupuestos inteligentes con alertas proactivas" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Glassmorphic design system completo" },
        ],
    },
];

const TYPE_COLORS: Record<string, string> = {
    feature: "#0A84FF",
    design: "#BF5AF2",
    fix: "#FF9F0A",
    security: "#30D158",
    perf: "#64D2FF",
    launch: "#FF453A",
};

export default function ChangelogPage() {
    return (
        <SubPageLayout
            title="Changelog"
            subtitle="Cada línea de código tiene un propósito. Seguí la evolución de FINMOM en tiempo real."
            badge="Producto"
        >
            <div className="max-w-3xl mx-auto space-y-8">
                {CHANGELOG.map((release, i) => (
                    <FadeIn key={i} delay={i * 0.08}>
                        <div className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04]">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-lg font-bold text-white/90">{release.version}</span>
                                <span className="text-[12px] text-white/50 font-medium">{release.date}</span>
                                {release.tag && (
                                    <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                        style={{ backgroundColor: `${release.tagColor}15`, color: release.tagColor, border: `1px solid ${release.tagColor}25` }}>
                                        {release.tag}
                                    </span>
                                )}
                            </div>
                            <ul className="space-y-3">
                                {release.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <div className="mt-0.5 shrink-0" style={{ color: TYPE_COLORS[item.type] || "#fff" }}>
                                            {item.icon}
                                        </div>
                                        <span className="text-[14px] text-white/50 font-medium leading-relaxed">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </SubPageLayout>
    );
}
