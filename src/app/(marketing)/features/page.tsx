"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Activity, Target, Globe, TrendingUp, Lock,
    Brain, BarChart3, CreditCard, Layers, Zap,
    PieChart, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const CAPABILITIES = [
    {
        icon: <Activity className="w-6 h-6 text-[#0A84FF]" />,
        title: "ADN Financiero",
        desc: "Estrategias hiper-personalizadas basadas en tu comportamiento financiero único. Cada transacción alimenta un perfil que se vuelve más preciso con el tiempo.",
        color: "#0A84FF",
        size: "large",
    },
    {
        icon: <Globe className="w-6 h-6 text-[#FF9F0A]" />,
        title: "Multi-Moneda Nativo",
        desc: "ARS, USD, EUR y más. Conversión en tiempo real, bóvedas separadas por divisa y consolidación patrimonial instantánea.",
        color: "#FF9F0A",
        size: "small",
    },
    {
        icon: <Target className="w-6 h-6 text-[#30D158]" />,
        title: "Presupuestos Inteligentes",
        desc: "Límites adaptativos que evolucionan contigo. Alertas proactivas y fricción intencional contra gastos impulsivos.",
        color: "#30D158",
        size: "small",
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-[#BF5AF2]" />,
        title: "Proyecciones M.I.A.",
        desc: "Algoritmos predictivos que modelan tu futuro financiero. Escenarios de ahorro, inversión y gasto optimizados automáticamente.",
        color: "#BF5AF2",
        size: "large",
    },
    {
        icon: <BarChart3 className="w-6 h-6 text-[#64D2FF]" />,
        title: "Analítica Profunda",
        desc: "Dashboards de precisión quirúrgica. Gráficos temporales, distribuciones por categoría y tendencias mensuales a un vistazo.",
        color: "#64D2FF",
        size: "small",
    },
    {
        icon: <Layers className="w-6 h-6 text-[#FF453A]" />,
        title: "Bóvedas Consolidadas",
        desc: "Múltiples cuentas bancarias, efectivo y activos digitales unificados en un solo patrimonio neto con sincronización instantánea.",
        color: "#FF453A",
        size: "small",
    },
    {
        icon: <CreditCard className="w-6 h-6 text-[#30D158]" />,
        title: "Gestión de Transacciones",
        desc: "Registro manual o automático. Categorización inteligente, notas, etiquetas y búsqueda semántica para encontrar cualquier movimiento.",
        color: "#30D158",
        size: "small",
    },
    {
        icon: <PieChart className="w-6 h-6 text-[#0A84FF]" />,
        title: "Reportes Financieros",
        desc: "Informes mensuales y trimestrales generados por M.I.A. con insights accionables y recomendaciones personalizadas.",
        color: "#0A84FF",
        size: "small",
    },
];

export default function FeaturesPage() {
    return (
        <SubPageLayout
            title="Ingeniería Financiera Pura"
            subtitle="Cada función fue diseñada con obsesión. Sin atajos, sin compromisos. Construido para quienes toman sus finanzas en serio."
            badge="Funcionalidades"
        >
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-28">
                {CAPABILITIES.map((cap, i) => (
                    <FadeIn
                        key={i}
                        className={cap.size === "large" ? "md:col-span-4" : "md:col-span-3"}
                        delay={i * 0.06}
                    >
                        <motion.div
                            whileHover={{ y: -4 }}
                            className={cn(
                                "p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full group relative overflow-hidden",
                                cap.size === "large" && "md:p-10"
                            )}
                        >
                            {cap.size === "large" && (
                                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
                                    style={{ backgroundColor: `${cap.color}08` }} />
                            )}
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-colors"
                                    style={{ backgroundColor: `${cap.color}10`, borderColor: `${cap.color}20` }}>
                                    {cap.icon}
                                </div>
                                <h3 className={cn("font-bold mb-3 text-white/90", cap.size === "large" ? "text-2xl" : "text-xl")}>{cap.title}</h3>
                                <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-md">{cap.desc}</p>
                            </div>
                        </motion.div>
                    </FadeIn>
                ))}
            </div>

            {/* CTA */}
            <FadeIn className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    ¿Listo para tomar el control?
                </h2>
                <p className="text-white/50 text-[16px] mb-8 max-w-lg mx-auto">
                    Cada función fue construida para darte una ventaja financiera real. Activa M.I.A. y experimenta la diferencia.
                </p>
                <Link href="/register">
                    <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                        Comenzar gratis <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
            </FadeIn>
        </SubPageLayout>
    );
}
