import { getBudgetsAction, getFullCategoriesAction } from "@/app/actions";
import { BudgetManager } from "@/components/budgets/BudgetManager";
import PageTransition from "@/components/ui/PageTransition";
import { PageLayout } from "@/components/layout/PageLayout";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Presupuestos',
    description: 'Definí y controlá tus límites de gasto por categoría.',
};


export default async function BudgetsPage() {
    const budgets = await getBudgetsAction();
    const categories = await getFullCategoriesAction();

    return (
        <PageTransition>
            <PageLayout
                title="Presupuestos"
                subtitle="Definí y controlá tus límites de gasto por categoría."
            >
                <BudgetManager budgets={budgets} categories={categories} />
            </PageLayout>
        </PageTransition>
    );
}
