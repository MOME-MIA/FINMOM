"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated realistic financial data
const tickerData = [
    { symbol: "BTC/USD", value: "96,241.50", change: "+2.4%", isPositive: true },
    { symbol: "ETH/USD", value: "2,845.20", change: "+1.8%", isPositive: true },
    { symbol: "ARS/USD (CLL)", value: "1,120.00", change: "-0.5%", isPositive: false },
    { symbol: "EUR/USD", value: "1.0842", change: "+0.2%", isPositive: true },
    { symbol: "S&P 500", value: "5,145.30", change: "+0.8%", isPositive: true },
    { symbol: "NASDAQ", value: "16,234.10", change: "+1.2%", isPositive: true },
    { symbol: "GOLD", value: "2,154.80", change: "-0.3%", isPositive: false },
    { symbol: "AAPL", value: "172.50", change: "+1.5%", isPositive: true },
    { symbol: "TSLA", value: "178.20", change: "-2.1%", isPositive: false },
    { symbol: "NVDA", value: "875.40", change: "+3.2%", isPositive: true },
];

export function MarketTicker({ className }: { className?: string }) {
    // Duplicate array for seamless infinite scroll
    const duplicatedData = [...tickerData, ...tickerData, ...tickerData];

    return (
        <div className={cn(
            "w-full h-[40px] overflow-hidden bg-black/40 border-b border-white/[0.04] flex items-center shrink-0 z-40 relative backdrop-blur-md",
            className
        )}>
            {/* Edge Gradients for smooth fade in/out */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

            {/* Ticker Symbol overlay */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pr-6 bg-gradient-to-r from-black to-black/90 border-r border-white/10 z-20 pointer-events-none hidden md:flex">
                <DollarSign className="w-4 h-4 text-white/40 mr-2" />
                <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Mercados</span>
            </div>

            <motion.div
                className="flex items-center gap-8 whitespace-nowrap px-4"
                animate={{ x: [0, -2000] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 40,
                        ease: "linear",
                    },
                }}
            >
                {duplicatedData.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                        <span className="text-[12px] font-semibold tracking-wider text-white/70">{item.symbol}</span>
                        <span className="text-[12px] font-mono text-white/90">{item.value}</span>
                        <div className={cn(
                            "flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-sm",
                            item.isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                        )}>
                            {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {item.change}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
