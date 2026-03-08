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
import { useState, useEffect } from "react";
import { fetchProfile, type ProfileData } from "@/lib/insforgeProfile";

export function MobileTopHeader() {
    const { setOpen: setSearchOpen } = useSearch();
    const { toggleMia, isOpen: isMiaOpen } = useMia();
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData | null>(null);

    useEffect(() => {
        fetchProfile().then((data) => {
            if (data) setProfile(data);
        });
    }, []);

    return (
        <div
            className="w-full bg-black/90 backdrop-blur-md border-b border-white/[0.04] px-4 py-2.5 flex justify-between items-center gap-2 md:px-6"
        >
            {/* Left: Global Currency Selector */}
            <div className="shrink-0">
                <CurrencySelector />
            </div>

            {/* Date Picker (Pill) */}
            <div className="flex justify-center shrink overflow-hidden scale-90 sm:scale-100 origin-center">
                <DateSelector />
            </div>

            {/* Actions: M.I.A. Hero + Utilities */}
            <div className="flex items-center gap-1.5 shrink-0">
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
                        className="w-[38px] h-[38px] flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors active:scale-95 shrink-0 overflow-hidden"
                    >
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Perfil" className="w-[34px] h-[34px] rounded-full object-cover" />
                        ) : (
                            <User className="h-[17px] w-[17px]" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
