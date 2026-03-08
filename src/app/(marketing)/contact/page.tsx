"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
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

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-12 px-6 max-w-5xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Hablemos.
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-white/50 max-w-xl mx-auto font-medium leading-relaxed">
                        ¿Tenés una pregunta, una idea o querés colaborar? Estamos escuchando.
                    </p>
                </motion.div>
            </section>

            {/* Contact Grid */}
            <section className="py-12 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Info Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <FadeIn>
                            {[
                                { icon: <Mail className="w-5 h-5 text-[#0A84FF]" />, label: "Email", value: "hello@momentum.finance", color: "#0A84FF" },
                                { icon: <MapPin className="w-5 h-5 text-[#30D158]" />, label: "Ubicación", value: "Buenos Aires, Argentina — Remote-first", color: "#30D158" },
                                { icon: <Clock className="w-5 h-5 text-[#FF9F0A]" />, label: "Respuesta", value: "Menos de 24 horas en días hábiles", color: "#FF9F0A" },
                            ].map((item, i) => (
                                <div key={i} className="p-5 rounded-[20px] bg-white/[0.02] border border-white/[0.04] flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-[14px] text-white/70 font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </FadeIn>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3">
                        <FadeIn delay={0.1}>
                            {submitted ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 rounded-[28px] bg-white/[0.02] border border-white/[0.04] text-center">
                                    <CheckCircle2 className="w-12 h-12 text-[#30D158] mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2 text-white/90">Mensaje enviado</h3>
                                    <p className="text-[14px] text-white/50 font-medium">Te responderemos en menos de 24 horas. Gracias por tu interés en FINMOM.</p>
                                </motion.div>
                            ) : (
                                <form
                                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                                    className="p-6 md:p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] space-y-5"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block mb-2">Nombre</label>
                                            <input type="text" required placeholder="Tu nombre" className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 placeholder:text-white/25 font-medium focus:outline-none focus:border-[#0A84FF]/30 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block mb-2">Email</label>
                                            <input type="email" required placeholder="tu@email.com" className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 placeholder:text-white/25 font-medium focus:outline-none focus:border-[#0A84FF]/30 transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block mb-2">Asunto</label>
                                        <select defaultValue="" className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 font-medium focus:outline-none focus:border-[#0A84FF]/30 transition-all appearance-none">
                                            <option value="" disabled className="bg-black">Seleccioná un tema...</option>
                                            <option value="general" className="bg-black">Consulta general</option>
                                            <option value="partnership" className="bg-black">Partnership / Colaboración</option>
                                            <option value="press" className="bg-black">Prensa / Media</option>
                                            <option value="investment" className="bg-black">Inversión</option>
                                            <option value="bug" className="bg-black">Reportar un bug</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest block mb-2">Mensaje</label>
                                        <textarea required rows={5} placeholder="Contanos cómo podemos ayudarte..." className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 placeholder:text-white/25 font-medium focus:outline-none focus:border-[#0A84FF]/30 transition-all resize-none" />
                                    </div>
                                    <button type="submit" className="w-full h-12 bg-white text-black hover:bg-white/90 transition-all rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.98]">
                                        <Send className="w-4 h-4" /> Enviar mensaje
                                    </button>
                                </form>
                            )}
                        </FadeIn>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
