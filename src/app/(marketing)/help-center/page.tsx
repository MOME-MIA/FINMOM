"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronDown,
    HelpCircle,
    Brain,
    Shield,
    CreditCard,
    Zap,
    Mail,
    BookOpen,
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

const FAQ_SECTIONS = [
    {
        title: "Empezando",
        icon: <BookOpen className="w-5 h-5 text-[#0A84FF]" />,
        items: [
            { q: "¿Qué es FINMOM?", a: "FINMOM es un Sistema Operativo Financiero Autónomo. Unifica todas tus cuentas bancarias, exchanges y billeteras en un solo lugar, con M.I.A. como tu inteligencia financiera 24/7." },
            { q: "¿Cómo me registro en la Waitlist?", a: "Hacé click en 'Unirse a la Waitlist' desde cualquier página. Completá tu email y recibirás acceso prioritario cuando se abran nuevas plazas de la beta." },
            { q: "¿Es gratis?", a: "La beta es completamente gratuita. Cuando lancemos los planes de pago, los early adopters tendrán beneficios exclusivos y descuentos permanentes." },
            { q: "¿En qué países está disponible?", a: "Actualmente la beta está abierta para Argentina. Próximamente expandiremos a Colombia, México y España." },
        ],
    },
    {
        title: "M.I.A. — Inteligencia Artificial",
        icon: <Brain className="w-5 h-5 text-[#30D158]" />,
        items: [
            { q: "¿Qué es M.I.A.?", a: "M.I.A. (Momentum Intelligence Agent) es tu asistente financiero autónomo. Aprende de tus patrones de gasto, categoriza transacciones, detecta anomalías y te sugiere optimizaciones — todo sin que se lo pidas." },
            { q: "¿M.I.A. accede a mi dinero?", a: "No. M.I.A. tiene acceso de solo lectura a tus datos financieros. No puede realizar transacciones, transferencias ni movimientos de dinero." },
            { q: "¿Cómo funciona la IA Explicable?", a: "Cada decisión y sugerencia de M.I.A. viene con un 'audit trail' — una explicación detallada de qué datos analizó, qué razonamiento aplicó y por qué llegó a esa conclusión." },
        ],
    },
    {
        title: "Seguridad & Privacidad",
        icon: <Shield className="w-5 h-5 text-[#FF453A]" />,
        items: [
            { q: "¿Mis datos están seguros?", a: "Absolutamente. Usamos encriptación AES-256 end-to-end, arquitectura Zero-Knowledge, y Row-Level Security. Ni siquiera nuestro equipo puede ver tus datos financieros." },
            { q: "¿Venden mis datos?", a: "Jamás. FINMOM tiene una política estricta de Zero-Knowledge Privacy. No vendemos, compartimos ni monetizamos los datos de nuestros usuarios. Cero anuncios, cero compromisos." },
            { q: "¿Qué pasa si hackean FINMOM?", a: "Incluso en un escenario de brecha, tus datos financieros están encriptados con llaves que solo vos controlás. Sin tu autenticación biométrica, los datos son ilegibles." },
        ],
    },
    {
        title: "Planes & Facturación",
        icon: <CreditCard className="w-5 h-5 text-[#FF9F0A]" />,
        items: [
            { q: "¿Cuánto cuesta FINMOM?", a: "Durante la beta, FINMOM es 100% gratuito. Los planes de pago se anunciarán antes del lanzamiento oficial. Los early adopters recibirán pricing especial." },
            { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, siempre. No hay contratos, lock-ins ni penalidades. Tus datos son tuyos y podés exportarlos cuando quieras." },
        ],
    },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-white/[0.04] last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full py-5 text-left group"
            >
                <span className="text-[14px] text-white/70 font-medium group-hover:text-white/90 transition-colors pr-4">{question}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="text-[13px] text-white/50 leading-relaxed font-medium pb-5">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function HelpCenterPage() {
    const [search, setSearch] = useState("");

    const filteredSections = FAQ_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter(
            (item) =>
                item.q.toLowerCase().includes(search.toLowerCase()) ||
                item.a.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((section) => section.items.length > 0);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-12 px-6 max-w-4xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Centro de Ayuda
                    </h1>
                    <p className="text-[16px] text-white/50 max-w-xl mx-auto mb-10 font-medium">
                        Encontrá respuestas rápidas a las preguntas más frecuentes sobre FINMOM y M.I.A.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar en el centro de ayuda..."
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[15px] text-white/80 placeholder:text-white/30 font-medium focus:outline-none focus:border-[#0A84FF]/30 focus:bg-white/[0.06] transition-all"
                        />
                    </div>
                </motion.div>
            </section>

            {/* FAQ Sections */}
            <section className="py-8 px-6 max-w-4xl mx-auto">
                <div className="space-y-8">
                    {filteredSections.map((section, i) => (
                        <FadeIn key={i} delay={i * 0.05}>
                            <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
                                    {section.icon}
                                    <h2 className="text-[15px] font-bold text-white/80">{section.title}</h2>
                                </div>
                                <div className="px-6">
                                    {section.items.map((item, j) => (
                                        <AccordionItem key={j} question={item.q} answer={item.a} />
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    ))}

                    {filteredSections.length === 0 && (
                        <div className="p-12 rounded-[28px] bg-white/[0.02] border border-white/[0.04] text-center">
                            <HelpCircle className="w-8 h-8 text-white/20 mx-auto mb-3" />
                            <p className="text-[14px] text-white/40 font-medium mb-1">Sin resultados para &quot;{search}&quot;</p>
                            <p className="text-[13px] text-white/30 font-medium">Intentá con otros términos o contactanos directamente.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="p-8 md:p-10 rounded-[28px] bg-gradient-to-br from-[#0A84FF]/[0.05] to-transparent border border-[#0A84FF]/10 text-center">
                        <Mail className="w-8 h-8 text-[#0A84FF] mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-white/90">¿No encontrás lo que buscás?</h3>
                        <p className="text-[14px] text-white/50 font-medium mb-6">
                            Nuestro equipo está listo para ayudarte. Respondemos en menos de 24 horas.
                        </p>
                        <Link href="/contact">
                            <button className="h-12 px-6 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[14px] font-bold flex items-center gap-2 mx-auto">
                                Contactar al equipo <Mail className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
