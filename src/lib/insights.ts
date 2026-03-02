import { DashboardKPIs, Budget } from "@/types/finance";

export interface Insight {
    type: 'success' | 'warning' | 'danger' | 'info';
    message: string;
    priority: number; // Higher is more important
}

export function generateInsights(kpis: DashboardKPIs, budgets: Budget[]): Insight[] {
    const insights: Insight[] = [];

    const income = kpis.totalIncome;
    const fixed = kpis.fixedExpenses;
    const savingsVal = kpis.savings;
    const investmentsVal = kpis.investments;
    const totalSavings = savingsVal + investmentsVal;
    const variable = kpis.variableExpenses;

    // 1. Savings Analysis
    if (income > 0) {
        const savingsRate = (totalSavings / income) * 100;
        if (savingsRate >= 20) {
            insights.push({
                type: 'success',
                message: `¡Excelente! Estás ahorrando el ${Math.round(savingsRate)}% de tus ingresos.`,
                priority: 10
            });
        } else if (savingsRate < 10) {
            insights.push({
                type: 'warning',
                message: `Tu tasa de ahorro es baja (${Math.round(savingsRate)}%). Intenta reducir gastos hormiga.`,
                priority: 8
            });
        }
    }

    // 2. Fixed Expenses Analysis
    if (income > 0) {
        const fixedRate = (fixed / income) * 100;
        if (fixedRate > 60) {
            insights.push({
                type: 'danger',
                message: `Tus gastos fijos consumen el ${Math.round(fixedRate)}% de tus ingresos. ¡Cuidado!`,
                priority: 9
            });
        }
    }

    // 3. Budget Analysis
    const overBudget = budgets.filter(b => (b.spent || 0) > b.budgetLimit);
    if (overBudget.length > 0) {
        const categories = overBudget.map(b => b.categoryName || 'Sin categoría').join(", ");
        insights.push({
            type: 'warning',
            message: `Te excediste en: ${categories}.`,
            priority: 7
        });
    }

    // 4. Variable Expenses vs Income
    if (income > 0 && kpis.totalExpenses > income) {
        insights.push({
            type: 'danger',
            message: `Gastaste $${(kpis.totalExpenses - income).toLocaleString()} más de lo que ingresaste.`,
            priority: 10
        });
    } else if (income > 0 && variable < income * 0.3) {
        insights.push({
            type: 'success',
            message: "Vienes muy bien con tus gastos variables. ¡Sigue así!",
            priority: 5
        });
    }

    // Sort by priority
    return insights.sort((a, b) => b.priority - a.priority);
}
