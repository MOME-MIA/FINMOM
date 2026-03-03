"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-black/60 backdrop-blur-2xl border-b border-white/[0.04]">
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <img src="/logo.png" alt="Finmom Logo" className="w-full h-full object-contain filter invert opacity-90 pointer-events-none select-none" />
                </div>
                <span className="font-bold text-[16px] sm:text-[18px] tracking-tight">Finmom</span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/login" className="text-[13px] sm:text-[14px] font-medium text-white/50 hover:text-white transition-colors">
                    Login <span className="hidden sm:inline">(Miembros)</span>
                </Link>
                <Link href="/register">
                    <button className="bg-white text-black hover:bg-white/90 font-semibold px-4 sm:px-5 h-8 sm:h-9 rounded-full text-[12px] sm:text-[13px] transition-all active:scale-95 whitespace-nowrap">
                        Unirse a la Waitlist
                    </button>
                </Link>
            </div>
        </header>
    );
}
