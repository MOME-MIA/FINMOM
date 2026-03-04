"use server";
import {
    fetchMonthlyRecords,
    fetchSummaryData,
    fetchExpenseControl,
    addTransactionToSheet,
    fetchDetailedExpenses,
    fetchIncomeHistory,
    fetchDashboardKPIs,
    fetchWeeklyControl,
    updateWeeklyExpenseStatus,
    updateDebtStatus,
    updateFixedExpenseStatus,
    fetchCategoryNames,
    createTransfer,
} from '@/lib/db';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import {
    MonthlyRecord,
    SummaryData,
    ExpenseControl,
    DetailedExpenseRecord,
    IncomeRecord,
    DashboardKPIs,
    WeeklyControlData,
    Budget,
    CategorySpending,
    MonthlyTrend,
    CryptoHolding,
    Transaction,
    DimAccount,
    RecurringTransaction
} from '@/types/finance';

// Force real data to true
const useRealData = () => true;

// --- NEW ACTIONS ---

export async function getDetailedExpensesAction(): Promise<DetailedExpenseRecord[] | null> {
    if (!useRealData()) return null;
    try {
        return await fetchDetailedExpenses();
    } catch (error) {
        console.error("Error fetching detailed expenses:", error);
        return null;
    }
}

export async function getMonthlyDetailedExpensesAction(month?: string): Promise<DetailedExpenseRecord | null> {
    if (!useRealData()) return null;
    try {
        const allExpenses = await fetchDetailedExpenses();
        if (!month) {
            // If no month provided, return the last one
            return allExpenses[allExpenses.length - 1] || null;
        }

        // Month format from URL: YYYY-MM (e.g. 2025-10)
        // DetailedExpenseRecord date format: MM/YYYY (e.g. 10/2025) or similar

        // Normalize month to MM/YYYY
        let targetDate = "";
        if (/^\d{4}-\d{2}$/.test(month)) {
            const [y, m] = month.split('-');
            targetDate = `${m}/${y}`;
        } else {
            // Try to parse "Month - Year"
            const monthMap: { [key: string]: string } = {
                'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
                'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
            };
            const parts = month.toLowerCase().split('-');
            if (parts.length >= 2) {
                const mName = parts[0].trim();
                const y = parts[1].trim();
                const mNum = monthMap[mName];
                if (mNum) targetDate = `${mNum}/${y}`;
            }
        }

        return allExpenses.find(e => e.date === targetDate || e.date.includes(targetDate)) || null;
    } catch (error) {
        console.error("Error fetching monthly detailed expenses:", error);
        return null;
    }
}

export async function toggleDebtStatusAction(month: string, debtName: string, currentStatus: boolean) {
    try {
        const success = await updateDebtStatus(month, debtName, !currentStatus);
        if (success) {
            revalidatePath('/expenses');
            return { success: true };
        }
        return { success: false, error: "Failed to update debt status" };
    } catch (error) {
        console.error("Error toggling debt status:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function toggleFixedExpenseStatusAction(month: string, expenseKey: string, currentStatus: boolean) {
    try {
        const success = await updateFixedExpenseStatus(month, expenseKey, !currentStatus);
        if (success) {
            revalidatePath('/expenses');
            return { success: true };
        }
        return { success: false, error: "Failed to update fixed expense status" };
    } catch (error) {
        console.error("Error toggling fixed expense status:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function getIncomeHistoryAction(): Promise<IncomeRecord[] | null> {
    if (!useRealData()) return null;
    try {
        return await fetchIncomeHistory();
    } catch (error) {
        console.error("Error fetching income history:", error);
        return null;
    }
}

export async function getDashboardKPIsAction(month?: string): Promise<DashboardKPIs | null> {
    if (!useRealData()) return null;
    try {
        return await fetchDashboardKPIs(month);
    } catch (error) {
        console.error("Error fetching KPIs:", error);
        return null;
    }
}

export async function getWeeklyControlAction(month?: string): Promise<(WeeklyControlData & { availableMonths: string[] }) | null> {
    if (!useRealData()) return null;
    try {
        return await fetchWeeklyControl(month);
    } catch (error) {
        console.error("Error fetching weekly control:", error);
        return null;
    }
}

export async function getCategoriesAction(): Promise<string[]> {
    try {
        return await fetchCategoryNames();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export async function getFullCategoriesAction() {
    try {
        const { fetchCategories } = await import('@/lib/db');
        return await fetchCategories();
    } catch (error) {
        console.error("Error fetching full categories:", error);
        return [];
    }
}

export async function getDolarBlueAction(): Promise<number> {
    try {
        const { fetchDolarBlue } = await import('@/lib/currency');
        return await fetchDolarBlue();
    } catch (error) {
        return 0;
    }
}

export async function getFxRatesAction() {
    try {
        const { fetchAllRates } = await import('@/lib/currency');
        return await fetchAllRates();
    } catch (error) {
        console.error("[getFxRatesAction] Error:", error);
        return null;
    }
}

export async function loginAction(code: string): Promise<boolean> {
    // Simple hardcoded check or env var
    // For now, let's use an env var or a default
    const correctCode = process.env.APP_PASSWORD || "admin123";

    if (code === correctCode) {
        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return true;
    }
    return false;
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    // Also delete auth_session if it exists (legacy?)
    cookieStore.delete('auth_session');

    // Redirect to login page
    // We import redirect dynamically to avoid issues if not used in a component context? 
    // No, 'next/navigation' redirect works in Server Actions.
    const { redirect } = await import('next/navigation');
    redirect('/login');
}


export async function getBudgetsAction(): Promise<Budget[]> {
    if (!useRealData()) return [];
    try {
        const { fetchBudgets } = await import('@/lib/db');
        return await fetchBudgets();
    } catch (error) {
        console.error("Error fetching budgets:", error);
        return [];
    }
}

export async function processFixedExpensesAction(): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { processFixedExpenses } = await import('@/lib/db');
        return await processFixedExpenses();
    } catch (error) {
        console.error("Error processing fixed expenses:", error);
        return false;
    }
}

export async function updateWeeklyExpenseAction(planId: string, status: boolean): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { updateWeeklyExpenseStatus } = await import('@/lib/db');
        return await updateWeeklyExpenseStatus(planId, status);
    } catch (error) {
        console.error("Error updating weekly expense:", error);
        return false;
    }
}


export async function updateWeeklyExpenseValueAction(planId: string, amount: number): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { updateWeeklyExpenseValue } = await import('@/lib/db');
        const success = await updateWeeklyExpenseValue(planId, amount);
        if (success) revalidatePath('/expenses');
        return success;
    } catch (error) {
        console.error("Error updating weekly expense value:", error);
        return false;
    }
}

export async function getAnalyticsDataAction(month?: string): Promise<{ spending: CategorySpending[], trends: MonthlyTrend[] }> {
    if (!useRealData()) return { spending: [], trends: [] };
    try {
        const { fetchCategorySpending, fetchMonthlyTrends } = await import('@/lib/db');
        const [spending, trends] = await Promise.all([
            fetchCategorySpending(month),
            fetchMonthlyTrends()
        ]);
        return { spending, trends };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { spending: [], trends: [] };
    }
}

export async function searchTransactionsAction(query: string): Promise<Transaction[]> {
    if (!useRealData()) return [];
    try {
        const { searchTransactions } = await import('@/lib/db');
        return await searchTransactions(query);
    } catch (error) {
        console.error("Error searching transactions:", error);
        return [];
    }
}

export async function getTransactionsAction(month?: string, category?: string): Promise<Transaction[]> {
    if (!useRealData()) return [];
    try {
        const { fetchTransactions } = await import('@/lib/db');
        return await fetchTransactions(month, category);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

export async function getAuditDataAction() {
    if (!useRealData()) return {};
    try {
        const { fetchAuditData } = await import('@/lib/db');
        return await fetchAuditData();
    } catch (error) {
        console.error("Error fetching audit data:", error);
        return {};
    }
}

export async function getCryptoPortfolioAction(): Promise<CryptoHolding[]> {
    // Simulated data for now
    return [
        { symbol: "BTC", amount: 0.5, value: 45000, change24h: 2.5 },
        { symbol: "ETH", amount: 4.2, value: 3200, change24h: -1.2 },
        { symbol: "SOL", amount: 150, value: 145, change24h: 5.8 },
        { symbol: "DOT", amount: 500, value: 8.5, change24h: 0.5 },
    ];
}

// --- P2P TRANSFER ACTION ---
export async function createTransferAction(transfer: {
    date: string;
    sourceAccountId: string;
    amountSent: number;
    destAccountId: string;
    amountReceived: number;
    description?: string;
}) {
    try {
        const result = await createTransfer(transfer);
        if (result) {
            revalidatePath('/');
            revalidatePath('/transactions');
            return { success: true, data: result };
        }
        return { success: false, error: 'Transfer failed' };
    } catch (error) {
        console.error('[createTransferAction]', error);
        return { success: false, error: 'Internal error' };
    }
}

// --- LEGACY ACTIONS ---

export async function getMonthlyRecordsAction(): Promise<MonthlyRecord[] | null> {
    if (!useRealData()) return null;
    try {
        const { fetchTransactions } = await import('@/lib/db');
        return await fetchTransactions() as MonthlyRecord[];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return null;
    }
}

export async function getSummaryDataAction(): Promise<SummaryData | null> {
    if (!useRealData()) return null;
    try {
        return await fetchSummaryData();
    } catch (error) {
        console.error("Error fetching summary from Sheets:", error);
        return null;
    }
}

export async function getExpenseControlAction(): Promise<ExpenseControl | null> {
    if (!useRealData()) return null;
    try {
        return await fetchExpenseControl();
    } catch (error) {
        console.error("Error fetching expense control from Sheets:", error);
        return null;
    }
}

export async function addRecordAction(record: Omit<MonthlyRecord, 'id'>): Promise<MonthlyRecord | null> {
    if (!useRealData()) return null;
    try {
        const { addTransaction } = await import('@/lib/db');
        const inserted = await addTransaction(record);

        if (inserted) {
            revalidatePath('/');
            revalidatePath('/expenses');
            revalidatePath('/history');
            return inserted as MonthlyRecord;
        }
        return null;
    } catch (error) {
        console.error("Error adding transaction:", error);
        return null;
    }
}

export async function bulkAddTransactionsAction(records: Omit<MonthlyRecord, 'id'>[]): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { addTransactions } = await import('@/lib/db');
        return await addTransactions(records);
    } catch (error) {
        console.error("Error bulk adding records:", error);
        return false;
    }
}

export async function updateRecordAction(id: string, updates: Partial<MonthlyRecord>): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { updateTransaction } = await import('@/lib/db');
        const success = await updateTransaction(id, updates);
        if (success) {
            revalidatePath('/');
            revalidatePath('/expenses');
            revalidatePath('/history');
        }
        return success;
    } catch (error) {
        console.error("Error updating transaction:", error);
        return false;
    }
}

export async function updateIncomeAction(month: string, amount: number): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { updateIncomeValue } = await import('@/lib/db');
        const success = await updateIncomeValue(month, amount);
        if (success) revalidatePath('/expenses');
        return success;
    } catch (error) {
        console.error("Error updating income:", error);
        return false;
    }
}

export async function updateFixedExpenseValueAction(month: string, expenseKey: string, amount: number): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { updateFixedExpenseValue } = await import('@/lib/db');
        const success = await updateFixedExpenseValue(month, expenseKey, amount);
        if (success) revalidatePath('/expenses');
        return success;
    } catch (error) {
        console.error("Error updating fixed expense value:", error);
        return false;
    }
}

export async function addBudgetAction(budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget | null> {
    if (!useRealData()) return null;
    try {
        const { addBudget } = await import('@/lib/db');
        const newBudget = await addBudget(budget);
        revalidatePath('/budgets');
        return newBudget;
    } catch (error) {
        console.error("Error adding budget:", error);
        return null;
    }
}

export async function updateBudgetAction(id: string, budget: Partial<Budget>): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { updateBudget } = await import('@/lib/db');
        const success = await updateBudget(id, budget);
        if (success) revalidatePath('/budgets');
        return success;
    } catch (error) {
        console.error("Error updating budget:", error);
        return false;
    }
}

export async function deleteBudgetAction(id: string): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { deleteBudget } = await import('@/lib/db');
        const success = await deleteBudget(id);
        if (success) revalidatePath('/budgets');
        return success;
    } catch (error) {
        console.error("Error deleting budget:", error);
        return false;
    }
}

export async function deleteRecordAction(id: string): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { deleteTransaction } = await import('@/lib/db');
        const success = await deleteTransaction(id);
        if (success) {
            revalidatePath('/');
            revalidatePath('/expenses');
            revalidatePath('/history');
        }
        return success;
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return false;
    }
}

// --- ADVANCED ARCHITECTURE ACTIONS (Accounts & Recurring) ---

export async function getAccountsAction(): Promise<DimAccount[]> {
    if (!useRealData()) return [];
    try {
        const { fetchAccounts } = await import('@/lib/db');
        return await fetchAccounts();
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }
}

export async function saveAccountAction(account: Omit<DimAccount, 'id' | 'isActive'>): Promise<DimAccount | null> {
    if (!useRealData()) return null;
    try {
        const { saveAccount } = await import('@/lib/db');
        const updated = await saveAccount(account);
        revalidatePath('/dashboard');
        revalidatePath('/accounts');
        return updated;
    } catch (error) {
        console.error("Error saving account:", error);
        return null;
    }
}

export async function updateAccountAction(id: string, updates: Partial<DimAccount>): Promise<DimAccount | null> {
    if (!useRealData()) return null;
    try {
        const { updateAccount } = await import('@/lib/db');
        const updated = await updateAccount(id, updates);
        revalidatePath('/dashboard');
        revalidatePath('/accounts');
        return updated;
    } catch (error) {
        console.error("Error updating account:", error);
        return null;
    }
}

export async function deleteAccountAction(id: string): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { deleteAccount } = await import('@/lib/db');
        const success = await deleteAccount(id);
        if (success) {
            revalidatePath('/dashboard');
            revalidatePath('/accounts');
        }
        return success;
    } catch (error) {
        console.error("Error deleting account:", error);
        return false;
    }
}

export async function getRecurringTransactionsAction(): Promise<RecurringTransaction[]> {
    if (!useRealData()) return [];
    try {
        const { fetchRecurringTransactions } = await import('@/lib/db');
        return await fetchRecurringTransactions();
    } catch (error) {
        console.error("Error fetching recurring transactions:", error);
        return [];
    }
}

export async function saveRecurringTransactionAction(recurring: RecurringTransaction): Promise<RecurringTransaction | null> {
    if (!useRealData()) return null;
    try {
        const { saveRecurringTransaction } = await import('@/lib/db');
        const updated = await saveRecurringTransaction(recurring);
        revalidatePath('/recurring');
        return updated;
    } catch (error) {
        console.error("Error saving recurring transaction:", error);
        return null;
    }
}

export async function deleteRecurringTransactionAction(id: string): Promise<boolean> {
    if (!useRealData()) return false;
    try {
        const { deleteRecurringTransaction } = await import('@/lib/db');
        const success = await deleteRecurringTransaction(id);
        if (success) revalidatePath('/recurring');
        return success;
    } catch (error) {
        console.error("Error deleting recurring transaction:", error);
        return false;
    }
}

export async function processRecurringTransactionsAction(): Promise<number> {
    if (!useRealData()) return 0;
    try {
        const { processRecurringTransactions } = await import('@/lib/recurringEngine');
        const count = await processRecurringTransactions();
        if (count > 0) {
            revalidatePath('/dashboard');
            revalidatePath('/transactions');
        }
        return count;
    } catch (error) {
        console.error("Error processing recurring transactions:", error);
        return 0;
    }
}

// --- M.I.A PROACTIVA (Frente 1) ---

export async function getSmartInsightsAction(kpis: DashboardKPIs, transactions: Transaction[], month: string): Promise<any | null> {
    if (!useRealData()) return null;
    try {
        const { generateSmartInsights } = await import('@/lib/aiInsights');
        return generateSmartInsights(kpis, transactions, month);
    } catch (error) {
        console.error("Error generating smart insight:", error);
        return null;
    }
}

// --- CLOSED BETA WAITLIST ---
export async function joinWaitlistAction(data: { email: string, name?: string, revenue?: string, reason?: string }) {
    try {
        const { insforge } = await import('@/lib/insforge');
        const { error } = await insforge.database.from('waitlist').insert({
            email: data.email,
            full_name: data.name || null,
            revenue_bracket: data.revenue || null,
            application_reason: data.reason || null,
            status: 'pending'
        });
        if (error) {
            // Postgres unique violation code usually is 23505
            if (error.code === '23505' || error.message.includes('unique')) {
                return { success: false, error: 'Esta identidad ya está en la fila.' };
            }
            console.error("Waitlist db error:", error);
            return { success: false, error: 'Ocurrió un error al registrarte.' };
        }
        return { success: true };
    } catch (error) {
        console.error("Waitlist error:", error);
        return { success: false, error: 'Ocurrió un error interno.' };
    }
}

