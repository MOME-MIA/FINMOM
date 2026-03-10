'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

interface SwipeButtonProps {
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
    text?: string;
    successText?: string;
    loadingText?: string;
    disabled?: boolean;
    className?: string;
}

export function SwipeButton({
    onConfirm,
    isLoading = false,
    text = "Deslizar para confirmar",
    successText = "¡Confirmado!",
    loadingText = "Procesando...",
    disabled = false,
    className = "",
}: SwipeButtonProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useAnimation();

    const [maxDrag, setMaxDrag] = useState(0);

    // Actualizar el límite de arrastre según el ancho del contenedor
    useEffect(() => {
        const updateConstraints = () => {
            if (containerRef.current && knobRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const knobWidth = knobRef.current.offsetWidth;
                setMaxDrag(containerWidth - knobWidth - 8); // 8px de padding (4px cada lado)
            }
        };

        updateConstraints();
        window.addEventListener('resize', updateConstraints);
        return () => window.removeEventListener('resize', updateConstraints);
    }, []);

    // Progreso del 0 al 1
    const progress = useTransform(x, [0, maxDrag || 1], [0, 1]);

    // Opacidad del texto original (desaparece al arrastrar)
    const textOpacity = useTransform(progress, [0, 0.5], [1, 0]);

    // Color del fondo que se va llenando
    const fillWidth = useTransform(progress, [0, 1], ['0%', '100%']);

    const handleDragEnd = async (event: any, info: any) => {
        if (disabled || isLoading || isSuccess) return;

        // Si arrastró más del 85%, confirmar
        if (info.offset.x > (maxDrag * 0.85)) {
            // Ir al final
            controls.start({ x: maxDrag });

            try {
                await onConfirm();
                // Si la promesa se resuelve (es un success)
                setIsSuccess(true);
            } catch (error) {
                // Si falla, volver al inicio
                controls.start({ x: 0 });
            }
        } else {
            // Volver al inicio si no fue suficiente
            controls.start({ x: 0 });
        }
    };

    // Reset si isLoading vuelve a false tras un error
    useEffect(() => {
        if (!isLoading && !isSuccess) {
            controls.start({ x: 0 });
            x.set(0);
        }
    }, [isLoading, isSuccess, controls, x]);

    const isInteractive = !disabled && !isLoading && !isSuccess;

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center h-14 w-full rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden shadow-inner ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {/* Fondo que se llena de verde/azul */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 bg-emerald-500/20"
                style={{ width: fillWidth }}
            />

            {/* Texto Central */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.span
                    className="text-sm font-semibold tracking-wide text-zinc-400"
                    style={{ opacity: isLoading || isSuccess ? 0 : textOpacity }}
                >
                    {text}
                </motion.span>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-emerald-400 font-medium"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {loadingText}
                    </motion.div>
                )}

                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-emerald-400 font-medium"
                    >
                        <Check className="w-5 h-5" />
                        {successText}
                    </motion.div>
                )}
            </div>

            {/* Knob (Arrastrable) */}
            <motion.div
                ref={knobRef}
                className={`absolute left-1 flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-lg z-10 
                    ${isInteractive ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02]' : ''}`}
                drag={isInteractive ? "x" : false}
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.05}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                whileTap={isInteractive ? { scale: 0.95 } : {}}
            >
                <ArrowRight className={`w-5 h-5 ${isInteractive ? 'text-emerald-600' : 'text-zinc-400'}`} />
            </motion.div>
        </div>
    );
}
