"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";

const LICENSES = [
    {
        name: "Next.js",
        version: "16.x",
        license: "MIT License",
        url: "https://github.com/vercel/next.js",
        desc: "Framework de React para producción — routing, SSR, optimización automática.",
    },
    {
        name: "React",
        version: "19.x",
        license: "MIT License",
        url: "https://github.com/facebook/react",
        desc: "Biblioteca de UI para interfaces de usuario reactivas.",
    },
    {
        name: "Framer Motion",
        version: "12.x",
        license: "MIT License",
        url: "https://github.com/framer/motion",
        desc: "Biblioteca de animaciones declarativas para React.",
    },
    {
        name: "Tailwind CSS",
        version: "4.x",
        license: "MIT License",
        url: "https://github.com/tailwindlabs/tailwindcss",
        desc: "Framework de CSS utility-first para diseño rápido y consistente.",
    },
    {
        name: "Lucide Icons",
        version: "latest",
        license: "ISC License",
        url: "https://github.com/lucide-icons/lucide",
        desc: "Conjunto de iconos SVG open-source, limpios y consistentes.",
    },
    {
        name: "Google Generative AI",
        version: "Gemini 1.5",
        license: "Google API Terms",
        url: "https://ai.google.dev",
        desc: "Modelo de lenguaje para inteligencia artificial de M.I.A.",
    },
    {
        name: "Supabase",
        version: "2.x",
        license: "Apache 2.0",
        url: "https://github.com/supabase/supabase",
        desc: "Backend-as-a-Service para autenticación, base de datos y almacenamiento.",
    },
    {
        name: "Recharts",
        version: "2.x",
        license: "MIT License",
        url: "https://github.com/recharts/recharts",
        desc: "Biblioteca de gráficos y visualización de datos para React.",
    },
];

export default function LicensesPage() {
    return (
        <SubPageLayout
            title="Licencias"
            subtitle="Momentum se construye sobre los hombros de gigantes. Estas son las tecnologías open-source que hacen posible nuestra plataforma."
            badge="Legal"
        >
            <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                    {LICENSES.map((lib, i) => (
                        <div key={i} className="p-6 rounded-[20px] bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-white/90">{lib.name}</h3>
                                    <span className="text-[11px] text-white/50 font-medium">{lib.version}</span>
                                </div>
                                <span className="text-[11px] font-bold text-[#0A84FF]/60 uppercase tracking-widest">{lib.license}</span>
                            </div>
                            <p className="text-[14px] text-white/35 font-medium mb-2">{lib.desc}</p>
                            <a href={lib.url} target="_blank" rel="noopener noreferrer"
                                className="text-[12px] text-white/50 hover:text-white/50 transition-colors font-medium underline underline-offset-2">
                                {lib.url}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 rounded-[20px] bg-white/[0.015] border border-white/[0.04] text-center">
                    <p className="text-[14px] text-white/50 font-medium leading-relaxed">
                        Momentum Finance respeta y agradece profundamente a la comunidad open-source.
                        Si encontrás algún problema de licenciamiento, contactanos en <strong className="text-white/50">legal@momentum.finance</strong>.
                    </p>
                </div>
            </div>
        </SubPageLayout>
    );
}
