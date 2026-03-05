"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SystemHUD() {
    const [time, setTime] = useState("");
    const [cpu, setCpu] = useState(12);
    const [mem, setMem] = useState(64);
    const [net, setNet] = useState([20, 40, 60, 30, 50]); // Network bars

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Living System Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            // Fluctuate CPU (10-40%)
            setCpu(prev => Math.max(10, Math.min(40, prev + (Math.random() - 0.5) * 10)));

            // Fluctuate Memory (63-65TB)
            setMem(prev => Math.max(63, Math.min(65, prev + (Math.random() - 0.5) * 0.5)));

            // Fluctuate Network
            setNet(prev => prev.map(val => Math.max(10, Math.min(90, val + (Math.random() - 0.5) * 40))));

        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[90] p-8 flex flex-col justify-between text-[10px] font-mono tracking-widest text-white/50 uppercase select-none">

            {/* TOP ROW */}
            <div className="flex justify-between items-start">
                {/* Top Left: OS Version */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="flex flex-col gap-1"
                >
                    <span className="text-white/60">FINMOM OS v2.1</span>
                    <span>KERNEL: OBSIDIAN.45 [LIVE]</span>
                </motion.div>

                {/* Top Right: Clock & Security */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 1 }}
                    className="flex flex-col gap-1 items-end"
                >
                    <span className="text-white/80">{time}</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>SECURE CONNECTION</span>
                    </div>
                </motion.div>
            </div>

            {/* BOTTOM ROW */}
            <div className="flex justify-between items-end">
                {/* Bottom Left: Network Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.6, duration: 1 }}
                    className="flex flex-col gap-1"
                >
                    <span>NET_IO</span>
                    <div className="flex items-end gap-[2px] h-4">
                        {net.map((h, i) => (
                            <div
                                key={i}
                                className="w-1 bg-white/20 transition-all duration-500 ease-in-out"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Bottom Right: System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4, duration: 1 }}
                    className="flex flex-col gap-1 items-end"
                >
                    <div className="flex items-center gap-2">
                        <span>SYSTEM STATUS</span>
                        <span className="text-emerald-400">STABLE</span>
                    </div>
                    <span>MEM: {mem.toFixed(1)}TB // CPU: {cpu.toFixed(0)}%</span>
                </motion.div>
            </div>
        </div>
    );
}
