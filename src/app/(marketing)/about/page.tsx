"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Users, Shield, Sparkles, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MiaOrb } from "@/components/login/MiaOrb";

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

export default function AboutPage() {
    return (
        <SubPageLayout
            title="Sobre Nosotros"
            subtitle="Finmom nació de una frustración: las apps financieras existentes son genéricas, lentas y tratando de venderte algo. Decidimos construir algo mejor."
            badge="Compañía"
        >
            {/* Origin Story */}
            <FadeIn className="mb-20">
                <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/[0.04] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A84FF]/[0.03] rounded-full blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-3xl">
                        <Rocket className="w-8 h-8 text-[#0A84FF] mb-6" />
                        <h2 className="text-2xl font-bold mb-4 text-white/90">La Misión</h2>
                        <p className="text-[16px] text-white/45 leading-[1.8] font-medium mb-6">
                            Creemos que el control financiero no debería ser un privilegio exclusivo de quienes pueden pagar un asesor. Creemos que la inteligencia artificial puede democratizar la claridad financiera — no con alertas vacías y gráficos básicos, sino con una mente autónoma que realmente entiende tu realidad.
                        </p>
                        <p className="text-[16px] text-white/45 leading-[1.8] font-medium">
                            Finmom no es una app de finanzas más. Es un <strong className="text-white/70">sistema operativo financiero</strong> con la estética de un producto Apple y la potencia de un terminal Bloomberg. Y en el centro de todo, vive M.I.A. — tu consciencia financiera.
                        </p>
                    </div>
                </div>
            </FadeIn>

            {/* Values */}
            <FadeIn className="mb-20">
                <h2 className="text-2xl font-bold mb-8 text-center text-white/90">Nuestros Principios</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Shield className="w-6 h-6 text-[#30D158]" />,
                            title: "Privacidad Primero",
                            desc: "Nunca vendimos datos. Nunca lo haremos. Tu información financiera es sagrada.",
                            color: "#30D158",
                        },
                        {
                            icon: <Sparkles className="w-6 h-6 text-[#0A84FF]" />,
                            title: "Diseño como Disciplina",
                            desc: "Cada pixel está donde debe estar. No sacrificamos estética por funcionalidad — exigimos ambas.",
                            color: "#0A84FF",
                        },
                        {
                            icon: <Target className="w-6 h-6 text-[#FF9F0A]" />,
                            title: "Ingeniería sin Atajos",
                            desc: "Construido con Next.js 16, IA de última generación y arquitectura de seguridad bancaria. Sin compromisos técnicos.",
                            color: "#FF9F0A",
                        },
                    ].map((v, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] text-center">
                                <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6"
                                    style={{ backgroundColor: `${v.color}10`, borderColor: `${v.color}20` }}>
                                    {v.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white/90">{v.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{v.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </FadeIn>

            {/* M.I.A. */}
            <FadeIn className="mb-20">
                <div className="p-10 rounded-[32px] bg-gradient-to-br from-[#BF5AF2]/[0.04] to-transparent border border-[#BF5AF2]/10 flex flex-col md:flex-row items-center gap-8">
                    <div className="shrink-0">
                        <MiaOrb size={100} state="idle" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3 text-white/90">El Corazón del Producto</h3>
                        <p className="text-[15px] text-white/50 leading-relaxed font-medium">
                            M.I.A. (Finmom Intelligence Agent) no fue una ocurrencia tardía — fue la primera decisión de diseño. Todo en Finmom existe para alimentar a M.I.A. y para que M.I.A. te alimente a vos con inteligencia accionable.
                        </p>
                    </div>
                </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Construí tu futuro financiero con nosotros</h2>
                <Link href="/register">
                    <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                        Comenzar gratis <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
            </FadeIn>
        </SubPageLayout>
    );
}
