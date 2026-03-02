import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, Target, Wallet } from 'lucide-react';

export const SpendingWidget = ({ data }: { data: any }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="my-3 p-4 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3"
        >
            <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest font-medium">
                <Wallet size={14} className="text-emerald-400" />
                <span>Análisis de Gasto</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-3xl font-light text-white tracking-tight">${data.amount?.toLocaleString() || '0'}</span>
                <span className="text-sm text-white/50">{data.description || 'Gasto detectado'}</span>
            </div>

            {(data.trend || data.percentage) && (
                <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${data.trend === 'up' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {data.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{data.percentage || ''}% vs mes pasado</span>
                </div>
            )}
        </motion.div>
    );
};

export const SavingsWidget = ({ data }: { data: any }) => {
    const progress = Math.min(100, Math.max(0, data.progress || 0));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="my-3 p-4 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-4"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest font-medium">
                    <Target size={14} className="text-cyan-400" />
                    <span>Objetivo de Ahorro</span>
                </div>
                <span className="text-cyan-400/80 text-xs font-mono">{progress}%</span>
            </div>

            <div>
                <span className="text-white/90 font-medium">{data.goalName || 'Fondo de Emergencia'}</span>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-white">${data.currentAmount?.toLocaleString() || '0'}</span>
                    <span className="text-sm text-white/50">/ ${data.targetAmount?.toLocaleString() || '0'}</span>
                </div>
            </div>

            <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                />
            </div>
        </motion.div>
    );
};

export const AnomalyWidget = ({ data }: { data: any }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="my-3 p-4 bg-amber-500/[0.05] backdrop-blur-md rounded-2xl border border-amber-500/[0.15] shadow-[0_8px_32px_rgba(245,158,11,0.1)] flex flex-col gap-3 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-2 text-amber-400/90 text-xs uppercase tracking-widest font-semibold flex-shrink-0">
                <AlertCircle size={14} />
                <span>Anomalía Detectada</span>
            </div>

            <p className="text-sm text-white/80 leading-relaxed font-medium">
                {data.message || 'Se ha detectado un comportamiento inusual en tus finanzas.'}
            </p>

            {data.actionText && (
                <button className="mt-1 self-start px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl text-xs font-semibold transition-colors border border-amber-500/20">
                    {data.actionText}
                </button>
            )}
        </motion.div>
    );
};
