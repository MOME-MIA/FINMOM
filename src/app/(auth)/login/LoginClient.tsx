"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/liquid/LiquidButton";
import { useSoundFx } from "@/hooks/useSoundFx";

function LoginContent() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { playHover, playClick, playError, playSuccess } = useSoundFx();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Prevent empty submission
        if (!code) return;

        setIsLoading(true);
        playClick();

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (res.ok) {
                // Success - Masterpiece Transition
                setIsUnlocked(true);
                playSuccess();

                // Wait for the cinematic unlock animation before redirecting
                setTimeout(() => {
                    router.push("/dashboard");
                    router.refresh();
                }, 1400);
            } else {
                // Error - Precise Haptic Shake
                playError();
                toast.error("Acceso Denegado", {
                    className: "bg-void-950 border-red-500/50 text-red-500",
                });
                setIsLoading(false);
                setCode("");
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
            }
        } catch (error) {
            playError();
            toast.error("Fallo del Servidor", {
                className: "bg-void-950 border-red-500/50 text-red-500",
            });
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#000000] selection:bg-teal-500/30">

            {/* --- LIVING MESH GRADIENT BACKGROUND --- */}
            {/* A complex, slow-moving cinematic lighting setup mimicking flagship device wallpapers */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black" />

            {/* Subtle Hardware Grain Overlay for tactile texture */}
            <div className="fixed inset-0 bg-noise opacity-[0.015] pointer-events-none z-10 mix-blend-overlay" />

            {/* --- THE VAULT CARD (DEEP GLASSMORPHISM) --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={
                    isUnlocked
                        ? {
                            scale: 1.1,
                            opacity: 0,
                            y: -40,
                            filter: "blur(20px)"
                        } // Masterpiece cinematic exit
                        : isShaking
                            ? {
                                x: [-10, 10, -8, 8, -5, 5, 0], // Aggressive, snappy haptic validation failure
                                filter: "contrast(1.2)"
                            }
                            : {
                                opacity: 1,
                                scale: 1,
                                x: 0,
                                y: 0,
                                filter: "blur(0px) contrast(1)"
                            }
                }
                transition={{
                    duration: isUnlocked ? 1.2 : isShaking ? 0.4 : 0.8,
                    ease: isUnlocked ? [0.16, 1, 0.3, 1] : isShaking ? "linear" : [0.16, 1, 0.3, 1]
                }}
                className="relative z-50 w-full max-w-[440px] px-6"
            >
                <div
                    className={cn(
                        "p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden transition-all duration-700 ease-out rounded-[40px]",
                        "bg-white/[0.01] backdrop-blur-[64px]",
                        "border border-white/[0.03] shadow-[0_24px_80px_-20px_rgba(0,0,0,1)]",
                        isShaking && "border-red-500/30 shadow-[0_0_60px_-10px_rgba(239,68,68,0.2)]"
                    )}
                >
                    {/* Vertical Premium Sheen (Only visible on high-end hover) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    {/* Fingerprint Squircle (Apple Icon Language) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 relative group"
                    >
                        <div className="w-[88px] h-[88px] rounded-[28px] bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-inner flex items-center justify-center relative overflow-hidden transition-colors duration-500 group-hover:border-white/[0.15]">

                            {/* Scanning Ray */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/20 to-transparent"
                                animate={{
                                    top: ["-100%", "200%"]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                    repeatDelay: 1
                                }}
                            />

                            <Fingerprint className={cn(
                                "h-10 w-10 transition-all duration-700 ease-out",
                                isUnlocked
                                    ? "text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.6)] scale-110"
                                    : "text-white/70 group-hover:text-white"
                            )} strokeWidth={1.5} />
                        </div>
                    </motion.div>

                    <form onSubmit={handleLogin} className="w-full space-y-10 relative z-10 block">
                        <div className="space-y-2 relative group w-full">
                            {/* Editorial Input Field */}
                            <div className="relative w-full">
                                <input
                                    id="code"
                                    name="code"
                                    type="password" /* Fallback */
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        playClick();
                                    }}
                                    onFocus={playHover}
                                    placeholder="Clave de Identidad"
                                    className={cn(
                                        "w-full bg-transparent text-center text-3xl md:text-4xl text-white placeholder:text-white/50 font-sans tracking-[0.25em] outline-none border-b border-white/[0.08] px-2 py-4 pb-5 transition-all duration-500 group-hover:border-white/20",
                                        "focus:text-white",
                                        isShaking && "border-red-500/30 text-red-400"
                                    )}
                                    autoFocus
                                    autoComplete="off"
                                    disabled={isLoading || isUnlocked}
                                    style={{ WebkitTextSecurity: "disc" } as any} // Natively forces beautiful bullet dots instead of text characters if supported
                                />

                                {/* Sharp Center-Out Fill Line */}
                                <motion.div
                                    className={cn(
                                        "absolute bottom-0 h-[1px]",
                                        isShaking ? "bg-red-500" : "bg-gradient-to-r from-transparent via-white to-transparent"
                                    )}
                                    initial={{ left: "50%", right: "50%", opacity: 0 }}
                                    animate={{
                                        left: code.length > 0 ? "0%" : "50%",
                                        right: code.length > 0 ? "0%" : "50%",
                                        opacity: code.length > 0 ? 1 : 0
                                    }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </div>
                        </div>

                        {/* Solid Authority Button */}
                        <motion.div
                            whileTap={!isUnlocked && !isLoading ? { scale: 0.96 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <LiquidButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                className={cn(
                                    "w-full h-14 md:h-16 text-xs md:text-sm font-semibold tracking-[0.2em] rounded-[20px] group overflow-hidden border border-white/5",
                                    "bg-white text-black hover:bg-white/90", // High contrast luxury switch
                                    "shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] transition-all duration-500"
                                )}
                                isLoading={isLoading}
                                disabled={!code || isUnlocked}
                                onMouseEnter={playHover}
                                holdDuration={1200} // Requires deliberate intent
                                onHoldComplete={() => handleLogin()}
                            >
                                <span className={cn(
                                    "relative z-10 flex items-center justify-center gap-3 transition-colors duration-300",
                                    "text-black" // Force black text on the stark white button for maximum impact
                                )}>
                                    {isUnlocked ? "ACCESO CONCEDIDO" : "MANTENER PRESIONADO"}
                                    <ArrowRight className={cn(
                                        "h-4 w-4 transition-transform duration-500",
                                        isUnlocked ? "translate-x-6 opacity-0" : "group-hover:translate-x-1"
                                    )} strokeWidth={1.5} />
                                </span>
                            </LiquidButton>
                        </motion.div>
                    </form>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                    className="text-center mt-10"
                >
                    <p className="text-white/50 text-[10px] uppercase font-sans tracking-[0.4em]">
                        FINMOM Platform • 2026
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function LoginClient() {
    return <LoginContent />;
}

