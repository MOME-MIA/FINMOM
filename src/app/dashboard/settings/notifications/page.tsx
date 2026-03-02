"use client";

import { StackHeader } from "@/components/layout/StackHeader";
import { motion, Variants } from "framer-motion";
import { Smartphone, Mail, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }
};

export default function NotificationsSettingsPage() {
    return (
        <div className="flex flex-col min-h-full pb-24 max-w-2xl mx-auto w-full">
            <StackHeader title="Notificaciones" backPath="/settings" />

            <motion.div
                className="space-y-4 mt-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={itemVariants} className="bg-[#1c1c1e]/60 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/[0.05] shadow-sm">
                    <ToggleOption label="Notificaciones Push" icon={Smartphone} color="red" defaultChecked isFirst />
                    <div className="h-px w-full bg-white/[0.04] ml-[64px]" />
                    <ToggleOption label="Resumen Semanal por Email" icon={Mail} color="blue" />
                </motion.div>

                <motion.h4 variants={itemVariants} className="text-[13px] font-semibold text-white/50 uppercase tracking-widest pl-4 pt-4 pb-2">
                    Alertas Inteligentes
                </motion.h4>

                <motion.div variants={itemVariants} className="bg-[#1c1c1e]/60 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/[0.05] shadow-sm">
                    <ToggleOption label="Peligro de Presupuesto Mía" icon={Bell} color="orange" defaultChecked />
                </motion.div>
            </motion.div>
        </div>
    );
}

function ToggleOption({ label, icon: Icon, color, defaultChecked, isFirst }: any) {
    const [checked, setChecked] = useState(defaultChecked || false);

    const gradients = {
        blue: "bg-gradient-to-br from-[#0A84FF] to-[#005bb5]",
        red: "bg-gradient-to-br from-[#FF453A] to-[#b3261c]",
        green: "bg-gradient-to-br from-[#32D74B] to-[#1e8c2f]",
        purple: "bg-gradient-to-br from-[#BF5AF2] to-[#802aab]",
        orange: "bg-gradient-to-br from-[#FF9F0A] to-[#b87002]",
        indigo: "bg-[#5E5CE6]",
        gray: "bg-gradient-to-br from-[#8E8E93] to-[#5c5c60]",
    };

    return (
        <div
            onClick={() => setChecked(!checked)}
            className="flex items-center justify-between p-4 hover:bg-white/[0.06] active:bg-white/[0.08] transition-colors cursor-pointer select-none"
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "flex items-center justify-center shrink-0 h-[32px] w-[32px] rounded-full text-white shadow-sm",
                    gradients[color as keyof typeof gradients] || "bg-[#1c1c1e]"
                )}>
                    <Icon className="h-[15px] w-[15px]" strokeWidth={2.5} />
                </div>
                <span className="text-white/90 font-medium text-[16px]">{label}</span>
            </div>
            <div
                className={cn(
                    "flex items-center rounded-full p-[2px] w-[50px] h-[30px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-inner",
                    checked ? "bg-[#34C759] border-transparent" : "bg-white/10 border border-white/5"
                )}
            >
                <motion.div
                    layout
                    className="h-[26px] w-[26px] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ marginLeft: checked ? "auto" : "0px" }}
                />
            </div>
        </div>
    );
}
