import EpicLandingPage from "@/components/landing/EpicLandingPage";

export const metadata = {
    title: "Momentum Finance | M.I.A. — Tu Bóveda Financiera Inteligente",
    description: "La plataforma financiera definitiva con estética Pro Max. Gestiona bóvedas multi-divisa, visualiza tu ADN financiero y deja que M.I.A., tu IA personal, optimice tus ingresos y gastos en tiempo real.",
    keywords: "finanzas personales, inteligencia artificial, M.I.A, presupuesto, ahorro, bóvedas, finanzas, app web",
    openGraph: {
        title: "Momentum Finance | Descubre a M.I.A.",
        description: "Controla tu dinero con la inteligencia artificial financiera más avanzada y estética del mercado.",
        type: "website",
    }
};

export default function LandingPage() {
    return <EpicLandingPage />;
}
