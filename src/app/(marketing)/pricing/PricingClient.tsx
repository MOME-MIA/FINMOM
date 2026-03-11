"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Sparkles, Zap, Shield, HelpCircle, ArrowRight, Brain, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly";

const PRICING_PLANS = [
    {
        name: "Free",
        description: "Control financiero básico con asesoramiento guiado para empezar.",
        price: { monthly: 0, yearly: 0 },
        badge: null,
        miaLimits: "10 consultas mensuales a M.I.A.",
        features: [
            "Gestión hasta 2 Cuentas",
            "Presupuestos básicos",
            "Historial de transacciones mensual",
            "Soporte comunitario",
        ],
        notIncluded: [
            "Financial DNA (Desglose Inteligente)",
            "Respuestas ultra-rápidas de IA",
            "Exportación a PDF / Excel",
            "Soporte prioritario 24/7",
        ],
        ctaText: "Comenzar Gratis",
        ctaHref: "/register",
        color: "text-white/70",
        border: "border-white/10 hover:border-white/30",
        button: "bg-white/10 hover:bg-white/20 text-white",
    },
    {
        name: "Pro",
        description: "El poder real de M.I.A para freelancers y finanzas serias.",
        price: { monthly: 15, yearly: 12 },
        badge: "Más Elegido",
        miaLimits: "250 consultas mensuales de alta rflexión.",
        features: [
            "Cuentas ilimitadas",
            "Financial DNA (Lógica de 4 Semanas)",
            "Historial Spreadsheet Interactivo",
            "Gráficos analíticos avanzados",
            "Asesoramiento financiero proactivo",
        ],
        notIncluded: [
            "Modelos de IA de última generación (Gemini 1.5 Pro)",
            "Sesiones 1-a-1 de armado de empresas",
        ],
        ctaText: "Convertirse en Pro",
        ctaHref: "/register?plan=pro",
        color: "text-blue-400",
        border: "border-blue-500/30 hover:border-blue-500/60 ring-1 ring-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]",
        button: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]",
    },
    {
        name: "Enterprise",
        description: "Inteligencia sin límites para emprendedores de élite y PyMES.",
        price: { monthly: 49, yearly: 39 },
        badge: "Sin Límites",
        miaLimits: "Consultas ilimitadas y máxima prioridad de red.",
        features: [
            "Todo lo de Pro, sin topes",
            "Modelos de lenguaje superiores",
            "Integraciones futuras exclusivas",
            "Predicción de flujos de caja a 12 meses",
            "Exportación legal de reportes",
            "Soporte directo con el equipo fundador",
        ],
        notIncluded: [],
        ctaText: "Contactar Ventas",
        ctaHref: "mailto:hello@momentumfinance.app",
        color: "text-teal-400",
        border: "border-teal-500/20 hover:border-teal-500/40",
        button: "bg-white text-black hover:bg-gray-100",
    },
];

const FAQS = [
    {
        q: "¿Puedo cambiar de plan más adelante?",
        a: "Por supuesto. Puedes hacer upgrade a Pro o Enterprise, o bajar a Free en cualquier momento desde los ajustes de tu cuenta. El saldo a favor se prorrata automáticamente.",
    },
    {
        q: "¿Qué sucede si excedo el límite de M.I.A?",
        a: "En el plan Free y Pro, si alcanzas tu límite mensual, M.I.A se pausará hasta el siguiente ciclo de facturación. Siempre puedes hacer upgrade instantáneo si necesitas más inteligencia.",
    },
    {
        q: "¿Cuáles son los métodos de pago aceptados?",
        a: "Procesamos pagos de forma segura a través de Mercado Pago (tarjetas argentinas, saldo en cuenta, cuotas) y procesadores internacionales. También aceptamos Crypto (Binance Pay) bajo solicitud.",
    },
    {
        q: "¿Ofrecen reembolsos?",
        a: "El plan Pro incluye una garantía de devolución de 7 días. Si no estás convencido de que M.I.A mejora tus finanzas drásticamente, te devolvemos tu dinero sin preguntas.",
    },
];

export default function PricingClient() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const router = useRouter();

    const handleCheckout = async (planId: string) => {
        if (planId === "Free") {
            router.push("/register");
            return;
        }

        try {
            setLoadingPlan(planId);
            const response = await fetch('/api/mercadopago/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: planId.toLowerCase(),
                    billingCycle
                })
            });

            if (!response.ok) {
                // If user is not logged in / 401, redirect to login with callback
                if (response.status === 401) {
                    router.push(`/login?redirect=/pricing`);
                    return;
                }
                throw new Error("Error creating preference");
            }

            const data = await response.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error("Checkout overflow:", error);
            alert("Hubo un problema iniciando el pago. Intenta nuevamente.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="relative pt-32 pb-24 overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white/80 font-medium">Inversión en tu futuro</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        Planes diseñados para tu{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
                            crecimiento
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-white/60"
                    >
                        Desde control básico hasta arquitectura financiera empresarial. M.I.A escala con vos.
                    </motion.p>
                </div>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center mb-16"
                >
                    <div className="bg-white/5 border border-white/10 p-1 rounded-full flex items-center relative">
                        <div
                            className={cn(
                                "absolute inset-y-1 rounded-full bg-white/10 transition-all duration-300 ease-spring",
                                billingCycle === "monthly" ? "left-1 right-1/2" : "left-1/2 right-1"
                            )}
                        />
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10 w-32",
                                billingCycle === "monthly" ? "text-white" : "text-white/50 hover:text-white/80"
                            )}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={cn(
                                "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10 w-32 flex items-center justify-center gap-2",
                                billingCycle === "yearly" ? "text-white" : "text-white/50 hover:text-white/80"
                            )}
                        >
                            Anual
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                -20%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {PRICING_PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                            className={cn(
                                "relative rounded-3xl p-8 bg-white/5 backdrop-blur-sm border transition-all duration-300 flex flex-col",
                                plan.border
                            )}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={cn("text-2xl font-bold mb-2", plan.color)}>{plan.name}</h3>
                                <p className="text-sm text-white/60 h-10">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold tracking-tight">
                                        ${plan.price[billingCycle]}
                                    </span>
                                    {plan.price[billingCycle] > 0 && (
                                        <span className="text-white/50">/mes</span>
                                    )}
                                </div>
                                {billingCycle === "yearly" && plan.price.yearly > 0 && (
                                    <p className="text-sm text-emerald-400 mt-2">
                                        Facturado ${plan.price.yearly * 12} anualmente
                                    </p>
                                )}
                            </div>

                            <div className="mb-10 block">
                                <button
                                    onClick={() => handleCheckout(plan.name)}
                                    disabled={loadingPlan === plan.name}
                                    className={cn(
                                        "w-full py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2",
                                        plan.button
                                    )}>
                                    {loadingPlan === plan.name ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {plan.ctaText}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex-1 space-y-6">
                                {/* MIA Spec */}
                                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-1.5 rounded-md bg-white/10">
                                            <Brain className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-white/90">Poder de M.I.A</span>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        {plan.miaLimits}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-full p-0.5 bg-emerald-500/20 text-emerald-400 shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm text-white/80">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.notIncluded.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3 opacity-40">
                                            <div className="mt-0.5 rounded-full p-0.5 bg-white/10 text-white/40 shrink-0">
                                                <Shield className="w-3 h-3 line-through" />
                                            </div>
                                            <span className="text-sm text-white/50 line-through">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto mt-32"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
                        <p className="text-white/60">Todo lo que necesitás saber sobre la suscripción.</p>
                    </div>

                    <div className="space-y-6">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h4 className="text-lg font-semibold text-white/90 mb-3 flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    {faq.q}
                                </h4>
                                <p className="text-white/60 leading-relaxed pl-8">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 relative rounded-3xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-20" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    <div className="relative p-12 md:p-20 text-center border border-white/10 rounded-3xl bg-white/5">
                        <h2 className="text-4xl font-bold mb-6">Tu ADN Financiero te espera.</h2>
                        <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                            Únete hoy a FINMOM y descubre lo que sucede cuando combinas disciplina financiera con Inteligencia Artificial de vanguardia.
                        </p>
                        <Link href="/register">
                            <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                Crear cuenta gratuita
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
