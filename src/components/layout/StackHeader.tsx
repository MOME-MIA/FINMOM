"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface StackHeaderProps {
    title: string;
    backPath?: string;
}

export function StackHeader({ title, backPath = "/dashboard/settings" }: StackHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-4 mb-6 pt-2">
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    if (backPath === 'back') {
                        router.back();
                    } else {
                        router.push(backPath);
                    }
                }}
                className="flex items-center justify-center size-10 rounded-full bg-white/[0.03] hover:bg-white/[0.08] transition-colors border border-white/[0.05] text-white/70 hover:text-white"
            >
                <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <motion.h1
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[28px] font-bold text-white tracking-tight leading-tight"
            >
                {title}
            </motion.h1>
        </div>
    );
}
