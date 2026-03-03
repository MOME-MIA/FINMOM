import type { Metadata } from "next";

const METADATA_MAP: Record<string, { title: string; description: string }> = {
    "/features": {
        title: "Funcionalidades | Finmom",
        description: "Ingeniería financiera pura: ADN Financiero, Multi-Moneda, Presupuestos Inteligentes, Analítica Profunda y más. Herramientas diseñadas sin compromiso.",
    },
    "/security": {
        title: "Seguridad | Finmom",
        description: "Encriptación AES-256, Zero-Knowledge Privacy, Row-Level Security y auditoría en tiempo real. Tu dinero protegido por arquitectura, no por promesas.",
    },
    "/mia": {
        title: "M.I.A. — Finmom Intelligence Agent",
        description: "Conoce a M.I.A., tu consciencia financiera autónoma impulsada por IA. Analiza, predice, protege y optimiza tus finanzas de forma proactiva.",
    },
    "/about": {
        title: "Sobre Nosotros | Finmom",
        description: "Construimos el sistema operativo financiero del futuro. Privacidad, diseño e ingeniería como principios fundacionales.",
    },
    "/contact": {
        title: "Contacto | Finmom",
        description: "¿Preguntas, alianzas o press? Contacta al equipo de Finmom. Respuesta en menos de 24 horas.",
    },
    "/careers": {
        title: "Carreras | Finmom",
        description: "Únete al equipo que está redefiniendo las finanzas personales. Posiciones abiertas en ingeniería, diseño y producto.",
    },
    "/changelog": {
        title: "Changelog | Finmom",
        description: "Historial de versiones y notas de lanzamiento. Cada mejora, corrección y nueva funcionalidad documentada.",
    },
    "/privacy": {
        title: "Política de Privacidad | Finmom",
        description: "Cómo recopilamos, protegemos y usamos tus datos. Transparencia total sobre tu información financiera.",
    },
    "/terms": {
        title: "Términos de Servicio | Finmom",
        description: "Términos y condiciones de uso de la plataforma Finmom. Acuerdos, responsabilidades y derechos.",
    },
    "/licenses": {
        title: "Licencias Open Source | Finmom",
        description: "Dependencias y licencias open source que hacen posible Finmom. Transparencia en nuestro stack.",
    },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<Record<string, string>>;
}): Promise<Metadata> {
    return {
        title: "Finmom — Sistema Operativo Financiero",
        description: "El sistema operativo financiero inteligente con M.I.A. Gestiona tus finanzas con precisión quirúrgica, impulsado por inteligencia artificial.",
        openGraph: {
            type: "website",
            siteName: "Finmom",
        },
    };
}

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
