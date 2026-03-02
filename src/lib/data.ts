import { MonthlyRecord, SummaryData, ExpenseControl, WeeklyExpense, FixedExpense } from '@/types/finance';
import { getMonthlyRecordsAction, getSummaryDataAction, getExpenseControlAction, addRecordAction } from '@/app/actions';

// Service Functions
export const getMonthlyRecords = async (): Promise<MonthlyRecord[]> => {
    const realData = await getMonthlyRecordsAction();
    return realData || [];
};

export const getSummaryData = async (): Promise<SummaryData> => {
    const realData = await getSummaryDataAction();
    if (!realData) {
        return {
            totalIncome: 0,
            fixedExpenses: 0,
            freeForExtras: 0,
            savings: 0,
            investments: 0,
            marginPercent: 0,
            savingsPercent: 0,
        };
    }
    return realData;
};

export const getExpenseControl = async (): Promise<ExpenseControl> => {
    const realData = await getExpenseControlAction();
    if (!realData) {
        return {
            totalWithdrawal: 0,
            fixedExpenses: [],
            weeklyExpenses: [],
        };
    }
    return realData;
};

export const addRecord = async (record: Omit<MonthlyRecord, 'id'>): Promise<MonthlyRecord> => {
    const realData = await addRecordAction(record);
    if (!realData) throw new Error("Failed to add record");
    return realData;
};

export const updateWeeklyExpense = async (id: string, updates: Partial<WeeklyExpense>): Promise<void> => {
    // Left empty as it's meant to be handled via server actions, shouldn't be a mock either
};

