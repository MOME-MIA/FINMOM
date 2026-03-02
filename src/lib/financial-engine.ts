import { Transaction, FinancialConfig, MonthlyFinancials } from "@/types/financial";

export const DEFAULT_CONFIG: FinancialConfig = {
    savingsPercentage: 0.20, // 20% default
    investmentPercentage: 0.10, // 10% default
    foodAllocationPercentage: 0.75, // 75% of free cash
    extrasAllocationPercentage: 0.25 // 25% of free cash
};

export function calculateMonthlyFinancials(
    month: string, // YYYY-MM
    transactions: Transaction[],
    config: FinancialConfig = DEFAULT_CONFIG
): MonthlyFinancials {
    // Filter transactions for the selected month
    const monthlyTransactions = transactions.filter(t => t.date.startsWith(month));

    // Calculate Total Income
    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate Fixed Expenses
    // Assuming 'fixed' category or explicit flag. For now, let's assume all expenses NOT marked as 'variable' are fixed?
    // Or better, let's filter by category if we have a strict schema.
    // Based on user prompt: "Gastos Fijos = 1039 (Dato de gastos por categoria...)"
    // We will assume expenses have a category that can be mapped to 'Fixed'.
    // For this implementation, let's assume we filter by a list of fixed categories or a property.
    // Let's assume for now that ALL expenses are "Fixed" unless specified otherwise, to match the simple formula structure,
    // OR we need a way to distinguish. Let's assume 'Fixed Expenses' comes from the 'expense' type transactions that are recurring or categorized as such.
    // To keep it simple and aligned with the prompt's "Gastos Fijos" variable:
    const fixedExpenses = monthlyTransactions
        .filter(t => t.type === 'expense' && t.category !== 'Variable' && t.category !== 'Extra')
        .reduce((sum, t) => sum + t.amount, 0);

    // Core Logic from Prompt:
    // Ahorros = (Ingresos Totales - Gastos Fijos) * X%
    const baseForSavings = Math.max(0, totalIncome - fixedExpenses);
    const savings = baseForSavings * config.savingsPercentage;

    // Inversiones = (Ingresos Totales - Gastos Fijos - Ahorros) * X%
    const baseForInvestments = Math.max(0, totalIncome - fixedExpenses - savings);
    const investments = baseForInvestments * config.investmentPercentage;

    // Libre para Gastos Extras = Ingresos Totales - Gastos Fijos - Ahorros - Inversiones
    const freeForExtras = Math.max(0, totalIncome - fixedExpenses - savings - investments);

    // Alimentación = Libre para Gastos Extras * 75%
    const foodBudget = freeForExtras * config.foodAllocationPercentage;

    // Gastos Extras = Libre para Gastos Extras * 25%
    const extrasBudget = freeForExtras * config.extrasAllocationPercentage;

    return {
        month,
        totalIncome,
        fixedExpenses,
        savings,
        investments,
        freeForExtras,
        foodBudget,
        extrasBudget
    };
}
