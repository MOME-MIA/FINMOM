"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { MiaOrb } from '@/components/login/MiaOrb';

function PricingSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // MP Redirect Params
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');
    const plan = searchParams.get('plan');
    const cycle = searchParams.get('cycle');

    useEffect(() => {
        setMounted(true);
        // If they managed to arrive here and the status is approved, we assume fulfillment is happening in the background via webhook
        // We auto-redirect after 5 seconds to dashboard
        if (status === 'approved') {
            const timer = setTimeout(() => {
                router.push('/dashboard');
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    if (!mounted) return null;

    const isSuccess = status === 'approved';

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans flex flex-col items-center">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 flex justify-center overflow-hidden pointer-events-none">
                <div className="absolute top-0 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-emerald-900/5 to-transparent blur-[80px] rounded-full opacity-50"></div>
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-[80px] rounded-full opacity-30"></div>
                <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent blur-[80px] rounded-full opacity-20"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <Navbar />

            <main className="flex-grow flex items-center justify-center flex-col w-full px-6 py-32 z-10 relative mt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[480px] w-full bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-10 flex flex-col items-center text-center backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                    {isSuccess ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                                className="mb-6 relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full"></div>
                                <MiaOrb size={80} state="thinking" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
                            >
                                <CheckCircle2 size={16} />
                                ¡Suscripción Activada!
                            </motion.div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white mb-4">
                                Bienvenido a Finmom <span className="capitalize text-white/70">{plan}</span>
                            </h1>

                            <p className="text-white/50 leading-relaxed mb-10 text-[15px]">
                                Tu pago {paymentId ? `(#${paymentId})` : ''} ha sido procesado exitosamente. Los sistemas de M.I.A han sido desbloqueados para tu cuenta.
                                Serás redirigido al Dashboard en unos instantes.
                            </p>

                            <button
                                onClick={() => router.push('/dashboard')}
                                className="group w-full h-[52px] bg-white text-black font-medium rounded-full flex items-center justify-center gap-2 hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                Entrar a Finmom
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                                className="mb-6 relative"
                            >
                                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                                <MiaOrb size={80} state="idle" />
                            </motion.div>

                            <h1 className="text-3xl font-semibold tracking-tight text-white mb-4">
                                Hubo un problema
                            </h1>

                            <p className="text-white/50 leading-relaxed mb-10 text-[15px]">
                                El pago {status ? `se encuentra en estado: ${status}` : 'no pudo completarse'}.
                                Por favor, intenta usar otro método de pago.
                            </p>

                            <button
                                onClick={() => router.push('/pricing')}
                                className="group w-full h-[52px] bg-white/[0.05] border border-white/[0.1] text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-white/[0.1] transition-all"
                            >
                                Volver a Planes
                            </button>
                        </>
                    )}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}

export default function PricingSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/50">Verificando estado del pago...</div>}>
            <PricingSuccessContent />
        </Suspense>
    );
}
