"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FinmomAccessCard } from "@/components/login/FinmomAccessCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Brain, Shield, Crown, Users, Lock, User } from "lucide-react";

const WAITLIST_STEPS = [
    { icon: <Sparkles className="w-4 h-4 text-[#BF5AF2]" />, title: "Contacto", desc: "Tu email principal." },
    { icon: <Lock className="w-4 h-4 text-[#FF9F0A]" />, title: "Seguridad", desc: "Crea tu contraseña cifrada." },
    { icon: <User className="w-4 h-4 text-[#30D158]" />, title: "Identidad", desc: "Tu nombre completo." },
    { icon: <Brain className="w-4 h-4 text-[#0A84FF]" />, title: "Evaluación M.I.A.", desc: "Contexto para tu perfil." },
    { icon: <Shield className="w-4 h-4 text-[#5856D6]" />, title: "Pase de Acceso", desc: "Confirmación final." },
];

export default function RegisterPage() {
    const [mounted, setMounted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const checkStep = () => {
            const stepIndicator = document.querySelector('[data-register-step]');
            if (stepIndicator) {
                const step = parseInt(stepIndicator.getAttribute('data-register-step') || '0');
                setCurrentStep(step);
            }
        };

        const observer = new MutationObserver(checkStep);
        const target = document.querySelector('[role="form"]');
        if (target) {
            observer.observe(target, { childList: true, subtree: true, attributes: true });
        }

        return () => observer.disconnect();
    }, [mounted]);

    if (!mounted) return null;

    return (
        <AuthLayout
            theme={{
                primaryGlow: "#BF5AF2",
                secondaryGlow: "#30D158",
                accentGlow: "#5856D6",
                selectionColor: "rgba(191, 90, 242, 0.3)",
            }}
            headerLink={{ href: "/login", label: "Ya tengo cuenta" }}
            mobileTitle="FINMOM"
            mobileSubtitle="Solicitud de Acceso"
            orbState="idle"
            trustBadges={[
                { icon: <Crown className="w-3.5 h-3.5 text-[#BF5AF2]" />, text: "Beta cerrada" },
                { icon: <Shield className="w-3.5 h-3.5 text-[#30D158]" />, text: "Cifrado E2E" },
                { icon: <Users className="w-3.5 h-3.5 text-[#FF9F0A]" />, text: "Cupos limitados" },
            ]}
            leftPanel={
                <div className="space-y-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#BF5AF2]/5 border border-[#BF5AF2]/10"
                    >
                        <Crown className="w-3.5 h-3.5 text-[#BF5AF2]" />
                        <span className="text-[11px] font-bold text-[#BF5AF2]/70 uppercase tracking-[0.2em]">Acceso Beta Cerrado</span>
                    </motion.div>

                    {/* Hero text */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-[42px] xl:text-[50px] font-extrabold tracking-[-0.03em] leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                            Solicitá
                            <br />
                            tu lugar.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[15px] text-white/35 leading-[1.7] font-medium max-w-[380px]"
                    >
                        FINMOM opera bajo estricta invitación. Ingresá tu email para unirte a la lista de espera fundacional y desbloquear a M.I.A.
                    </motion.p>

                    {/* Steps */}
                    <div className="space-y-3 pt-2">
                        {WAITLIST_STEPS.map((item, i) => {
                            const isCompleted = currentStep > i;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-500 cursor-default ${isCompleted
                                        ? "bg-[#30D158]/[0.04] border-[#30D158]/10"
                                        : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07]"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-500 ${isCompleted ? "bg-[#30D158]/10 border-[#30D158]/20" : "bg-white/[0.04] border-white/[0.05]"
                                        }`}>
                                        {isCompleted ? (
                                            <motion.svg
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-4 h-4 text-[#30D158]"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </motion.svg>
                                        ) : item.icon}
                                    </div>
                                    <div>
                                        <h3 className={`text-[13px] font-bold transition-colors duration-300 ${isCompleted ? "text-[#30D158]/60 line-through" : "text-white/60"}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-white/30 font-medium mt-0.5">{item.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer tagline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="flex items-center gap-2.5 text-[10px] text-white/25 font-bold tracking-[0.15em] uppercase pt-2"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#BF5AF2]/50" />
                        Cupos Limitados
                        <div className="w-1 h-1 rounded-full bg-white/15" />
                        Audición Continua
                        <div className="w-1 h-1 rounded-full bg-white/15" />
                        Cifrado Absoluto
                    </motion.div>
                </div>
            }
        >
            <FinmomAccessCard mode="register" />
        </AuthLayout>
    );
}
