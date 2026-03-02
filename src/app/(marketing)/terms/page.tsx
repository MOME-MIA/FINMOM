"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";

const SECTIONS = [
    {
        title: "1. Aceptación de los Términos",
        content: [
            "Al acceder y utilizar Momentum Finance (\"la Plataforma\"), aceptás estos Términos de Servicio en su totalidad.",
            "Si no estás de acuerdo con alguna parte, no deberías utilizar la Plataforma.",
            "Nos reservamos el derecho de modificar estos términos con notificación previa de 30 días.",
        ],
    },
    {
        title: "2. Descripción del Servicio",
        content: [
            "Momentum Finance es una plataforma de gestión financiera personal potenciada por inteligencia artificial (M.I.A.).",
            "El servicio incluye: registro de transacciones, visualización analítica, presupuestos inteligentes, multi-moneda y asistencia de IA.",
            "**Momentum no es un banco, broker ni asesor financiero regulado.** Las recomendaciones de M.I.A. son informativas y no constituyen asesoramiento financiero profesional.",
        ],
    },
    {
        title: "3. Cuentas de Usuario",
        content: [
            "Debés proporcionar información veraz y actualizada al registrarte.",
            "Sos responsable de mantener la confidencialidad de tus credenciales de acceso.",
            "Debés notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.",
            "Nos reservamos el derecho de suspender cuentas que violen estos términos.",
        ],
    },
    {
        title: "4. Uso Aceptable",
        content: [
            "La Plataforma es exclusivamente para uso personal y no comercial.",
            "No debés intentar acceder a datos de otros usuarios ni vulnerar los sistemas de seguridad.",
            "No debés utilizar la Plataforma para actividades ilegales, fraudulentas o de lavado de activos.",
            "No debés realizar ingeniería inversa, descompilar o intentar extraer el código fuente.",
        ],
    },
    {
        title: "5. Inteligencia Artificial (M.I.A.)",
        content: [
            "M.I.A. utiliza modelos de inteligencia artificial para analizar tus datos financieros y generar insights personalizados.",
            "**Las recomendaciones de M.I.A. no garantizan resultados financieros específicos.**",
            "M.I.A. procesa datos exclusivamente dentro de tu sesión y no entrena modelos globales con tu información personal.",
            "Podés desactivar funciones específicas de M.I.A. en cualquier momento desde la configuración.",
        ],
    },
    {
        title: "6. Propiedad Intelectual",
        content: [
            "Todos los derechos de propiedad intelectual sobre la Plataforma, incluyendo código, diseño, marca y algoritmos de M.I.A., pertenecen a Momentum Finance.",
            "Retenés la propiedad sobre tus datos financieros personales.",
            "Nos otorgás una licencia limitada para procesar tus datos con el fin de proveer el servicio.",
        ],
    },
    {
        title: "7. Limitación de Responsabilidad",
        content: [
            "Momentum Finance se proporciona \"tal cual\" y \"según disponibilidad\".",
            "No garantizamos la disponibilidad ininterrumpida del servicio ni la exactitud absoluta de los análisis de M.I.A.",
            "En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso de la Plataforma.",
            "Nuestra responsabilidad total se limita al monto pagado por vos en los últimos 12 meses de suscripción.",
        ],
    },
    {
        title: "8. Resolución de Disputas",
        content: [
            "Estos términos se rigen por las leyes de la República Argentina.",
            "Cualquier disputa será sometida a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.",
            "Para reclamos: **legal@momentum.finance**",
            "Última actualización: Febrero 2026.",
        ],
    },
];

export default function TermsPage() {
    return (
        <SubPageLayout
            title="Términos de Servicio"
            subtitle="Transparencia total. Leé nuestros términos para entender tus derechos y responsabilidades al usar Momentum Finance."
            badge="Legal"
        >
            <div className="max-w-3xl mx-auto space-y-10">
                {SECTIONS.map((section, i) => (
                    <div key={i} className="border-b border-white/[0.04] pb-10 last:border-0">
                        <h2 className="text-xl font-bold text-white/90 mb-4">{section.title}</h2>
                        <ul className="space-y-3">
                            {section.content.map((item, j) => (
                                <li key={j} className="text-[15px] text-white/50 leading-relaxed font-medium pl-4 border-l-2 border-white/[0.06]"
                                    dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/60">$1</strong>') }}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </SubPageLayout>
    );
}
