import { TransactionManager } from "@/components/transactions/TransactionManager";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Transacciones',
    description: 'Gestioná todos tus ingresos y gastos en detalle.',
};


import { getTransactionsAction } from "@/app/actions";

export default async function TransactionsPage(props: { searchParams: Promise<{ month?: string }> }) {
    const searchParams = await props.searchParams;
    const month = searchParams.month || new Date().toISOString().slice(0, 7);
    const transactions = await getTransactionsAction(month);

    return (
        <PageTransition>
            <PageLayout
                title="Transacciones"
                subtitle="Gestioná todos tus ingresos y gastos en detalle."
            >
                <TransactionManager transactions={transactions} month={month} />
            </PageLayout>
        </PageTransition>
    );
}
