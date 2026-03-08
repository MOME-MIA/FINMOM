"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    LayoutDashboard,
    Target,
    Brain,
    DollarSign,
    TrendingUp,
    PieChart,
    Wallet,
    Sparkles,
} from "lucide-react";
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

const TABS = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "budgets", label: "Presupuestos", icon: <Target className="w-4 h-4" /> },
    { id: "mia", label: "Chat con M.I.A.", icon: <Brain className="w-4 h-4" /> },
];

const MOCK_DATA = {
    overview: {
        netWorth: "$124,850",
        change: "+2.3%",
        accounts: [
            { name: "Banco Principal (ARS)", amount: "$2,450,000 ARS", color: "#0A84FF" },
            { name: "Wise (USD)", amount: "$8,420 USD", color: "#30D158" },
            { name: "Binance (BTC)", amount: "0.12 BTC", color: "#FF9F0A" },
        ],
        insights: "Tu patrimonio creció un 2.3% este mes. M.I.A. detectó un cobro duplicado de $14,500 ARS que fue reportado automáticamente.",
    },
    budgets: {
        categories: [
            { name: "Vivienda", spent: 75, limit: "$180,000", color: "#0A84FF" },
            { name: "Alimentación", spent: 62, limit: "$45,000", color: "#30D158" },
            { name: "Transporte", spent: 88, limit: "$25,000", color: "#FF9F0A" },
            { name: "Delivery", spent: 92, limit: "$18,000", color: "#FF453A" },
        ],
    },
    mia: {
        messages: [
            { from: "user", text: "¿Cómo están mis finanzas este mes?" },
            { from: "mia", text: "Tu patrimonio neto es $124,850 USD, un +2.3% vs. mes anterior. Tu presupuesto de Delivery está al 92%, te sugiero reducirlo esta semana. Además detecté un cobro duplicado de $14,500 ARS que ya reporté." },
            { from: "user", text: "¿Cuánto me queda de runway?" },
            { from: "mia", text: "A tu ritmo de gasto actual, tu runway es de 14.2 meses. Si corrigés el exceso en Delivery y Transporte, podés extenderlo a 17.8 meses." },
        ],
    },
};

export default function SandboxPage() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-36 pb-12 px-6 max-w-5xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
                        <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
                        <span className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Demo Interactiva</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.05]">
                        Explorá FINMOM
                        <br />sin registrarte.
                    </h1>
                    <p className="text-[16px] text-white/50 max-w-xl mx-auto font-medium leading-relaxed">
                        Navegá un dashboard con datos ficticios. Sentí el poder de M.I.A. sin compromisos.
                    </p>
                </motion.div>
            </section>

            {/* Interactive Dashboard Mock */}
            <section className="py-8 px-6 max-w-5xl mx-auto">
                <FadeIn>
                    <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
                        {/* Tab Bar */}
                        <div className="flex items-center gap-1 p-3 border-b border-white/[0.04] bg-white/[0.01]">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${activeTab === tab.id
                                            ? "bg-white/[0.06] text-white/90 border border-white/[0.08]"
                                            : "text-white/40 hover:text-white/60 hover:bg-white/[0.03] border border-transparent"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-8 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {activeTab === "overview" && (
                                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {/* Net Worth */}
                                            <div className="flex-1">
                                                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Net Worth Unificado</p>
                                                <div className="flex items-baseline gap-3 mb-6">
                                                    <span className="text-4xl md:text-5xl font-bold text-white/90 tracking-tight">{MOCK_DATA.overview.netWorth}</span>
                                                    <span className="text-[14px] font-bold text-[#30D158]">{MOCK_DATA.overview.change}</span>
                                                </div>

                                                {/* Accounts */}
                                                <div className="space-y-3">
                                                    {MOCK_DATA.overview.accounts.map((acc, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: acc.color }} />
                                                                <span className="text-[13px] text-white/60 font-medium">{acc.name}</span>
                                                            </div>
                                                            <span className="text-[13px] text-white/80 font-semibold">{acc.amount}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* M.I.A. Insight */}
                                            <div className="flex-1 max-w-sm">
                                                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A84FF]/[0.05] to-transparent border border-[#0A84FF]/10">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Brain className="w-4 h-4 text-[#0A84FF]" />
                                                        <span className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-widest">Insight de M.I.A.</span>
                                                    </div>
                                                    <p className="text-[13px] text-white/60 leading-relaxed font-medium">{MOCK_DATA.overview.insights}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "budgets" && (
                                    <motion.div key="budgets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-6">Presupuestos del Mes</p>
                                        <div className="space-y-5">
                                            {MOCK_DATA.budgets.categories.map((cat, i) => (
                                                <div key={i}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[14px] text-white/70 font-medium">{cat.name}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[12px] text-white/40 font-medium">Límite: {cat.limit}</span>
                                                            <span className={`text-[12px] font-bold ${cat.spent > 85 ? "text-[#FF453A]" : "text-[#30D158]"}`}>{cat.spent}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${cat.spent}%` }}
                                                            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: cat.color }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "mia" && (
                                    <motion.div key="mia" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                        <div className="space-y-4 max-w-lg mx-auto">
                                            {MOCK_DATA.mia.messages.map((msg, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.3, duration: 0.5 }}
                                                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium ${msg.from === "user"
                                                            ? "bg-white/[0.06] border border-white/[0.08] text-white/70 rounded-br-sm"
                                                            : "bg-[#0A84FF]/[0.08] border border-[#0A84FF]/15 text-white/70 rounded-bl-sm"
                                                        }`}>
                                                        {msg.from === "mia" && (
                                                            <span className="text-[9px] text-[#0A84FF] font-bold uppercase tracking-widest block mb-1">M.I.A.</span>
                                                        )}
                                                        {msg.text}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        ¿Te convenció?
                    </h2>
                    <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10 font-medium">
                        Creá tu cuenta gratis y conectá tus cuentas reales.
                    </p>
                    <Link href="/register">
                        <button className="h-14 px-8 bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all rounded-full text-[16px] font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 mx-auto">
                            Crear mi cuenta gratis <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </FadeIn>
            </section>

            <Footer />
        </div>
    );
}
