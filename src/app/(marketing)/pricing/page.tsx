import { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
    title: 'Planes | Momentum Finance',
    description: 'Elegí el plan ideal para tomar el control de tus finanzas. Opciones Free, Pro y Enterprise impulsadas por M.I.A.',
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20">
            <Navbar />
            <main>
                <PricingClient />
            </main>
            <Footer />
        </div>
    );
}
