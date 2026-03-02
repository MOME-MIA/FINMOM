"use client";

import { AlertTriangle, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SmartAlertsProps {
    alerts: {
        type: 'danger' | 'warning' | 'info';
        title: string;
        message: string;
        action?: {
            label: string;
            onClick: () => void;
        };
    }[];
}

const ALERT_COLORS = {
    danger: "#FF453A",
    warning: "#FF9F0A",
    info: "#0A84FF",
};

export function SmartAlerts({ alerts }: SmartAlertsProps) {
    if (alerts.length === 0) return null;

    return (
        <div className="h-full flex flex-col gap-3 bg-white/[0.01] border border-white/[0.03] rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/[0.02] pb-4 mb-4 mt-[-4px]">
                <h3 className="text-[12px] font-medium text-white/50 tracking-wide flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#FF9F0A]" strokeWidth={1.5} />
                    Alertas
                </h3>
            </div>
            <AnimatePresence>
                {alerts.map((alert, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 py-2 border-t border-white/[0.04] first:border-t-0"
                    >
                        <div
                            className="w-0.5 h-full min-h-[32px] rounded-full shrink-0 mt-0.5"
                            style={{ backgroundColor: ALERT_COLORS[alert.type] }}
                        />
                        <div className="min-w-0">
                            <h4 className="text-[13px] font-medium text-white/80">{alert.title}</h4>
                            <p className="text-[12px] text-white/50 leading-relaxed mt-0.5">{alert.message}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
