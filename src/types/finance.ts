// ============================================================
// Momentum Finance — Star Schema TypeScript Types
// Maps 1:1 to InsForge dimensional model
// ============================================================

/** Currency codes supported by the vault system */
export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BTC' | 'USDT' | 'ETH' | (string & {});

/** Transaction direction */
export type TxType = 'expense' | 'income';

/** Category taxonomy type */
export type CategoryType = 'expense' | 'income' | 'transfer' | 'investment';

// ============================================================
// DIMENSION TYPES
// ============================================================

/** dim_categories — Normalized category taxonomy */
export interface DimCategory {
    id: string;
    name: string;
    type: CategoryType;
    parentId: string | null;
    icon: string | null;
    color: string | null;
    sortOrder: number;
}

/** dim_accounts — Currency-isolated vaults */
export interface DimAccount {
    id: string;
    name: string;
    provider: string;
    currencyCode: CurrencyCode;
    initialBalance: number;
    currentBalance: number;
    color: string;
    isActive: boolean;
}

// ============================================================
// FACT TYPES
// ============================================================

/** fact_transactions — All income/expense movements */
export interface Transaction {
    id: string;
    date: string; // YYYY-MM-DD
    type: TxType;
    amount: number;
    currencyCode: CurrencyCode;
    categoryId: string | null;
    accountId: string | null;
    description: string;
    paymentMethod: string;
    fxRate: number | null;
    fxSource: string | null;
    fxTimestamp: string | null;
    createdAt: string;
    // Joined fields (from dim tables)
    categoryName?: string;
    categoryIcon?: string;
    categoryColor?: string;
    accountName?: string;
}

/** fact_transfers — P2P inter-vault movements */
export interface Transfer {
    id: string;
    date: string; // YYYY-MM-DD
    sourceAccountId: string;
    amountSent: number;
    destAccountId: string;
    amountReceived: number;
    fxRateApplied: number; // GENERATED: received / sent
    description: string;
    createdAt: string;
    // Joined fields
    sourceAccountName?: string;
    sourceAccountCurrency?: CurrencyCode;
    destAccountName?: string;
    destAccountCurrency?: CurrencyCode;
}

/** fact_budgets — Per-category spending limits */
export interface Budget {
    id: string;
    categoryId: string;
    budgetLimit: number;
    period: 'weekly' | 'monthly' | 'yearly';
    currencyCode: CurrencyCode;
    // Joined
    categoryName?: string;
    categoryIcon?: string;
    spent?: number; // computed at query time
}

/** fact_recurring — Recurring transaction templates */
export interface RecurringTransaction {
    id: string;
    description: string;
    amount: number;
    currencyCode: CurrencyCode;
    categoryId: string | null;
    accountId: string | null;
    type: TxType;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    nextDueDate: string;
    active: boolean;
    lastGenerated: string | null;
    // Joined
    categoryName?: string;
    accountName?: string;
}

// ============================================================
// AGGREGATION / VIEW TYPES
// ============================================================

/** Dashboard KPIs — computed from fact_transactions */
export interface DashboardKPIs {
    totalIncome: number;
    totalExpenses: number;
    fixedExpenses: number;
    variableExpenses: number;
    savings: number;
    investments: number;
    netBalance: number;
    savingsRate: number; // percentage
    budgetUtilization?: number;
    txCount: number;
}

/** Summary for charts */
export interface SummaryData {
    totalIncome: number;
    fixedExpenses: number;
    freeForExtras: number;
    savings: number;
    investments: number;
    marginPercent: number;
    savingsPercent: number;
}

/** Category spending breakdown */
export interface CategorySpending {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    amount: number;
    percentage: number;
}

/** Monthly trend data */
export interface MonthlyTrend {
    month: string;
    income: number;
    expenses: number;
    savings: number;
}

/** Portfolio vault balance for global valuation */
export interface VaultBalance {
    accountId: string;
    accountName: string;
    provider: string;
    currencyCode: CurrencyCode;
    balance: number;
    /** Equivalent value in user's display currency */
    displayValue: number;
}

/** Crypto holding with market data */
export interface CryptoHolding {
    symbol: string;
    amount: number;
    value: number;
    change24h: number;
    costBasis?: number;
}

// ============================================================
// LEGACY COMPAT — Remove after full migration
// ============================================================

/** @deprecated Use Transaction instead */
export type TransactionType = 'Ingreso' | 'Gasto Fijo' | 'Gasto Semanal' | 'Ahorro' | 'Inversión' | 'Transferencia';

/** @deprecated Use Transaction instead */
export interface MonthlyRecord {
    id: string;
    date: string;
    type: TransactionType;
    amountARS: number;
    amountUSD: number;
    category: string;
    description?: string;
    paymentMethod?: string;
    accountId?: string;
    recurringId?: string;
    fxRate?: number;
    fxSource?: string;
    fxTimestamp?: string;
}

/** monthly_snapshots (renamed from monthly_records) */
export interface MonthlySnapshot {
    month: string;
    ingresosTotales: number;
    ahorros: number;
    inversiones: number;
    fixedExpenses: Record<string, { amount: number; paid: boolean }>;
}

/** @deprecated Use CategorySpending */
export interface DetailedExpenseRecord {
    date: string;
    alquiler: number;
    luz: number;
    wifi: number;
    segAuto: number;
    jardin: number;
    celu: number;
    entretenimiento: number;
    mecanico: number;
    extras: number;
    estudio: number;
    contador: number;
    expensasCasa: number;
    totalARS: number;
    totalUSD: number;
    status?: Record<string, boolean>;
}

/** @deprecated */
export interface IncomeRecord {
    date: string;
    gastosTotalesARS: number;
    gastosUSD: number;
    usdRef: number;
    restanteUSD: number;
    restanteARS: number;
    cobroMensual: number;
    ahorro: number;
    ahorroPercent: number;
    margenPercent: number;
}

/** @deprecated */
export interface DebtItem {
    usd: number;
    ars: number;
    name: string;
    isPaid?: boolean;
    originalRow?: number;
}

/** @deprecated */
export interface WeeklyControlData {
    month: string;
    income: number;
    gastosFijos: {
        fechaRetiro: string;
        restante: number;
        valorUSDRef: number;
        cambioARS: number;
    };
    weeks: {
        id?: string;
        weekNumber: number;
        fechaRetiro: string;
        restante: number;
        assigned: number;
        valorUSDRef: number;
        cambioARS: number;
        isPaid: boolean;
        description: string;
    }[];
}

/** @deprecated */
export interface Account {
    id: string;
    name: string;
    type: 'Bank' | 'Cash' | 'Wallet' | 'Crypto';
    currency: 'USD' | 'ARS';
    initialBalance: number;
    currentBalance: number;
    color: string;
}

/** @deprecated */
export interface FixedExpense {
    id: string;
    name: string;
    amount: number;
    isPaid: boolean;
}

/** @deprecated */
export interface WeeklyExpense {
    id: string;
    weekName: string;
    assignedAmount: number;
    remainingAmount: number;
    isCompleted: boolean;
}

/** @deprecated */
export interface ExpenseControl {
    totalWithdrawal: number;
    fixedExpenses: FixedExpense[];
    weeklyExpenses: WeeklyExpense[];
}
