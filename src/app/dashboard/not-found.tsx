import Link from "next/link";
import { ArrowLeft } from "lucide-react";



export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 aurora-bg opacity-30" />
            <div className="absolute inset-0 z-0 bg-noise opacity-[0.05]" />

            <div className="relative z-10 glass-panel rounded-3xl p-12 text-center max-w-md mx-4 backdrop-blur-2xl border-white/10">
                <h1 className="text-6xl font-bold mb-4 font-heading tracking-tighter">404</h1>
                <h2 className="text-2xl font-medium mb-6 text-white/90">Página no encontrada</h2>
                <p className="text-muted-foreground mb-8">
                    La ruta que buscas no existe en este sistema.
                </p>
                <Link
                    href="/dashboard"
                    replace
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver al Inicio</span>
                </Link>
            </div>
        </div>
    );
}
