"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lock, Shield, Fingerprint, Eye, ShieldCheck, Server, KeyRound, Network, ArrowRight } from "lucide-react";
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

const PILLARS = [
    {
        icon: <Lock className="w-7 h-7 text-[#FF453A]" />,
        title: "Encriptación AES-256",
        desc: "Todos tus datos financieros están encriptados en tránsito y en reposo con el mismo estándar que utilizan los bancos centrales y agencias de inteligencia.",
        color: "#FF453A",
    },
    {
        icon: <Fingerprint className="w-7 h-7 text-[#30D158]" />,
        title: "Autenticación Biométrica",
        desc: "FaceID, huella dactilar y verificación comportamental continua. Tu identidad es tu llave — imposible de duplicar.",
        color: "#30D158",
    },
    {
        icon: <Eye className="w-7 h-7 text-[#0A84FF]" />,
        title: "Zero-Knowledge Privacy",
        desc: "Tu información financiera nunca sale de tu bóveda personal. Sin anuncios, sin venta de datos, sin compromisos de terceros.",
        color: "#0A84FF",
    },
    {
        icon: <ShieldCheck className="w-7 h-7 text-[#BF5AF2]" />,
        title: "Auditoría en Tiempo Real",
        desc: "Cada acción de M.I.A. queda registrada en un trail inmutable. Transparencia total sobre qué datos se procesan y por qué.",
        color: "#BF5AF2",
    },
    {
        icon: <Server className="w-7 h-7 text-[#64D2FF]" />,
        title: "Infraestructura Aislada",
        desc: "Servidores dedicados con red segmentada. Tus datos no comparten infraestructura con otros usuarios ni servicios externos.",
        color: "#64D2FF",
    },
    {
        icon: <KeyRound className="w-7 h-7 text-[#FF9F0A]" />,
        title: "Row-Level Security",
        desc: "Políticas de seguridad a nivel de fila en base de datos. Cada usuario solo puede acceder a sus propios registros — garantizado por arquitectura.",
        color: "#FF9F0A",
    },
];

export default function SecurityPage() {
    return (
        <SubPageLayout
            title="Radicalmente Seguro"
            subtitle="La seguridad no es una feature — es la base sobre la que todo está construido. Arquitectura diseñada para la paz mental."
            badge="Seguridad"
        >
            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                {PILLARS.map((p, i) => (
                    <FadeIn key={i} delay={i * 0.08}>
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] group"
                        >
                            <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-colors"
                                style={{ backgroundColor: `${p.color}10`, borderColor: `${p.color}20` }}>
                                {p.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white/90">{p.title}</h3>
                            <p className="text-[15px] text-white/50 leading-relaxed font-medium">{p.desc}</p>
                        </motion.div>
                    </FadeIn>
                ))}
            </div>

            {/* Compliance Banner */}
            <FadeIn>
                <div className="p-10 rounded-[32px] bg-gradient-to-br from-[#30D158]/[0.04] to-transparent border border-[#30D158]/10 text-center mb-20">
                    <Network className="w-10 h-10 text-[#30D158] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3 text-white/90">Cumplimiento Regulatorio</h3>
                    <p className="text-[15px] text-white/50 leading-relaxed font-medium max-w-2xl mx-auto">
                        Momentum cumple con las regulaciones de protección de datos personales (Ley 25.326 Argentina, GDPR) y estándares de seguridad de la industria financiera. Protocolos de auditoría interna y reportes de seguridad disponibles bajo solicitud.
                    </p>
                </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Tu dinero merece protección real
                </h2>
                <p className="text-white/50 text-[16px] mb-8 max-w-lg mx-auto">
                    No confiamos en promesas — confiamos en arquitectura. Compruébalo tú mismo.
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
