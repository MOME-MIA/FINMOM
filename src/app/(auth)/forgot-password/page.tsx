"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { FinmomAccessCard } from "@/components/login/FinmomAccessCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AuthLayout
            theme={{
                primaryGlow: "#FF9F0A",
                secondaryGlow: "#FF453A",
                accentGlow: "#FF6B35",
                selectionColor: "rgba(255, 159, 10, 0.3)",
            }}
            headerLink={{ href: "/login", label: "Iniciar Sesión" }}
            mobileTitle="FINMOM"
            mobileSubtitle="Recuperar Acceso"
            orbState="idle"
            trustBadges={[
                { icon: <Mail className="w-3.5 h-3.5 text-[#FF9F0A]" />, text: "Enlace seguro" },
                { icon: <ShieldCheck className="w-3.5 h-3.5 text-[#30D158]" />, text: "Bóveda protegida" },
            ]}
            securityNote={
                <div className="p-4 rounded-2xl bg-[#FF9F0A]/[0.03] border border-[#FF9F0A]/[0.08]">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-[#FF9F0A] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                            <strong className="text-white/50">Nota de seguridad:</strong> FINMOM nunca te pedirá tu contraseña por email. Si recibís un correo sospechoso, contactá a <span className="text-[#FF9F0A]/60 font-semibold">support@momentum.finance</span>.
                        </p>
                    </div>
                </div>
            }
            leftPanel={
                <div className="space-y-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9F0A]/5 border border-[#FF9F0A]/10"
                    >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF9F0A]" />
                        <span className="text-[11px] font-bold text-[#FF9F0A]/70 uppercase tracking-[0.2em]">Recuperación de acceso</span>
                    </motion.div>

                    {/* Hero text */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-[42px] xl:text-[50px] font-extrabold tracking-[-0.03em] leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                            No te preocupes.
                            <br />
                            M.I.A. te cubre.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[15px] text-white/35 leading-[1.7] font-medium max-w-[380px]"
                    >
                        Ingresá tu email y te enviaremos un enlace seguro para restablecer tu contraseña. Tu información financiera permanece protegida.
                    </motion.p>

                    {/* Process */}
                    <div className="space-y-3 pt-2">
                        {[
                            { icon: <Mail className="w-4 h-4 text-[#FF9F0A]" />, title: "Ingresá tu email", desc: "El mismo que usaste al registrarte en FINMOM." },
                            { icon: <Clock className="w-4 h-4 text-[#64D2FF]" />, title: "Revisá tu correo", desc: "El enlace de recuperación llega en segundos." },
                            { icon: <ShieldCheck className="w-4 h-4 text-[#30D158]" />, title: "Acceso restaurado", desc: "Creá una nueva contraseña y volvé a tu bóveda." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.07] transition-all duration-300 cursor-default"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-white/60">{item.title}</h3>
                                    <p className="text-[11px] text-white/30 font-medium mt-0.5">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Security Note — Desktop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="p-4 rounded-2xl bg-[#FF9F0A]/[0.03] border border-[#FF9F0A]/[0.08]"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-[#FF9F0A] shrink-0 mt-0.5" />
                            <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                                <strong className="text-white/50">Nota de seguridad:</strong> FINMOM nunca te pedirá tu contraseña por email. Si recibís un correo sospechoso, contactá a <span className="text-[#FF9F0A]/60 font-semibold">support@momentum.finance</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            }
        >
            <FinmomAccessCard mode="forgot-password" />
        </AuthLayout>
    );
}
