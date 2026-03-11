"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import {
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Activity,
    CreditCard,
    Lock,
    ChevronDown,
    Search,
    Zap,
    LayoutGrid,
    TrendingUp,
    DollarSign,
    RefreshCw,
} from "lucide-react";

// --- 1. VISUAL DNA: THE OBSIDIAN SYSTEM & UTILS ---

const cn = (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(" ");

// Mock Data Generators
const generateChartData = (days: number) => {
    const data = [];
    let value = 50000;
    for (let i = 0; i < days; i++) {
        const change = (Math.random() - 0.45) * 2000;
        value += change;
        data.push({
            date: `Day ${i + 1}`,
            value: Math.max(0, value),
        });
    }
    return data;
};

const TRANSACTIONS = [
    {
        id: 1,
        title: "Apple Inc.",
        category: "Subscription",
        amount: -14.99,
        date: "Today, 10:42 AM",
        icon: Zap,
    },
    {
        id: 2,
        title: "Freelance Payment",
        category: "Income",
        amount: 3250.0,
        date: "Yesterday, 4:20 PM",
        icon: TrendingUp,
    },
    {
        id: 3,
        title: "Whole Foods",
        category: "Groceries",
        amount: -142.8,
        date: "Yesterday, 6:15 PM",
        icon: CreditCard,
    },
    {
        id: 4,
        title: "Uber Ride",
        category: "Transport",
        amount: -24.5,
        date: "Oct 24, 9:30 PM",
        icon: Activity,
    },
];

// --- 2. DYNAMIC BRANDING: LIVING LOGO ---

const LivingLogo = ({ state }: { state: "stable" | "growth" | "alert" }) => {
    const variants = {
        stable: {
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
            filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))",
            color: "#2dd4bf", // Teal
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        },
        growth: {
            scale: [1, 1.1, 1],
            opacity: [0.9, 1, 0.9],
            filter: "drop-shadow(0 0 15px rgba(163, 230, 53, 0.6))",
            color: "#A3E635", // Toxic Lime
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        },
        alert: {
            x: [0, -2, 2, -2, 2, 0],
            filter: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.7))",
            color: "#EF4444", // Crimson
            transition: { duration: 0.5, repeat: Infinity },
        },
    };

    return (
        <motion.div
            className="flex items-center gap-2 font-black tracking-tighter text-2xl select-none cursor-pointer"
            animate={state}
            variants={variants as any}
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
            >
                <motion.path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                />
                <motion.path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <motion.path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span>MOM</span>
        </motion.div>
    );
};

// --- 3. UX/UI MECHANICS: KINETIC BUTTON ---

const KineticButton = ({
    children,
    onClick,
    className,
    variant = "primary",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary" | "ghost" | "danger";
}) => {
    const baseStyles =
        "relative overflow-hidden rounded-full px-6 py-3 font-bold transition-all duration-200 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-teal-600 text-white hover:bg-teal-500 shadow-glow",
        secondary:
            "bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.4)]",
        ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, x: [0, 2, -2, 0] }} // Micro-glitch on tap
            className={cn(baseStyles, variants[variant], className)}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};

// --- 4. COMPONENT ARCHITECTURE ---

// A. THE EXCLUSIVE GATE (Login)
const LoginView = ({ onLogin }: { onLogin: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 bg-[#050505]">
                <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.04] mix-blend-overlay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-900/20 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="z-10 w-full max-w-md p-8 rounded-[32px] bg-[#170529]/60 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col items-center gap-8"
            >
                <LivingLogo state="stable" />
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Private Vault
                    </h1>
                    <p className="text-white/50 text-sm font-mono">
                        SECURE ACCESS REQUIRED
                    </p>
                </div>

                <KineticButton onClick={onLogin} className="w-full" variant="primary">
                    <Lock className="w-4 h-4" />
                    <span>Enter System</span>
                </KineticButton>

                <div className="text-xs text-white/50 font-mono mt-4">
                    MOMENTUM OS v2.0
                </div>
            </motion.div>
        </div>
    );
};

// B. THE DASHBOARD
const DashboardView = ({ onLogout }: { onLogout: () => void }) => {
    const [currency, setCurrency] = useState<"USD" | "ARS">("USD");
    const [dateRange, setDateRange] = useState("1M");
    const [logoState, setLogoState] = useState<"stable" | "growth" | "alert">(
        "stable"
    );

    // Simulate data reaction
    useEffect(() => {
        const interval = setInterval(() => {
            const rand = Math.random();
            if (rand > 0.8) setLogoState("growth");
            else if (rand < 0.1) setLogoState("alert");
            else setLogoState("stable");
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const chartData = useMemo(() => generateChartData(30), []);

    const formatMoney = (amount: number) => {
        const val = currency === "ARS" ? amount * 1200 : amount;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-lime-400 selection:text-black relative overflow-x-hidden">
            {/* Global Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/assets/noise.svg')] opacity-[0.04] mix-blend-overlay" />

            {/* Header / Controller */}
            <header className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-8">
                    <LivingLogo state={logoState} />
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/50">
                        <a href="#" className="text-white hover:text-lime-400 transition-colors">Dashboard</a>
                        <a href="#" className="hover:text-white transition-colors">Market</a>
                        <a href="#" className="hover:text-white transition-colors">Wallet</a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Date Selector */}
                    <div className="hidden sm:flex bg-white/5 rounded-full p-1 border border-white/5">
                        {['1D', '1W', '1M', '1Y'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold transition-all",
                                    dateRange === range ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                                )}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    {/* Currency Toggle */}
                    <button
                        onClick={() => setCurrency((c) => (c === "USD" ? "ARS" : "USD"))}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-lime-400 hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        {currency}
                    </button>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 ring-2 ring-white/10" />
                </div>
            </header>

            {/* Main Content - The Wealth Grid */}
            <main className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">

                {/* Top Row: Net Worth & Strategy */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Card 1: NET WORTH */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 p-8 rounded-[32px] bg-[#170529]/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Wallet className="w-32 h-32 text-teal-500" />
                        </div>

                        <h2 className="text-white/50 font-medium mb-2">Net Available Asset</h2>
                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                                {formatMoney(124500)}
                            </span>
                            <span className="flex items-center gap-1 text-lime-400 font-mono text-sm bg-lime-400/10 px-2 py-1 rounded-md">
                                <ArrowUpRight className="w-3 h-3" />
                                +12.4%
                            </span>
                        </div>
                        <p className="mt-4 text-white/50 text-sm max-w-md">
                            Your portfolio is outperforming the S&P 500 by 4.2% this month.
                        </p>

                        {/* S-Pen Annotation */}
                        <svg className="absolute bottom-6 right-8 w-32 h-16 pointer-events-none opacity-80" viewBox="0 0 200 100">
                            <path d="M10,50 Q50,10 90,50 T180,50" fill="none" stroke="#A3E635" strokeWidth="3" strokeLinecap="round" className="animate-draw" />
                            <text x="100" y="80" fill="#A3E635" fontFamily="monospace" fontSize="14" transform="rotate(-5 100 80)">Great!</text>
                        </svg>
                    </motion.div>

                    {/* Card 2: STRATEGY DNA (50/30/20) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-[32px] bg-[#170529]/40 backdrop-blur-xl border border-white/5 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">Strategy DNA</h3>
                            <LayoutGrid className="w-5 h-5 text-white/50" />
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: "Needs (50%)", value: 45, color: "bg-teal-500" },
                                { label: "Wants (30%)", value: 32, color: "bg-emerald-500" },
                                { label: "Savings (20%)", value: 23, color: "bg-lime-400" },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">{item.label}</span>
                                        <span className="font-mono">{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", item.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Middle Row: Cash Flow Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full h-[400px] p-6 rounded-[32px] bg-[#170529]/40 backdrop-blur-xl border border-white/5 relative"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Cash Flow Velocity</h3>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Search className="w-4 h-4 text-white/50" /></button>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A3E635" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                                minTickGap={30}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 1000', 'dataMax + 1000']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#170529', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#A3E635', fontFamily: 'monospace' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}
                                formatter={(value: any) => [formatMoney(value as number), "Value"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#A3E635"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bottom Row: Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-[32px] bg-[#170529]/40 backdrop-blur-xl border border-white/5"
                >
                    <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {TRANSACTIONS.map((tx) => (
                            <div key={tx.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <tx.icon className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{tx.title}</div>
                                        <div className="text-xs text-white/50">{tx.category} • {tx.date}</div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "font-mono font-bold",
                                    tx.amount > 0 ? "text-lime-400" : "text-white"
                                )}>
                                    {tx.amount > 0 ? "+" : ""}{formatMoney(tx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <button className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest">View All Transactions</button>
                    </div>
                </motion.div>

            </main>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function MomCapitalPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AnimatePresence mode="wait">
            {!isLoggedIn ? (
                <motion.div
                    key="login"
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <LoginView onLogin={() => setIsLoggedIn(true)} />
                </motion.div>
            ) : (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <DashboardView onLogout={() => setIsLoggedIn(false)} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
