import type { Metadata } from "next";

const METADATA_MAP: Record<string, { title: string; description: string }> = {
    "/features": {
        title: "Funcionalidades | FINMOM",
        description: "Ingeniería financiera pura: ADN Financiero, Multi-Moneda, Presupuestos Inteligentes, Analítica Profunda y más. Herramientas diseñadas sin compromiso.",
    },
    "/security": {
        title: "Seguridad | FINMOM",
        description: "Encriptación AES-256, Zero-Knowledge Privacy, Row-Level Security y auditoría en tiempo real. Tu dinero protegido por arquitectura, no por promesas.",
    },
    "/mia": {
        title: "M.I.A. — FINMOM Intelligence Agent",
        description: "Conoce a M.I.A., tu consciencia financiera autónoma impulsada por IA. Analiza, predice, protege y optimiza tus finanzas de forma proactiva.",
    },
    "/about": {
        title: "Sobre Nosotros | FINMOM",
        description: "Construimos el sistema operativo financiero del futuro. Privacidad, diseño e ingeniería como principios fundacionales.",
    },
    "/contact": {
        title: "Contacto | FINMOM",
        description: "¿Preguntas, alianzas o press? Contacta al equipo de FINMOM. Respuesta en menos de 24 horas.",
    },
    "/careers": {
        title: "Carreras | FINMOM",
        description: "Únete al equipo que está redefiniendo las finanzas personales. Posiciones abiertas en ingeniería, diseño y producto.",
    },
    "/changelog": {
        title: "Changelog | FINMOM",
        description: "Historial de versiones y notas de lanzamiento. Cada mejora, corrección y nueva funcionalidad documentada.",
    },
    "/privacy": {
        title: "Política de Privacidad | FINMOM",
        description: "Cómo recopilamos, protegemos y usamos tus datos. Transparencia total sobre tu información financiera.",
    },
    "/terms": {
        title: "Términos de Servicio | FINMOM",
        description: "Términos y condiciones de uso de la plataforma FINMOM. Acuerdos, responsabilidades y derechos.",
    },
    "/licenses": {
        title: "Licencias Open Source | FINMOM",
        description: "Dependencias y licencias open source que hacen posible FINMOM. Transparencia en nuestro stack.",
    },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<Record<string, string>>;
}): Promise<Metadata> {
    return {
        title: "FINMOM — Sistema Operativo Financiero",
        description: "El sistema operativo financiero inteligente con M.I.A. Gestiona tus finanzas con precisión quirúrgica, impulsado por inteligencia artificial.",
        openGraph: {
            type: "website",
            siteName: "FINMOM",
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
