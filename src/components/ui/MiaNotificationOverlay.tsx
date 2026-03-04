"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMiaStore, MiaNotification } from "@/store/miaStore";
import { MiaOrb } from "@/components/login/MiaOrb";
import { X } from "lucide-react";

export function MiaNotificationOverlay() {
    const { notifications, removeNotification, setDeferredPrompt, deferredPrompt, showInstallPrompt, setShowInstallPrompt } = useMiaStore();

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Wait a bit before offering the psychological prompt
            setTimeout(() => {
                // Show custom install prompt notification if not installed
                setShowInstallPrompt(true);
            }, 5000);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
            removeNotification("install-prompt");
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, [setDeferredPrompt, setShowInstallPrompt, removeNotification]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallPrompt(false);
                setDeferredPrompt(null);
            }
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex flex-col items-center justify-end p-6 pb-12 sm:pb-8 sm:items-end w-full h-[100dvh] overflow-hidden">
            <AnimatePresence mode="popLayout">

                {/* INSTALL PROMPT */}
                {showInstallPrompt && deferredPrompt && (
                    <motion.div
                        key="install-prompt"
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", y: 20 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="pointer-events-auto relative flex items-center gap-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-5 rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] max-w-sm w-full mb-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#BF5AF2]/10 to-transparent rounded-[28px] pointer-events-none" />
                        <div className="flex-shrink-0">
                            <MiaOrb size={48} state="thinking" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-white font-medium text-sm leading-tight tracking-wide">
                                Conexión actual inestable.
                            </p>
                            <p className="text-white/40 text-[11px] mt-1.5 leading-relaxed tracking-wider">
                                Instala el motor nativo para encriptación E2E y latencia cero.
                            </p>
                            <button
                                onClick={handleInstallClick}
                                className="mt-4 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-2.5 px-4 rounded-full transition-colors w-full tracking-widest uppercase border border-white/5"
                            >
                                Instalar Nativo
                            </button>
                        </div>
                        <button
                            onClick={() => setShowInstallPrompt(false)}
                            className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {/* STANDARD NOTIFICATIONS */}
                {notifications.map((notif: MiaNotification) => (
                    <NotificationItem key={notif.id} notif={notif} onDismiss={() => removeNotification(notif.id)} />
                ))}

            </AnimatePresence>
        </div>
    );
}

function NotificationItem({ notif, onDismiss }: { notif: MiaNotification, onDismiss: () => void }) {
    const getBorderColor = () => {
        switch (notif.status) {
            case 'error': return 'border-red-500/30';
            case 'success': return 'border-[#30D158]/30';
            case 'alert': return 'border-[#FF9F0A]/30';
            default: return 'border-white/10';
        }
    };

    const getOrbState = () => {
        switch (notif.status) {
            case 'alert': return 'speaking';
            case 'checking': return 'thinking';
            default: return notif.status as "idle" | "thinking" | "success" | "error" | "speaking";
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", y: 10 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className={`pointer-events-auto relative flex items-center gap-3.5 bg-[#050505]/90 backdrop-blur-2xl border ${getBorderColor()} pl-1.5 pr-4 py-1.5 rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.9)] max-w-md w-fit mb-3 isolate`}
        >
            <div className="flex-shrink-0">
                <MiaOrb size={36} state={getOrbState()} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
                <p className="text-white/90 font-medium text-xs sm:text-sm leading-tight tracking-[0.02em]">
                    {notif.message}
                </p>
            </div>
            <button
                onClick={onDismiss}
                className="text-white/30 hover:text-white/70 transition-colors shrink-0 outline-none ml-2"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}
