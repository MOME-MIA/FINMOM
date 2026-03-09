"use client";

import React, { useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, CheckCircle2, ChevronRight, CornerDownLeft, Clock, Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { useMiaStore } from "@/store/miaStore";
import { cn } from "@/lib/utils";
import { QuantumInput } from "./QuantumInput";
import { SingularityButton } from "./SingularityButton";
import { MiaOrb } from "./MiaOrb";
import { useAuth } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge";
import { joinWaitlistAction } from "@/app/actions";

interface FinmomAccessCardProps {
    mode?: "login" | "register" | "forgot-password";
}

export function FinmomAccessCard({ mode = "login" }: FinmomAccessCardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signIn, signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [revenue, setRevenue] = useState("");
    const [reason, setReason] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const controls = useAnimation();
    const [isExiting, setIsExiting] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isCoolingDown, setIsCoolingDown] = useState(false);

    const isRegister = mode === "register";
    const isForgotPassword = mode === "forgot-password";
    const waitlistParam = (!isRegister && !isForgotPassword) ? searchParams.get('waitlist') : null;

    // Waitlist Progressive State
    const [registerStep, setRegisterStep] = useState(0);
    const maxRegisterSteps = 3;

    const handleSubmit = async () => {
        if (isCoolingDown || isLoading) return;

        if (isForgotPassword) {
            if (!email) return;
            setIsLoading(true);
            try {
                const result = await insforge.auth.sendResetPasswordEmail({ email });
                if (result && "error" in result && result.error) {
                    useMiaStore.getState().notify({ status: 'error', message: result.error.message || "Error procesando solicitud" });
                    handleFailedAttempt();
                    setIsLoading(false);
                    return;
                }
                useMiaStore.getState().notify({ status: 'success', message: "Enlace enviado. Revisá tu inbox." });
                setIsUnlocked(true);
                setIsExiting(true);
                setTimeout(() => {
                    router.push("/login");
                    router.refresh();
                }, 1500);
            } catch (error) {
                useMiaStore.getState().notify({ status: 'error', message: "Error de conexión. Intentá de nuevo." });
                setIsLoading(false);
            }
            return;
        }

        if (isRegister) {
            // Progressive Waitlist Flow
            if (registerStep === 0) {
                if (!email) return;
                setRegisterStep(1);
                return;
            } else if (registerStep === 1) {
                if (!password) return;
                setRegisterStep(2);
                return;
            } else if (registerStep === 2) {
                if (!name) return;
                setRegisterStep(3);
                return;
            } else if (registerStep === 3) {
                if (!revenue) return;
                setRegisterStep(4);
                return;
            } else if (registerStep === 4) {
                if (!reason) return;
                // Final Submission
                setIsLoading(true);
                try {
                    // 1. Create real Auth account
                    const authResult = await signUp(email, password);
                    if (authResult && "error" in authResult && authResult.error) {
                        useMiaStore.getState().notify({ status: 'error', message: authResult.error || "Error al crear cuenta" });
                        handleFailedAttempt();
                        setIsLoading(false);
                        return;
                    }

                    // 2. Add to waitlist
                    const result = await joinWaitlistAction({ email, name, revenue, reason });
                    if (!result.success) {
                        useMiaStore.getState().notify({ status: 'error', message: result.error || "Error desconocido" });
                        handleFailedAttempt();
                        setIsLoading(false);
                        return;
                    }

                    useMiaStore.getState().notify({ status: 'success', message: "¡Identidad registrada en la lista de espera!" });
                    setIsUnlocked(true);
                    setIsExiting(true);
                    setTimeout(() => {
                        router.push(`/access-status?email=${encodeURIComponent(email)}`);
                        router.refresh();
                    }, 1500);
                } catch (error) {
                    useMiaStore.getState().notify({ status: 'error', message: "Error de conexión. Intentá de nuevo." });
                    setIsLoading(false);
                }
                return;
            }
        }

        // Standard Login
        if (!email || !password) return;
        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (result && "error" in result && result.error) {
                useMiaStore.getState().notify({ status: 'error', message: result.error || "Error al iniciar sesión" });
                handleFailedAttempt();
                setIsLoading(false);
                return;
            }
            setIsUnlocked(true);
            setIsExiting(true);
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 600);
        } catch (error) {
            useMiaStore.getState().notify({ status: 'error', message: "Error de conexión. Intentá de nuevo." });
            setIsLoading(false);
        }
    };

    const handleFailedAttempt = () => {
        setIsError(true);

        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }

        controls.start({
            x: [0, -8, 8, -5, 5, -2, 2, 0],
            transition: { duration: 0.4, ease: "easeInOut" }
        });
        setTimeout(() => setIsError(false), 500);

        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 10) {
            setIsCoolingDown(true);
            useMiaStore.getState().notify({ status: 'error', message: "Demasiados intentos. Esperá unos minutos." });
        } else if (newAttempts % 3 === 0) {
            setIsCoolingDown(true);
            useMiaStore.getState().notify({ status: 'alert', message: "Bloqueo de seguridad preventivo." });
            setTimeout(() => {
                setIsCoolingDown(false);
                useMiaStore.getState().notify({ status: 'success', message: "Podés volver a intentar." });
            }, 5000);
        }
    };

    // Determine button text dynamically based on flow
    const getButtonText = () => {
        if (isForgotPassword) return "ENVIAR ENLACE";
        if (isRegister) {
            if (registerStep === 0) return "Siguiente";
            if (registerStep === 1) return "Siguiente";
            if (registerStep === 2) return "Siguiente";
            if (registerStep === 3) return "Siguiente";
            if (registerStep === 4) return "SOLICITAR ACCESO";
        }
        return "Continuar";
    };

    // Determine if button is disabled dynamically
    const isButtonDisabled = () => {
        if (isCoolingDown) return true;
        if (isForgotPassword && !email) return true;
        if (!isRegister && !isForgotPassword && (!email || !password)) return true;
        if (isRegister) {
            if (registerStep === 0 && !email.includes("@")) return true;
            if (registerStep === 1 && password.length < 6) return true;
            if (registerStep === 2 && name.length < 2) return true;
            if (registerStep === 3 && revenue.length < 2) return true;
            if (registerStep === 4 && reason.length < 5) return true;
        }
        return false;
    };

    return (
        <div className="flex items-center justify-center w-full h-full relative z-30">
            <motion.div
                role="form"
                data-register-step={isRegister ? registerStep : undefined}
                aria-label={isRegister ? "Register Form" : isForgotPassword ? "Forgot Password Form" : "Login Form"}
                initial={{ opacity: 0, y: 10 }}
                animate={isExiting ? { opacity: 0, scale: 0.98, y: -20, filter: "blur(20px)" } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: isExiting ? 0.8 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "relative w-full h-auto rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] text-center",
                    "bg-white/[0.025] backdrop-blur-[80px]",
                    "border border-white/[0.06] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)]",
                    "flex flex-col overflow-hidden z-10",
                    "transition-all duration-700 ease-out",
                    isError && "border-red-500/30 shadow-[0_0_60px_-10px_rgba(239,68,68,0.2)]"
                )}
            >
                {/* Inner shimmer gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]" />
                {/* Vertical Premium Sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]" />

                <div className="relative z-30 flex flex-col h-full p-6 sm:p-8 md:p-10 lg:p-14 space-y-6 sm:space-y-8 lg:space-y-10">

                    {/* HEADER — hidden on mobile (AuthLayout provides hero Orb) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:flex flex-col items-center justify-center space-y-1"
                    >
                        <MiaOrb
                            size={88}
                            state={
                                isUnlocked ? "success"
                                    : isError ? "error"
                                        : isLoading ? "thinking"
                                            : "idle"
                            }
                        />
                        <h1 className="font-sans font-medium text-2xl tracking-[0.05em] text-white/80 leading-none">
                            FINMOM
                        </h1>
                        <span className="text-xs text-white/50 font-medium tracking-[0.1em] mt-2 uppercase flex items-center gap-2 justify-center">
                            {isRegister ? (
                                <>Solicitud de Acceso <span className="text-[#0A84FF]">{registerStep + 1}/5</span></>
                            ) : isForgotPassword ? "Recuperar Acceso" : "Validar Identidad"}
                        </span>
                    </motion.div>

                    {/* WAITLIST BANNER */}
                    {waitlistParam && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className={cn(
                                "w-full rounded-2xl border px-4 py-3 flex items-center gap-3",
                                waitlistParam === 'pending'
                                    ? "bg-[#FF9F0A]/[0.06] border-[#FF9F0A]/15"
                                    : waitlistParam === 'success'
                                        ? "bg-[#30D158]/[0.06] border-[#30D158]/15"
                                        : "bg-[#FF453A]/[0.06] border-[#FF453A]/15"
                            )}
                        >
                            {waitlistParam === 'pending' ? (
                                <Clock className="w-4 h-4 text-[#FF9F0A] shrink-0" />
                            ) : (
                                <Info className="w-4 h-4 text-[#30D158] shrink-0" />
                            )}
                            <div className="text-left">
                                <p className="text-[12px] text-white/70 font-medium">
                                    {waitlistParam === 'pending'
                                        ? "Tu cuenta está pendiente de aprobación."
                                        : waitlistParam === 'success'
                                            ? "¡Solicitud enviada! Te notificaremos cuando sea aprobada."
                                            : "Error del sistema. Intentá de nuevo más tarde."
                                    }
                                </p>
                                {waitlistParam === 'pending' && (
                                    <button
                                        type="button"
                                        onClick={() => router.push('/access-status')}
                                        className="text-[11px] text-[#0A84FF] hover:text-[#0A84FF]/80 font-medium mt-1 transition-colors"
                                    >
                                        Ver estado de tu solicitud →
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* INPUT SECTION */}
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3 w-full min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]">
                        <AnimatePresence mode="wait">
                            {(!isRegister || (isRegister && registerStep === 0)) && (
                                <motion.div
                                    key="email-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full flex justify-center"
                                >
                                    <motion.div animate={controls} className="w-full">
                                        <QuantumInput
                                            value={email}
                                            onChange={(e) => {
                                                if (isCoolingDown) return;
                                                setEmail(e.target.value);
                                                setIsError(false);
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                            placeholder="Email"
                                            isError={isError}
                                            isCoolingDown={isCoolingDown}
                                            disabled={isLoading || isUnlocked}
                                            type="email"
                                            autoFocus
                                            autoComplete="email"
                                        />
                                    </motion.div>
                                </motion.div>
                            )}

                            {isRegister && registerStep === 1 && (
                                <motion.div
                                    key="register-password-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full relative"
                                >
                                    <QuantumInput
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setIsError(false);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                        placeholder="Crea una contraseña segura"
                                        isError={isError}
                                        disabled={isLoading || isUnlocked}
                                        type={showPassword ? "text" : "password"}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/60 transition-colors focus:outline-none focus:text-white z-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                    </button>
                                </motion.div>
                            )}

                            {isRegister && registerStep === 2 && (
                                <motion.div
                                    key="name-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <QuantumInput
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setIsError(false);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                        placeholder="Nombre Completo / Alias"
                                        isError={isError}
                                        disabled={isLoading || isUnlocked}
                                        type="text"
                                        autoFocus
                                    />
                                </motion.div>
                            )}

                            {isRegister && registerStep === 3 && (
                                <motion.div
                                    key="revenue-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <QuantumInput
                                        value={revenue}
                                        onChange={(e) => {
                                            setRevenue(e.target.value);
                                            setIsError(false);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                        placeholder="Ingreso Promedio USD (Ej: 2000-5000)"
                                        isError={isError}
                                        disabled={isLoading || isUnlocked}
                                        type="text"
                                        autoFocus
                                    />
                                    <p className="text-[10px] text-white/30 text-left mt-2 pl-2 tracking-wide uppercase">Cifra confidencial cifrada E2E.</p>
                                </motion.div>
                            )}

                            {isRegister && registerStep === 4 && (
                                <motion.div
                                    key="reason-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <QuantumInput
                                        value={reason}
                                        onChange={(e) => {
                                            setReason(e.target.value);
                                            setIsError(false);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                        placeholder="¿Cuál es tu mayor fricción financiera hoy?"
                                        isError={isError}
                                        disabled={isLoading || isUnlocked}
                                        type="text"
                                        autoFocus
                                    />
                                </motion.div>
                            )}

                            {!isForgotPassword && !isRegister && (
                                <motion.div
                                    key="password-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full relative"
                                >
                                    <motion.div animate={controls} className="w-full relative">
                                        <QuantumInput
                                            value={password}
                                            onChange={(e) => {
                                                if (isCoolingDown) return;
                                                setPassword(e.target.value);
                                                setIsError(false);
                                            }}
                                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                            placeholder="Contraseña"
                                            isError={isError}
                                            isCoolingDown={isCoolingDown}
                                            disabled={isLoading || isUnlocked}
                                            type={showPassword ? "text" : "password"}
                                            autoComplete={isRegister ? "new-password" : "current-password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/60 transition-colors focus:outline-none focus:text-white z-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Links */}
                        <div className="w-full flex flex-col items-center gap-1 sm:gap-2 pt-1 sm:pt-2">
                            {!isRegister && !isForgotPassword && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/forgot-password")}
                                        className="text-[13px] sm:text-[14px] text-white/50 hover:text-white transition-colors font-medium outline-none tracking-wide min-h-[44px] flex items-center justify-center"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/access-status")}
                                        className="text-[12px] sm:text-[13px] text-[#0A84FF]/70 hover:text-[#0A84FF] transition-colors font-medium outline-none tracking-wide flex items-center justify-center mt-2"
                                    >
                                        ¿Solicitaste acceso? Verificá tu estado →
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setRegisterStep(0);
                                    router.push(isRegister ? "/login" : (isForgotPassword ? "/login" : "/register"))
                                }}
                                className="text-[13px] sm:text-[14px] text-white/50 hover:text-white/70 transition-colors font-medium outline-none tracking-wide min-h-[44px] flex items-center justify-center"
                            >
                                {isRegister ? "¿Ya tenés cuenta? Iniciar Sesión" : (isForgotPassword ? "Volver a Iniciar Sesión" : "¿No tenés cuenta? Evaluá acceso")}
                            </button>
                        </div>
                    </div>

                    {/* FOOTER ACTION */}
                    <div className="w-full pb-2 sm:pb-4 lg:pb-6">
                        <SingularityButton
                            isUnlocked={isUnlocked}
                            isLoading={isLoading}
                            onAuthenticate={handleSubmit}
                            disabled={isButtonDisabled()}
                            customIdleText={getButtonText()}
                            customSuccessText={isRegister ? "ENVIANDO DATOS" : isForgotPassword ? "ENVIADO" : "Verificado"}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
