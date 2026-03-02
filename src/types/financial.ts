export type TransactionType = 'income' | 'expense';
export type ExpenseCategory = 'fixed' | 'variable' | 'savings' | 'investment';

export interface Transaction {
    id: string;
    date: string; // ISO Date string YYYY-MM-DD
    amount: number;
    description: string;
    category: string;
    type: TransactionType;
    isRecurring?: boolean;
}

export interface FinancialConfig {
    savingsPercentage: number; // e.g., 0.20 for 20%
    investmentPercentage: number; // e.g., 0.10 for 10%
    foodAllocationPercentage: number; // Default 0.75
    extrasAllocationPercentage: number; // Default 0.25
}

export interface MonthlyFinancials {
    month: string; // YYYY-MM
    totalIncome: number;
    fixedExpenses: number;
    savings: number;
    investments: number;
    freeForExtras: number;
    foodBudget: number;
    extrasBudget: number;
}
