"use client";

import SubPageLayout from "@/components/landing/SubPageLayout";

const SECTIONS = [
    {
        title: "1. Información que Recopilamos",
        content: [
            "**Datos de cuenta:** Nombre, dirección de correo electrónico y contraseña encriptada al momento del registro.",
            "**Datos financieros:** Transacciones, saldos, presupuestos y categorías que vos ingreses voluntariamente. Estos datos se almacenan encriptados con AES-256.",
            "**Datos de uso:** Información anónima sobre cómo interactuás con la plataforma (páginas visitadas, funciones utilizadas) para mejorar la experiencia.",
            "**Datos de dispositivo:** Tipo de navegador, sistema operativo y dirección IP para seguridad y detección de fraude.",
        ],
    },
    {
        title: "2. Cómo Utilizamos tu Información",
        content: [
            "Proveer, mantener y mejorar los servicios de Momentum Finance.",
            "Alimentar los algoritmos de M.I.A. para generar análisis financieros personalizados. **Tus datos de M.I.A. nunca se comparten con terceros.**",
            "Enviar notificaciones relacionadas con tu actividad financiera (alertas, insights, recordatorios).",
            "Proteger la seguridad de tu cuenta y prevenir accesos no autorizados.",
            "Cumplir con obligaciones legales y regulatorias.",
        ],
    },
    {
        title: "3. Lo que Nunca Haremos",
        content: [
            "**Nunca venderemos tus datos** a terceros, anunciantes o brokers de información.",
            "**Nunca usaremos tus datos financieros** para publicidad dirigida.",
            "**Nunca compartiremos información identificable** sin tu consentimiento explícito.",
            "**Nunca almacenaremos datos** en texto plano — siempre encriptados.",
        ],
    },
    {
        title: "4. Almacenamiento y Seguridad",
        content: [
            "Tus datos se almacenan en servidores seguros con encriptación AES-256 en reposo y TLS 1.3 en tránsito.",
            "Implementamos Row-Level Security (RLS) a nivel de base de datos para garantizar que cada usuario solo acceda a sus propios registros.",
            "Realizamos auditorías de seguridad periódicas y mantenemos un trail de auditoría completo.",
            "En caso de brecha de seguridad, te notificaremos dentro de las 72 horas conforme la regulación vigente.",
        ],
    },
    {
        title: "5. Tus Derechos",
        content: [
            "**Acceso:** Podés solicitar una copia completa de todos tus datos en cualquier momento.",
            "**Rectificación:** Podés corregir información inexacta desde la configuración de tu perfil.",
            "**Eliminación:** Podés solicitar la eliminación permanente de tu cuenta y todos los datos asociados.",
            "**Portabilidad:** Podés exportar tus datos en formatos estándar (CSV, JSON).",
            "**Oposición:** Podés desactivar funciones específicas de M.I.A. en cualquier momento.",
        ],
    },
    {
        title: "6. Cookies y Tecnologías Similares",
        content: [
            "Usamos cookies esenciales para el funcionamiento de la plataforma (autenticación, preferencias).",
            "No usamos cookies de rastreo publicitario ni compartimos datos de cookies con terceros.",
            "Podés gestionar tus preferencias de cookies desde la configuración de tu navegador.",
        ],
    },
    {
        title: "7. Cambios a esta Política",
        content: [
            "Nos reservamos el derecho de actualizar esta política. Te notificaremos sobre cambios significativos por email y dentro de la plataforma con al menos 30 días de anticipación.",
        ],
    },
    {
        title: "8. Contacto",
        content: [
            "Para consultas sobre privacidad: **privacy@momentum.finance**",
            "Para ejercer tus derechos: **derechos@momentum.finance**",
            "Última actualización: Febrero 2026.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <SubPageLayout
            title="Política de Privacidad"
            subtitle="Tu privacidad es sagrada. Leé exactamente cómo protegemos tu información y qué hacemos (y qué no hacemos) con ella."
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
