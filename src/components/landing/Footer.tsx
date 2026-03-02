"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/[0.04] py-16 px-6 bg-black relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <Wallet className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-bold text-[15px]">Momentum</span>
                        </Link>
                        <p className="text-[13px] text-white/50 leading-relaxed font-medium">
                            Sistema operativo financiero con inteligencia artificial autónoma.
                        </p>
                    </div>
                    {/* Product */}
                    <div>
                        <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-4">Producto</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Planes", href: "/pricing" },
                                { label: "Seguridad", href: "/security" },
                                { label: "M.I.A.", href: "/mia" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-[13px] text-white/50 hover:text-white/50 transition-colors font-medium">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Company */}
                    <div>
                        <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-4">Compañía</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Sobre Nosotros", href: "/about" },
                                { label: "Contacto", href: "/contact" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-[13px] text-white/50 hover:text-white/50 transition-colors font-medium">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Legal */}
                    <div>
                        <h4 className="text-[12px] font-bold text-white/50 uppercase tracking-widest mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: "Privacidad", href: "/privacy" },
                                { label: "Términos", href: "/terms" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-[13px] text-white/50 hover:text-white/50 transition-colors font-medium">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[12px] text-white/15 font-medium">© 2026 Momentum Finance. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-[12px] text-white/50 hover:text-white/50 transition-colors font-medium">Iniciar Sesión</Link>
                        <Link href="/register" className="text-[12px] text-white/50 hover:text-white/50 transition-colors font-medium">Crear Cuenta</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
