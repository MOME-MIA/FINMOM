import EpicLandingPage from "@/components/landing/EpicLandingPage";

export const metadata = {
    title: "Momentum Finance | M.I.A. — El ADN de tu patrimonio, evolucionado",
    description: "La plataforma financiera definitiva de clase ejecutiva. Gestiona bóvedas multi-divisa, visualiza tu ADN financiero y deja que M.I.A., tu consciencia inteligente, optimice tu patrimonio en tiempo real con seguridad corporativa AES-256.",
    keywords: [
        "inteligencia artificial financiera",
        "finanzas empresariales",
        "gestión patrimonial top tier",
        "bóvedas multi-divisa",
        "Momentum OS",
        "M.I.A asistentente",
        "optimización de ingresos"
    ],
    authors: [{ name: "Momentum Technologies" }],
    robots: "index, follow",
    openGraph: {
        title: "Momentum Finance | Descubre a M.I.A.",
        description: "Controla tu dinero con la inteligencia artificial financiera más avanzada y estética del mercado. Seguridad de grado bancario.",
        type: "website",
        images: ["/og-image.jpg"] // Placeholder for future OG image
    },
    twitter: {
        card: "summary_large_image",
        title: "Momentum Finance OS",
        description: "Inteligencia Financiera Autónoma."
    }
};

export default function LandingPage() {
    return <EpicLandingPage />;
}
