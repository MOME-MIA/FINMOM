"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, X } from "lucide-react";

interface IntentionalFrictionProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    delayMs?: number; // Intentional friction delay in ms
}

export function IntentionalFriction({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    delayMs = 1500
}: IntentionalFrictionProps) {
    const [timeLeft, setTimeLeft] = useState(delayMs / 1000);
    const [canConfirm, setCanConfirm] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(delayMs / 1000);
            setCanConfirm(false);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0.1) {
                    clearInterval(interval);
                    setCanConfirm(true);
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isOpen, delayMs]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Glass Overlay */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-sm bg-black/60 border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Danger Gradient Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-50" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20 text-red-400">
                                <AlertOctagon className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-medium text-white mb-2 tracking-tight">
                                {title}
                            </h3>

                            <p className="text-sm text-white/50 mb-8 leading-relaxed">
                                {description}
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={!canConfirm}
                                    className={`relative w-full py-3.5 rounded-2xl font-medium text-[15px] tracking-wide transition-all overflow-hidden ${canConfirm
                                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-[0.98] border border-red-500/20"
                                            : "bg-white/5 text-white/50 border border-transparent cursor-not-allowed"
                                        }`}
                                >
                                    {/* Progress background while waiting */}
                                    {!canConfirm && (
                                        <motion.div
                                            className="absolute top-0 bottom-0 left-0 bg-white/5"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: delayMs / 1000, ease: "linear" }}
                                        />
                                    )}
                                    <span className="relative z-10">
                                        {canConfirm ? confirmText : `Espera ${Math.ceil(timeLeft)}s...`}
                                    </span>
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 rounded-2xl font-medium text-[15px] tracking-wide text-white/70 bg-white/5 hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

