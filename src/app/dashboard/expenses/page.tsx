import { getWeeklyControlAction, getMonthlyDetailedExpensesAction, getDashboardKPIsAction, getAnalyticsDataAction } from "@/app/actions";
import { ExpensesClient } from "@/components/expenses/ExpensesClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gastos',
    description: 'Control semanal, gastos detallados y tendencias de consumo.',
};


export default async function ExpensesPage(props: { searchParams: Promise<{ month?: string }> }) {
    const searchParams = await props.searchParams;
    const month = searchParams.month || new Date().toISOString().slice(0, 7);
    const [data, detailedExpenses, dashboardKPIs, analyticsData] = await Promise.all([
        getWeeklyControlAction(month),
        getMonthlyDetailedExpensesAction(month),
        getDashboardKPIsAction(month),
        getAnalyticsDataAction(month)
    ]);

    if (!data) return null;

    return <ExpensesClient
        initialData={data}
        detailedExpenses={detailedExpenses}
        dashboardKPIs={dashboardKPIs}
        trends={analyticsData.trends}
    />;
}
