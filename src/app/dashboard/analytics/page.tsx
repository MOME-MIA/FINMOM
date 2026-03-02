import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Analítica',
    description: 'Gráficos, tendencias y análisis detallado de tu salud financiera.',
};
export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-transparent text-white w-full">
            <main className="w-full">
                <AnalyticsDashboard />
            </main>
        </div>
    );
}
