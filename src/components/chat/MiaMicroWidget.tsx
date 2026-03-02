"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMia } from './MiaContext';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { MiaOrb } from '@/components/login/MiaOrb';

const routeHints: Record<string, string[]> = {
    '/dashboard': [
        "Monitoreando flujos en tiempo real...",
        "Todo en orden. Tu panorama financiero luce estable.",
        "Analizando micro-tendencias de esta semana.",
        "Tus KPIs están sincronizados."
    ],
    '/dashboard/transactions': [
        "Cada centavo queda registrado aquí.",
        "Recuerda categorizar los gastos nuevos.",
        "¿Movimientos inesperados? Puedo analizarlos."
    ],
    '/dashboard/budgets': [
        "Controlando límites presupuestarios.",
        "Mantén tus presupuestos en verde.",
        "La disciplina presupuestaria es clave."
    ],
    '/dashboard/analytics': [
        "Telemetría profunda activada.",
        "Detectando patrones de comportamiento.",
        "Procesando datos históricos..."
    ],
    '/dashboard/history': [
        "Historial inmutable. Todo queda registrado.",
        "Revisando la línea temporal de operaciones."
    ],
    '/dashboard/settings': [
        "Parámetros del sistema listos.",
        "Tu configuración está protegida."
    ],
    '/dashboard/settings/dna': [
        "Calibrando tu ADN financiero.",
        "Tus metas definen mis proyecciones."
    ],
    '/dashboard/expenses': [
        "Escaneando estructura de egresos.",
        "Identificando categorías de alto impacto."
    ],
    '/dashboard/accounts': [
        "Cuentas sincronizadas.",
        "Verificando saldos en tiempo real."
    ],
    '/dashboard/services': [
        "Servicios y suscripciones bajo control.",
        "¿Algún servicio que ya no uses?"
    ]
};

interface MiaMicroWidgetProps {
    className?: string;
    showOrb?: boolean;
    orbSize?: number;
}

export const MiaMicroWidget: React.FC<MiaMicroWidgetProps> = ({ className, showOrb = true, orbSize = 28 }) => {
    const { isOpen, toggleMia } = useMia();
    const pathname = usePathname();
    const [bubble, setBubble] = useState<string | null>(null);

    useEffect(() => {
        if (!pathname || !showOrb || isOpen) return;
        // Match exact or partial routes
        const matchedKey = Object.keys(routeHints).find(key => pathname === key || (key !== '/dashboard' && pathname.startsWith(key)));
        const hints = matchedKey ? routeHints[matchedKey] : routeHints['/dashboard'];
        if (hints && hints.length > 0 && pathname.startsWith('/dashboard')) {
            const randomHint = hints[Math.floor(Math.random() * hints.length)];
            const showTimer = setTimeout(() => setBubble(randomHint), 2000);
            const hideTimer = setTimeout(() => setBubble(null), 7500);
            return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
        } else {
            setBubble(null);
        }
    }, [pathname, showOrb, isOpen]);

    if (!showOrb) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={() => toggleMia()}
                onKeyDown={(e) => e.key === 'Enter' && toggleMia()}
                className={cn(
                    "flex items-center justify-center transition-colors relative cursor-pointer",
                    className
                )}
            >
                <Sparkles className="w-4 h-4 transition-colors" strokeWidth={1.5} />
            </div>
        );
    }

    const size = orbSize;
    const isSidebar = size <= 24;

    return (
        <div className="relative flex items-center justify-center">
            <motion.div
                role="button"
                tabIndex={0}
                onClick={() => {
                    setBubble(null);
                    toggleMia();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setBubble(null);
                        toggleMia();
                    }
                }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "relative flex items-center justify-center rounded-full shrink-0 transition-transform active:scale-95 group cursor-pointer hover:scale-[1.05]",
                    className
                )}
            >
                <MiaOrb size={size} state={isOpen ? "thinking" : "idle"} />
                {isOpen && <div className="absolute inset-0 bg-white/5 pointer-events-none rounded-full" />}
            </motion.div>

            <AnimatePresence>
                {bubble && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: isSidebar ? 0 : 10, x: isSidebar ? 10 : 0, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                        className={cn(
                            "absolute w-44 p-2.5 rounded-2xl bg-[#111111] border border-white/10 shadow-2xl z-50 pointer-events-none",
                            isSidebar ? "left-full ml-4 bottom-0 rounded-bl-sm" : "top-full right-0 mt-3 rounded-tr-sm"
                        )}
                    >
                        <div className="text-[11px] text-white/80 font-medium leading-relaxed tracking-wide">
                            <span className="text-[9px] text-white/50 uppercase tracking-widest block mb-1">M.I.A.</span>
                            {bubble}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
