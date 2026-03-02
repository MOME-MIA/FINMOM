"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 aurora-bg opacity-30" />
            <div className="absolute inset-0 z-0 bg-noise opacity-[0.05]" />

            <div className="relative z-10 glass-panel rounded-3xl p-12 text-center max-w-md mx-4 backdrop-blur-2xl border-white/10">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-4 font-heading tracking-tighter">Algo salió mal</h1>
                <p className="text-muted-foreground mb-8">
                    Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors w-full"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        <span>Intentar de nuevo</span>
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 bg-white/5 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors border border-white/10 w-full"
                    >
                        <Home className="h-4 w-4" />
                        <span>Volver al Inicio</span>
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-black/50 rounded-lg text-left overflow-auto max-h-40 border border-white/5">
                        <p className="text-xs font-mono text-red-400 break-all">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
