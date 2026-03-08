"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
    ArrowRight,
    Shield,
    Lock,
    Eye,
    Fingerprint,
    Database,
    CheckCircle2,
    FileCheck,
    Server,
    Key,
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

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 max-w-5xl mx-auto text-center">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#30D158]/[0.03] rounded-full blur-[120px] pointer-events-none" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#30D158]/10 border border-[#30D158]/20 mb-8">
                        <Shield className="w-4 h-4 text-[#30D158]" />
                        <span className="text-[12px] font-bold text-[#30D158] uppercase tracking-wider">Seguridad de Grado Militar</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.05]">
                        Tu patrimonio,
                        <br />impenetrable.
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
                        Construimos FINMOM con la misma arquitectura de seguridad que usan los bancos de inversión.
                        Pero con una diferencia fundamental: ni siquiera nosotros podemos ver tus datos.
                    </p>
                </motion.div>
            </section>

            {/* Security Pillars */}
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Pilares de seguridad</h2>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: <Lock className="w-6 h-6 text-[#30D158]" />, title: "AES-256 End-to-End", desc: "Cada dato financiero se encripta con AES-256 antes de salir de tu dispositivo. El mismo estándar que usa la NSA para información clasificada.", color: "#30D158" },
                        { icon: <Eye className="w-6 h-6 text-[#0A84FF]" />, title: "Zero-Knowledge", desc: "Arquitectura donde ni siquiera los servidores de FINMOM pueden descifrar tus datos. Solo tu llave biométrica los desbloquea.", color: "#0A84FF" },
                        { icon: <Fingerprint className="w-6 h-6 text-[#FF9F0A]" />, title: "Auth Biométrica", desc: "Face ID, Touch ID y autenticación multi-factor. Tu identidad se verifica en cada sesión crítica.", color: "#FF9F0A" },
                        { icon: <Database className="w-6 h-6 text-[#FF453A]" />, title: "Row-Level Security", desc: "Cada fila de la base de datos tiene políticas de acceso individuales. Tu data solo es accesible con tu token autenticado.", color: "#FF453A" },
                        { icon: <Server className="w-6 h-6 text-[#0A84FF]" />, title: "Infraestructura Aislada", desc: "Servidores dedicados con aislamiento de red completo. Sin shared hosting, sin vecinos ruidosos, sin riesgos compartidos.", color: "#0A84FF" },
                        { icon: <Key className="w-6 h-6 text-[#30D158]" />, title: "Rotación de Llaves", desc: "Las llaves de encriptación se rotan automáticamente. Incluso en caso de compromiso, la ventana de exposición es mínima.", color: "#30D158" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.05}>
                            <motion.div whileHover={{ y: -4 }} className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] h-full transition-all hover:bg-white/[0.04]">
                                <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-white/90">{item.title}</h3>
                                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Zero Data Policy */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-[#30D158]/[0.04] to-transparent border border-[#30D158]/10">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-5 h-5 text-[#30D158]" />
                            <span className="text-[11px] font-bold text-[#30D158] uppercase tracking-widest">Política de Datos Cero</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4 text-white/90">
                            Tus datos no son nuestro producto.
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "No vendemos datos a terceros. Nunca.",
                                "No mostramos anuncios basados en tu comportamiento financiero.",
                                "No compartimos información con partners comerciales.",
                                "No usamos tus datos para entrenar modelos de IA genéricos.",
                                "Tus datos son tuyos. Podés exportarlos y eliminarlos en cualquier momento.",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-[#30D158] mt-0.5 shrink-0" />
                                    <span className="text-[14px] text-white/60 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </FadeIn>
            </section>

            {/* Compliance Badges */}
            <section className="py-16 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">Cumplimiento regulatorio</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "SOC 2 Ready", icon: <FileCheck className="w-5 h-5" /> },
                            { label: "GDPR Compliant", icon: <Shield className="w-5 h-5" /> },
                            { label: "Ley 25.326 (AR)", icon: <Lock className="w-5 h-5" /> },
                            { label: "ISO 27001 Path", icon: <CheckCircle2 className="w-5 h-5" /> },
                        ].map((badge, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} className="p-5 rounded-[20px] bg-white/[0.02] border border-white/[0.04] text-center hover:bg-white/[0.04] transition-all">
                                <div className="text-[#30D158] mb-2 flex justify-center">{badge.icon}</div>
                                <span className="text-[12px] font-bold text-white/60 uppercase tracking-wider">{badge.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </FadeIn>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Seguridad que no compromete.
                    </h2>
                    <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10 font-medium">
                        Protegé tu patrimonio con la misma infraestructura de un banco de inversión.
                    </p>
                    <Link href="/register">
                        <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                            Proteger mi patrimonio <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
