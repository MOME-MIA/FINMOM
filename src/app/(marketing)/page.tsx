import EpicLandingPage from "@/components/landing/EpicLandingPage";

export const metadata = {
    title: "Finmom | M.I.A. — El ADN de tu patrimonio, evolucionado",
    description: "La plataforma financiera definitiva de clase ejecutiva. Gestiona bóvedas multi-divisa, visualiza tu ADN financiero y deja que M.I.A., tu consciencia inteligente, optimice tu patrimonio en tiempo real con seguridad corporativa AES-256.",
    keywords: [
        "inteligencia artificial financiera",
        "finanzas empresariales",
        "gestión patrimonial top tier",
        "bóvedas multi-divisa",
        "Finmom OS",
        "M.I.A asistentente",
        "optimización de ingresos"
    ],
    authors: [{ name: "Finmom Technologies" }],
    robots: "index, follow",
    openGraph: {
        title: "Finmom | Descubre a M.I.A.",
        description: "Controla tu dinero con la inteligencia artificial financiera más avanzada y estética del mercado. Seguridad de grado bancario.",
        type: "website",
        images: ["/og-image.jpg"] // Placeholder for future OG image
    },
    twitter: {
        card: "summary_large_image",
        title: "Finmom OS",
        description: "Inteligencia Financiera Autónoma."
    }
};

export default function LandingPage() {
    return <EpicLandingPage />;
}
