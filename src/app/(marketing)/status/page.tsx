"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
            {children}
        </motion.div>
    );
}

const SERVICES = [
    { name: "Dashboard & Web App", status: "operational", uptime: "99.99%" },
    { name: "M.I.A. Intelligence Engine", status: "operational", uptime: "99.98%" },
    { name: "API Gateway", status: "operational", uptime: "99.99%" },
    { name: "Payment Processing", status: "operational", uptime: "100%" },
    { name: "Data Encryption Layer", status: "operational", uptime: "100%" },
    { name: "Auth & Identity", status: "operational", uptime: "99.99%" },
];

const INCIDENTS: { date: string; title: string; status: string; desc: string }[] = [];

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "operational":
            return <CheckCircle2 className="w-5 h-5 text-[#30D158]" />;
        case "degraded":
            return <Clock className="w-5 h-5 text-[#FF9F0A]" />;
        case "outage":
            return <AlertTriangle className="w-5 h-5 text-[#FF453A]" />;
        default:
            return <CheckCircle2 className="w-5 h-5 text-[#30D158]" />;
    }
}

function StatusLabel({ status }: { status: string }) {
    const labels: Record<string, { text: string; color: string }> = {
        operational: { text: "Operativo", color: "#30D158" },
        degraded: { text: "Degradado", color: "#FF9F0A" },
        outage: { text: "Caída", color: "#FF453A" },
    };
    const config = labels[status] || labels.operational;
    return <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: config.color }}>{config.text}</span>;
}

export default function StatusPage() {
    const allOperational = SERVICES.every((s) => s.status === "operational");

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Header */}
            <section className="pt-36 pb-12 px-6 max-w-4xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Estado del Sistema
                    </h1>

                    {/* Global Status */}
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border ${allOperational
                            ? "bg-[#30D158]/10 border-[#30D158]/20"
                            : "bg-[#FF9F0A]/10 border-[#FF9F0A]/20"
                        }`}>
                        {allOperational ? <CheckCircle2 className="w-5 h-5 text-[#30D158]" /> : <Clock className="w-5 h-5 text-[#FF9F0A]" />}
                        <span className={`text-[14px] font-bold ${allOperational ? "text-[#30D158]" : "text-[#FF9F0A]"}`}>
                            {allOperational ? "Todos los sistemas operativos" : "Algunos sistemas con problemas"}
                        </span>
                    </div>
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className="py-8 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
                        {SERVICES.map((service, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-5 ${i < SERVICES.length - 1 ? "border-b border-white/[0.04]" : ""
                                    } hover:bg-white/[0.02] transition-colors`}
                            >
                                <div className="flex items-center gap-3">
                                    <StatusIcon status={service.status} />
                                    <span className="text-[14px] text-white/80 font-medium">{service.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[12px] text-white/40 font-medium hidden sm:block">Uptime: {service.uptime}</span>
                                    <StatusLabel status={service.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>

            {/* Uptime History */}
            <section className="py-12 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <h2 className="text-xl font-bold mb-6 text-white/80">Historial de los últimos 30 días</h2>
                    <div className="flex gap-1 items-end h-12">
                        {Array.from({ length: 30 }, (_, i) => {
                            const height = 80 + Math.random() * 20;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${height}%` }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.02, duration: 0.4 }}
                                    className="flex-1 rounded-sm bg-[#30D158]/60 hover:bg-[#30D158] transition-colors cursor-pointer"
                                    title={`Día ${30 - i}: ${height.toFixed(1)}% uptime`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-white/30 font-medium">30 días atrás</span>
                        <span className="text-[10px] text-white/30 font-medium">Hoy</span>
                    </div>
                </FadeIn>
            </section>

            {/* Recent Incidents */}
            <section className="py-12 px-6 max-w-4xl mx-auto">
                <FadeIn>
                    <h2 className="text-xl font-bold mb-6 text-white/80">Incidentes Recientes</h2>
                    {INCIDENTS.length === 0 ? (
                        <div className="p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.04] text-center">
                            <CheckCircle2 className="w-8 h-8 text-[#30D158] mx-auto mb-3" />
                            <p className="text-[14px] text-white/50 font-medium">Sin incidentes en los últimos 90 días</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {INCIDENTS.map((incident, i) => (
                                <div key={i} className="p-5 rounded-[20px] bg-white/[0.02] border border-white/[0.04]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-bold text-white/80">{incident.title}</span>
                                        <span className="text-[11px] text-white/30 font-medium">{incident.date}</span>
                                    </div>
                                    <p className="text-[13px] text-white/50 font-medium">{incident.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
