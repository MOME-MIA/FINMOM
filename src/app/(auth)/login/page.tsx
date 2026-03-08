"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FinmomAccessCard } from "@/components/login/FinmomAccessCard";
import { motion } from "framer-motion";
import { Lock, Shield, Zap, Fingerprint, KeyRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function WaitlistMessages() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const status = searchParams.get("waitlist");
        if (status === "success") {
            setTimeout(() => {
                toast.success("¡Identidad registrada en la lista de espera!", {
                    description: "Te avisaremos cuando tu acceso cerrado esté habilitado.",
                    duration: 5000,
                });
            }, 300);
            window.history.replaceState(null, "", "/login");
        } else if (status === "pending") {
            setTimeout(() => {
                toast.error("Bóveda Restringida", {
                    description: "Tu identidad aún está bajo revisión en la lista de espera. Te notificaremos cuando se apruebe tu acceso.",
                    duration: 6000,
                });
            }, 300);
            window.history.replaceState(null, "", "/login");
        } else if (status === "system_error") {
            setTimeout(() => {
                toast.error("Error de Sistema", {
                    description: "No se pudo validar tu estado en la lista de espera. Intenta de nuevo más tarde.",
                    duration: 5000,
                });
            }, 300);
            window.history.replaceState(null, "", "/login");
        }
    }, [searchParams]);

    return null;
}

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AuthLayout
            theme={{
                primaryGlow: "#0A84FF",
                secondaryGlow: "#64D2FF",
                accentGlow: "#5856D6",
                selectionColor: "rgba(10, 132, 255, 0.3)",
            }}
            headerLink={{ href: "/register", label: "Crear Cuenta" }}
            mobileTitle="FINMOM"
            mobileSubtitle="Validar Identidad"
            orbState="idle"
            trustBadges={[
                { icon: <Lock className="w-3.5 h-3.5 text-[#30D158]" />, text: "AES-256" },
                { icon: <Shield className="w-3.5 h-3.5 text-[#0A84FF]" />, text: "Bloqueo progresivo" },
                { icon: <Zap className="w-3.5 h-3.5 text-[#FF9F0A]" />, text: "M.I.A. 24/7" },
            ]}
            leftPanel={
                <div className="space-y-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A84FF]/5 border border-[#0A84FF]/10"
                    >
                        <Fingerprint className="w-3.5 h-3.5 text-[#0A84FF]" />
                        <span className="text-[11px] font-bold text-[#0A84FF]/70 uppercase tracking-[0.2em]">Bienvenido de vuelta</span>
                    </motion.div>

                    {/* Hero text */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-[42px] xl:text-[50px] font-extrabold tracking-[-0.03em] leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                            Tu bóveda financiera
                            <br />
                            te espera.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[15px] text-white/35 leading-[1.7] font-medium max-w-[380px]"
                    >
                        M.I.A. ha estado analizando el mercado mientras no estabas. Ingresá para ver qué descubrió.
                    </motion.p>

                    {/* Trust Signals — elevated design */}
                    <div className="space-y-3 pt-2">
                        {[
                            { icon: <Lock className="w-4 h-4 text-[#30D158]" />, title: "Encriptación AES-256", desc: "Todos tus datos financieros protegidos" },
                            { icon: <Shield className="w-4 h-4 text-[#0A84FF]" />, title: "Bloqueo progresivo", desc: "Seguridad adaptativa ante amenazas" },
                            { icon: <KeyRound className="w-4 h-4 text-[#FF9F0A]" />, title: "M.I.A. activa 24/7", desc: "Tu asistente financiera nunca descansa" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all duration-300 group cursor-default"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-white/60 group-hover:text-white/70 transition-colors">{item.title}</h3>
                                    <p className="text-[11px] text-white/30 font-medium mt-0.5">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            }
        >
            <Suspense fallback={null}>
                <WaitlistMessages />
            </Suspense>
            <FinmomAccessCard mode="login" />
        </AuthLayout>
    );
}
