import Link from "next/link";
import { Wallet, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/[0.04] pt-20 pb-12 md:pt-32 md:pb-16 px-6 md:px-12 relative z-10 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">

                {/* Top Section: Navigation & Brand */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img src="/logo.png" alt="Finmom Logo" className="w-full h-full object-contain filter invert opacity-90 pointer-events-none select-none" />
                            </div>
                            <span className="font-bold text-[18px] tracking-tight text-[#E0E0E0]">Finmom</span>
                        </Link>
                        <p className="text-[14px] text-white/50 leading-relaxed font-medium tracking-wide">
                            Sistema operativo financiero de nivel institucional con inteligencia artificial autónoma. Asimetría a tu favor.
                        </p>

                        {/* Trust Badges */}
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 tracking-wider uppercase">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#30D158]/70" />
                                <span>Zero-Knowledge Privacy</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 tracking-wider uppercase">
                                <Lock className="w-3.5 h-3.5 text-[#0A84FF]/70" />
                                <span>256-Bit AES E2EE</span>
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Producto</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Planes & Precios", href: "/pricing" },
                                { label: "Funcionalidades", href: "/features" },
                                { label: "Seguridad y Criptografía", href: "/security" },
                                { label: "M.I.A. Intelligence", href: "/mia" },
                                { label: "Changelog", href: "/changelog" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-[14px] text-white/50 hover:text-[#E0E0E0] transition-colors duration-200 font-medium tracking-wide block h-[24px] flex items-center">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Compañía</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Sobre Nosotros", href: "/about" },
                                { label: "Contacto Directo", href: "/contact" },
                                { label: "Carreras & Talento", href: "/careers" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-[14px] text-white/50 hover:text-[#E0E0E0] transition-colors duration-200 font-medium tracking-wide block h-[24px] flex items-center">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-5">Legal & Compliance</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Política de Privacidad", href: "/privacy" },
                                { label: "Términos de Servicio", href: "/terms" },
                                { label: "Licencias Open Source", href: "/licenses" },
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-[14px] text-white/50 hover:text-[#E0E0E0] transition-colors duration-200 font-medium tracking-wide block h-[24px] flex items-center">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-white/[0.04]" />

                {/* Bottom Section: Copyright & Portals */}
                <nav className="flex flex-col-reverse md:flex-row justify-between items-center gap-6" aria-label="Footer Navigation">
                    <p className="text-[13px] text-white/40 font-medium tracking-wide">
                        © {new Date().getFullYear()} Finmom. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-[13px] text-white/50 hover:text-[#E0E0E0] transition-colors duration-200 font-bold tracking-wide">
                            Iniciar Sesión
                        </Link>
                        <Link href="/register">
                            <button className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-transparent text-[13px] px-5 py-2 rounded-full font-bold transition-all duration-300 active:scale-95">
                                Crear Cuenta
                            </button>
                        </Link>
                    </div>
                </nav>

            </div>
        </footer>
    );
}
