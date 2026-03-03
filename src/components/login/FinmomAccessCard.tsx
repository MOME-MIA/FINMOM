"use client";

import React, { useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    const { signIn, signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

    const handleSubmit = async () => {
        if (!email || isCoolingDown || isLoading) return;
        if (!isForgotPassword && !isRegister && !password) return;

        setIsLoading(true);

        try {
            if (isForgotPassword) {
                const result = await insforge.auth.sendResetPasswordEmail({ email });
                if (result && "error" in result && result.error) {
                    toast.error(result.error.message || "Error procesando solicitud");
                    handleFailedAttempt();
                    setIsLoading(false);
                    return;
                }
                toast.success("Enlace de recuperación enviado. Revisá tu email.");
                setIsUnlocked(true);
                setIsExiting(true);
                setTimeout(() => {
                    router.push("/login");
                    router.refresh();
                }, 1500);
                return;
            }

            if (isRegister) {
                const result = await joinWaitlistAction(email);
                if (!result.success) {
                    toast.error(result.error);
                    handleFailedAttempt();
                    setIsLoading(false);
                    return;
                }
                toast.success("¡Identidad registrada en la lista de espera!");
                // Optionally show a generic success state and don't redirect to dashboard since they can't access it yet
                setIsUnlocked(true);
                setIsExiting(true);
                setTimeout(() => {
                    router.push("/login?waitlist=success");
                    router.refresh();
                }, 1500);
                return;
            } else {
                const result = await signIn(email, password);
                if (result && "error" in result && result.error) {
                    toast.error(result.error || "Error al iniciar sesión");
                    handleFailedAttempt();
                    setIsLoading(false);
                    return;
                }
            }

            setIsUnlocked(true);
            setIsExiting(true);
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 600);
        } catch (error) {
            console.error("Auth error:", error);
            toast.error("Error de conexión. Intentá de nuevo.");
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
            toast.error("Demasiados intentos. Esperá unos minutos.");
        } else if (newAttempts % 3 === 0) {
            setIsCoolingDown(true);
            toast.warning("Bloqueo de seguridad. Esperá un momento...");
            setTimeout(() => {
                setIsCoolingDown(false);
                toast.success("Podés volver a intentar.");
            }, 5000);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full relative z-30">
            <motion.div
                role="form"
                aria-label={isRegister ? "Register Form" : isForgotPassword ? "Forgot Password Form" : "Login Form"}
                initial={{ opacity: 0, y: 10 }}
                animate={isExiting ? { opacity: 0, scale: 0.98, y: -20, filter: "blur(20px)" } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: isExiting ? 0.8 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "relative w-full h-auto rounded-[40px] text-center",
                    "bg-white/[0.01] backdrop-blur-[64px]",
                    "border border-white/[0.03] shadow-[0_24px_80px_-20px_rgba(0,0,0,1)]",
                    "flex flex-col overflow-hidden z-10",
                    "transition-all duration-700 ease-out",
                    isError && "border-red-500/30 shadow-[0_0_60px_-10px_rgba(239,68,68,0.2)]"
                )}
            >
                {/* Vertical Premium Sheen */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <div className="relative z-30 flex flex-col h-full p-10 md:p-14 space-y-10">

                    {/* HEADER */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center justify-center space-y-1"
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
                            Finmom
                        </h1>
                        <span className="text-xs text-white/50 font-medium tracking-[0.1em] mt-2 uppercase">
                            {isRegister ? "Solicitud de Acceso (Beta)" : isForgotPassword ? "Recuperar Acceso" : "Validar Identidad"}
                        </span>
                    </motion.div>

                    {/* INPUT SECTION */}
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3 w-full">
                        {/* Email */}
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

                        {/* Password */}
                        {!isForgotPassword && !isRegister && (
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
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/60 transition-colors focus:outline-none focus:text-white z-30"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                                </button>
                            </motion.div>
                        )}

                        {/* Confirm Password (Register only) - Removed for Waitlist */}

                        {/* Links */}
                        <div className="w-full flex flex-col items-center gap-2 pt-2">
                            {!isRegister && !isForgotPassword && (
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="text-[12px] text-white/50 hover:text-white transition-colors font-medium outline-none tracking-wide"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => router.push(isRegister ? "/login" : (isForgotPassword ? "/login" : "/register"))}
                                className="text-[12px] text-white/50 hover:text-white/70 transition-colors font-medium outline-none tracking-wide"
                            >
                                {isRegister ? "¿Ya tenés cuenta? Iniciá sesión" : (isForgotPassword ? "Volver a iniciar sesión" : "¿No tenés cuenta? Registrate")}
                            </button>
                        </div>
                    </div>

                    {/* FOOTER ACTION */}
                    <div className="w-full pb-6">
                        <SingularityButton
                            isUnlocked={isUnlocked}
                            isLoading={isLoading}
                            onAuthenticate={handleSubmit}
                            disabled={!email || (!isForgotPassword && !isRegister && !password) || isCoolingDown}
                            customIdleText={isRegister ? "SOLICITAR ACCESO" : isForgotPassword ? "ENVIAR ENLACE" : "Continuar"}
                            customSuccessText={isRegister ? "EN LISTA DE ESPERA" : isForgotPassword ? "ENVIADO" : "Verificado"}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
