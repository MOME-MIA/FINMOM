"use client";

import { Suspense } from "react";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCurrency } from "@/context/CurrencyContext";

export function SettingsClient() {
    const { display, setCurrency, rate, lastUpdated } = useCurrency();

    return (
        <PageTransition>
            <PageLayout title="Ajustes" subtitle="Configuración de tu cuenta, preferencias y auditoría.">
                <div className="space-y-4">
                    {/* Profile & Password Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="glass-panel p-4 space-y-4">
                            <h3 className="text-[13px] font-semibold text-white/50">Perfil</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center text-xl font-semibold text-white/50 cursor-pointer hover:bg-white/[0.08] transition-colors border-2 border-dashed border-white/[0.08]">
                                    US
                                </div>
                                <div>
                                    <p className="text-[15px] font-semibold text-white">Usuario Pro</p>
                                    <p className="text-[12px] text-white/50">Toca el avatar para cambiar la foto</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-4 space-y-3">
                            <h3 className="text-[13px] font-semibold text-white/50">Seguridad</h3>
                            <p className="text-[12px] text-white/50">Cambiá el código de acceso a tu aplicación.</p>
                            <button className="bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white text-[13px] font-medium px-4 py-2 rounded-xl transition-colors">
                                Cambiar Contraseña
                            </button>
                        </div>
                    </div>

                    {/* Currency & Data Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="glass-panel p-4 space-y-3">
                            <h3 className="text-[13px] font-semibold text-white/50">Moneda Base</h3>
                            <p className="text-[12px] text-white/50">Toda la app reacciona en tiempo real al cambiar.</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrency('ARS')}
                                    className={`text-[13px] font-semibold px-4 py-2 rounded-xl transition-all ${display === 'ARS'
                                        ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                                        : 'bg-white/[0.04] text-white/50 border border-white/[0.04] hover:bg-white/[0.06]'
                                        }`}
                                >
                                    🇦🇷 ARS
                                </button>
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`text-[13px] font-semibold px-4 py-2 rounded-xl transition-all ${display === 'USD'
                                        ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                                        : 'bg-white/[0.04] text-white/50 border border-white/[0.04] hover:bg-white/[0.06]'
                                        }`}
                                >
                                    🇺🇸 USD
                                </button>
                            </div>
                            {rate > 0 && (
                                <p className="text-[11px] text-white/50 tabular-nums">
                                    Dólar Blue: ${rate.toLocaleString()} ARS
                                    {lastUpdated && ` • ${new Date(lastUpdated).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`}
                                </p>
                            )}
                        </div>

                        <div className="glass-panel p-4 space-y-3">
                            <h3 className="text-[13px] font-semibold text-white/50">Datos</h3>
                            <p className="text-[12px] text-white/50">Exportá o auditá los datos de tu cuenta.</p>
                            <div className="flex gap-2">
                                <a href="/api/export" className="inline-block bg-white/[0.04] text-white/60 text-[13px] font-medium px-4 py-2 rounded-xl border border-white/[0.04] hover:bg-white/[0.06] transition-colors">
                                    Exportar CSV
                                </a>
                                <a href="/dashboard/audit" className="inline-block bg-white/[0.04] text-white/60 text-[13px] font-medium px-4 py-2 rounded-xl border border-white/[0.04] hover:bg-white/[0.06] transition-colors">
                                    Auditoría
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </PageLayout>
        </PageTransition>
    );
}
