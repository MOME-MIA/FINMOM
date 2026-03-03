"use client";

import { cn } from "@/lib/utils";
import { Search, User, ChevronLeft, ChevronRight, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/components/SearchModal";
import { useMia } from "@/components/chat/MiaContext";
import { MiaMicroWidget } from "@/components/chat/MiaMicroWidget";
import { useDate } from "@/context/DateContext";
import { CurrencySelector } from "@/components/layout/CurrencySelector";
import { DateSelector } from "@/components/layout/DateSelector";

export function MobileTopHeader() {
    const { setOpen: setSearchOpen } = useSearch();
    const { toggleMia, isOpen: isMiaOpen } = useMia();
    const router = useRouter();
    return (
        <div
            className="md:hidden fixed top-[40px] left-0 right-0 z-40 bg-gradient-to-b from-black via-black/80 to-transparent pb-6 px-3 flex justify-between items-center pointer-events-none gap-2 h-[calc(var(--header-height)-40px)] pt-[calc(var(--safe-top)+8px)]"
        >
            {/* Left: Global Currency Selector */}
            <div className="pointer-events-auto shrink-0 z-10">
                <CurrencySelector />
            </div>

            {/* Date Picker (Pill) */}
            <div className="pointer-events-auto flex justify-center shrink z-10 overflow-hidden scale-90 sm:scale-100 origin-center">
                <DateSelector />
            </div>

            {/* Actions: M.I.A. Hero + Utilities */}
            <div className="flex items-center gap-1.5 pointer-events-auto z-10 shrink-0">
                {/* M.I.A. — Hero Element */}
                <div
                    className={cn(
                        "relative flex items-center justify-center transition-all animate-pulse-slow"
                    )}
                >
                    <MiaMicroWidget orbSize={46} className="w-[46px] h-[46px]" />
                </div>

                {/* Utility Icons */}
                <div className="flex items-center bg-white/[0.02] backdrop-blur-xl border border-white/[0.04] rounded-full p-0.5">
                    <button
                        onClick={() => setSearchOpen(true)}
                        aria-label="Buscar"
                        className="w-[38px] h-[38px] flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors active:scale-95 shrink-0"
                    >
                        <Search className="h-[17px] w-[17px]" />
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/settings")}
                        aria-label="Ajustes de perfil"
                        className="w-[38px] h-[38px] flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors active:scale-95 shrink-0"
                    >
                        <User className="h-[17px] w-[17px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
