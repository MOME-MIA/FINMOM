import { getDashboardKPIsAction, getBudgetsAction, getDolarBlueAction, getTransactionsAction, getSmartInsightsAction, getAccountsAction } from "@/app/actions";
import { processRecurringTransactions } from "@/lib/recurringEngine";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Resumen general de salud financiera y métricas clave.',
};

export default async function Dashboard(props: { searchParams: Promise<{ month?: string }> }) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);
  // 1. Run the Motor to process any pending subscriptions/recurring expenses
  // This executes silently on the server before fetching the updated data
  try {
    await processRecurringTransactions();
  } catch (e) {
    console.error("Motor Recurrente falló silenciosamente:", e);
  }

  // 2. Fetch the updated state
  const [kpis, budgets, dolarBlue, transactions, accounts] = await Promise.all([
    getDashboardKPIsAction(currentMonth),
    getBudgetsAction(),
    getDolarBlueAction(),
    getTransactionsAction(currentMonth),
    getAccountsAction()
  ]);

  if (!kpis) return null;

  // Render M.I.A. Insights based on exactly the Data the user is seeing.
  const smartInsight = await getSmartInsightsAction(kpis, transactions || [], currentMonth);

  return (
    <DashboardClient
      initialKPIs={kpis}
      initialBudgets={budgets}
      initialDolarBlue={dolarBlue}
      initialTransactions={transactions}
      initialAccounts={accounts}
      initialSmartInsight={smartInsight}
      month={currentMonth}
    />
  );
}
