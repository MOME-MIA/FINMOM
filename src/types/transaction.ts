export type TransactionType = 'income' | 'expense';
export type ExpenseNature = 'fixed' | 'variable';
export type CurrencyType = 'ARS' | 'USD';

export interface Transaction {
    id?: string;                        // Optional on creation, assigned by DB
    userId: string;
    type: TransactionType;

    // Monetary Data
    amount: number;                     // Exact amount entered
    currency: CurrencyType;             // Input currency
    exchangeRate: number;               // USD/ARS exchange rate at creation
    amountArs: number;                  // Normalized amount in ARS
    amountUsd: number;                  // Normalized amount in USD

    // Metadata
    date: Date | string;                  // Selected date
    accountId: string;                  // Source/Destination account

    // Conditional fields (Income)
    source?: string;                    // e.g. "Salary", "Freelance"
    description?: string;               // Context for income

    // Conditional fields (Expense)
    expenseNature?: ExpenseNature;      // Fixed/Recurring vs Variable/Extra
    categoryId?: string;                // Category ID
    note?: string;                      // Optional context

    createdAt?: Date | string;            // Audit field
}
