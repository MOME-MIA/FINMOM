import { AuditClient } from "./AuditClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Auditoría',
    description: 'Auditoría financiera completa con análisis de integridad de datos.',
};


export default function AuditPage() {
    return <AuditClient />;
}
