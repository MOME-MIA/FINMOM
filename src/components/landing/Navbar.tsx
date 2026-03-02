"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-2xl border-b border-white/[0.04]">
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-xl flex items-center justify-center border border-white/10">
                    <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-[18px] tracking-tight">Momentum</span>
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/pricing" className="text-[14px] font-medium text-white/50 hover:text-white transition-colors">
                    Planes
                </Link>
                <Link href="/login" className="text-[14px] font-medium text-white/50 hover:text-white transition-colors">
                    Iniciar Sesión
                </Link>
                <Link href="/register">
                    <button className="bg-white text-black hover:bg-white/90 font-semibold px-5 h-9 rounded-full text-[13px] transition-all active:scale-95">
                        Comenzar gratis
                    </button>
                </Link>
            </div>
        </header>
    );
}
