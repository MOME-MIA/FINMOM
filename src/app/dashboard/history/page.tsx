import { getDetailedExpensesAction } from "@/app/actions";
import { HistoryClient } from "@/components/history/HistoryClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Historial',
    description: 'Registro completo de todas tus transacciones financieras.',
};


export default async function HistoryPage() {
    const records = await getDetailedExpensesAction();
    let initialYear = new Date().getFullYear().toString();

    return <HistoryClient initialRecords={records || []} initialYear={initialYear} />;
}
