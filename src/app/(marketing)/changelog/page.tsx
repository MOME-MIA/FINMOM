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
        version: "v0.4.0",
        date: "Marzo 2026",
        tag: "Última versión",
        tagColor: "#30D158",
        items: [
            { icon: <Bug className="w-4 h-4" />, type: "fix", text: "Fix de títulos cortados en todas las subpáginas de marketing" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Navbar centrada con alineación de vanguardia" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Unificación completa de textos a español argentino en toda la aplicación" },
            { icon: <Shield className="w-4 h-4" />, type: "security", text: "Metadatos SEO actualizados en todas las páginas de marketing" },
            { icon: <Bug className="w-4 h-4" />, type: "fix", text: "Corrección de inconsistencias de idioma en páginas de autenticación" },
        ],
    },
    {
        version: "v0.3.0",
        date: "Febrero 2026",
        items: [
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Splash screen cinemático con efecto Liquid Void" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Nuevo branding con logo actualizado y favicon dinámico" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Flujo de registro progresivo de 4 pasos con validación en tiempo real" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Páginas de marketing completas: Features, Security, Pricing, About y más" },
            { icon: <Zap className="w-4 h-4" />, type: "perf", text: "Diseño responsive optimizado para mobile y tablet" },
        ],
    },
    {
        version: "v0.2.0",
        date: "Febrero 2026",
        items: [
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Dashboard principal con KPIs, presupuestos y transacciones" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "M.I.A. Orb — primera visualización del asistente de IA con Three.js" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Landing page épica con hero section y animaciones secuenciales" },
            { icon: <Rocket className="w-4 h-4" />, type: "launch", text: "Primer deployment en Vercel con dominio configurado" },
        ],
    },
    {
        version: "v0.1.0",
        date: "Enero 2026",
        items: [
            { icon: <Rocket className="w-4 h-4" />, type: "launch", text: "Arquitectura base con Next.js 16, React 19 y Tailwind CSS v4" },
            { icon: <Sparkles className="w-4 h-4" />, type: "feature", text: "Sistema de autenticación completo con InsForge SDK" },
            { icon: <Paintbrush className="w-4 h-4" />, type: "design", text: "Design system glassmórfico con tema oscuro premium" },
            { icon: <Shield className="w-4 h-4" />, type: "security", text: "Componentes core: QuantumInput, SingularityButton, InteractiveBackground" },
        ],
    },
];

const TYPE_COLORS: Record<string, string> = {
    feature: "#0A84FF",
    design: "#14b8a6",
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
