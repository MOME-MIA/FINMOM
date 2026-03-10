import { getTransactionsAction } from "@/app/actions";
import { HistoryClient } from "@/components/history/HistoryClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Historial',
    description: 'Registro completo de todas tus transacciones financieras.',
};

export default async function HistoryPage() {
    // Fetch all transactions (no month filter) to show the full history
    const records = await getTransactionsAction();

    return <HistoryClient initialRecords={records || []} />;
}
