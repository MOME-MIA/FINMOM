"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MessageSquare, Send, MapPin, Clock } from "lucide-react";

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

export default function ContactPage() {
    const [sent, setSent] = useState(false);

    return (
        <SubPageLayout
            title="Contacto"
            subtitle="¿Tenés preguntas, sugerencias o querés colaborar? Estamos para escucharte."
            badge="Compañía"
        >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-20">
                {/* Contact Form */}
                <FadeIn className="md:col-span-3">
                    <div className="p-8 md:p-10 rounded-[28px] bg-white/[0.02] border border-white/[0.04]">
                        {sent ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12">
                                <div className="w-16 h-16 bg-[#30D158]/10 border border-[#30D158]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-7 h-7 text-[#30D158]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white/90">Mensaje enviado</h3>
                                <p className="text-[15px] text-white/50 font-medium">Te responderemos dentro de 24 horas hábiles.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                                <div>
                                    <label className="block text-[12px] font-bold text-white/50 uppercase tracking-widest mb-2">Nombre</label>
                                    <input
                                        type="text" required placeholder="Tu nombre completo"
                                        className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#0A84FF]/30 transition-colors font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-white/50 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email" required placeholder="tu@email.com"
                                        className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#0A84FF]/30 transition-colors font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-white/50 uppercase tracking-widest mb-2">Asunto</label>
                                    <select className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/60 focus:outline-none focus:border-[#0A84FF]/30 transition-colors font-medium appearance-none">
                                        <option value="general">Consulta General</option>
                                        <option value="support">Soporte Técnico</option>
                                        <option value="business">Colaboraciones</option>
                                        <option value="press">Prensa</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-white/50 uppercase tracking-widest mb-2">Mensaje</label>
                                    <textarea
                                        required rows={5} placeholder="Contanos cómo podemos ayudarte..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/80 placeholder-white/20 focus:outline-none focus:border-[#0A84FF]/30 transition-colors font-medium resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full h-12 bg-white text-black font-bold rounded-xl text-[14px] hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Enviar mensaje <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </FadeIn>

                {/* Contact Info */}
                <FadeIn className="md:col-span-2" delay={0.1}>
                    <div className="space-y-6">
                        {[
                            { icon: <Mail className="w-5 h-5 text-[#0A84FF]" />, label: "Email", value: "hello@momentum.finance", color: "#0A84FF" },
                            { icon: <MessageSquare className="w-5 h-5 text-[#30D158]" />, label: "Soporte", value: "support@momentum.finance", color: "#30D158" },
                            { icon: <MapPin className="w-5 h-5 text-[#BF5AF2]" />, label: "Ubicación", value: "Buenos Aires, Argentina", color: "#BF5AF2" },
                            { icon: <Clock className="w-5 h-5 text-[#FF9F0A]" />, label: "Horario", value: "Lun - Vie, 9:00 - 18:00 ART", color: "#FF9F0A" },
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-[20px] bg-white/[0.02] border border-white/[0.04]">
                                <div className="w-10 h-10 rounded-xl border flex items-center justify-center mb-3"
                                    style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                                    {item.icon}
                                </div>
                                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-[14px] text-white/70 font-semibold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </SubPageLayout>
    );
}
