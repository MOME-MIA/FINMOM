import {
    DimCategory,
    DimAccount,
    Transaction,
    Transfer,
    Budget,
    RecurringTransaction,
    DashboardKPIs,
    CategorySpending,
    MonthlyTrend,
    VaultBalance,
    MonthlyRecord
} from '@/types/finance';

import { insforge } from './insforge';
import { checkCanAddAccount, checkCanAddTransaction } from '@/lib/limits';

export const parseCurrency = (val: any): number => 0;
export const mapTransaction = (row: any): Transaction => ({} as Transaction);
export const mapTransfer = (row: any): Transfer => ({} as Transfer);

export const fetchCategories = async (type?: string): Promise<DimCategory[]> => [];
export const fetchCategoryNames = async (): Promise<string[]> => [];

export const fetchAccounts = async (): Promise<DimAccount[]> => {
    const { data, error } = await insforge.database
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        provider: row.type,
        currencyCode: row.currency as any,
        initialBalance: row.balance,
        currentBalance: row.balance,
        color: '#ffffff', // Default for now
        isActive: true
    }));
};

export const saveAccount = async (account: Omit<DimAccount, 'id' | 'isActive'>): Promise<DimAccount | null> => {
    const { data } = await insforge.auth.getCurrentSession();
    if (!data.session?.user) throw new Error("Not authenticated");

    const limits = await checkCanAddAccount(data.session.user.id);
    if (!limits.allowed) {
        console.error(`Account limit reached for your tier (${limits.limit})`);
        return null;
    }

    const { data: dbData, error } = await insforge.database
        .from('accounts')
        .insert({
            user_id: data.session.user.id,
            name: account.name,
            type: account.provider,
            currency: account.currencyCode,
            balance: account.currentBalance
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving account:", error);
        return null;
    }

    return {
        id: dbData.id,
        name: dbData.name,
        provider: dbData.type,
        currencyCode: dbData.currency as any,
        initialBalance: dbData.balance,
        currentBalance: dbData.balance,
        color: '#ffffff',
        isActive: true
    };
};

export const updateAccount = async (id: string, updates: Partial<DimAccount>): Promise<DimAccount | null> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) throw new Error("Not authenticated");

    const updatePayload: any = {};
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.provider !== undefined) updatePayload.type = updates.provider;
    if (updates.currencyCode !== undefined) updatePayload.currency = updates.currencyCode;
    if (updates.currentBalance !== undefined) updatePayload.balance = updates.currentBalance;

    const { data, error } = await insforge.database
        .from('accounts')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', sessionData.session.user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating account:", error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        provider: data.type,
        currencyCode: data.currency as any,
        initialBalance: data.balance,
        currentBalance: data.balance,
        color: '#ffffff',
        isActive: true
    };
};

export const deleteAccount = async (id: string): Promise<boolean> => {
    const { error } = await insforge.database
        .from('accounts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting account:", error);
        return false;
    }
    return true;
};
export const fetchVaultBalances = async (): Promise<VaultBalance[]> => [];

export const fetchTransactions = async (month?: string, categoryId?: string): Promise<any[]> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return [];

    let query = insforge.database
        .from('transactions')
        .select(`*, accounts(name, type, currency)`)
        .eq('user_id', sessionData.session.user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

    if (month) {
        // month format 'YYYY-MM'
        const startDate = `${month}-01`;
        const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().split('T')[0];
        query = query.gte('date', startDate).lt('date', endDate);
    }
    if (categoryId) {
        query = query.eq('category', categoryId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }

    // Map to legacy MonthlyRecord if needed
    return (data || []).map(row => ({
        id: row.id,
        date: row.date,
        type: row.type,
        amountARS: Number(row.amount_ars),
        amountUSD: Number(row.amount_usd),
        category: row.category,
        description: row.description || '',
        paymentMethod: row.payment_method || '',
        accountId: row.account_id || null,
        fxRate: Number(row.fx_rate),
        fxSource: row.fx_source || '',
        fxTimestamp: row.fx_timestamp || '',
        createdAt: row.created_at,
    }));
};

export const addTransaction = async (tx: any): Promise<any | null> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) throw new Error("Not authenticated");

    const limits = await checkCanAddTransaction(sessionData.session.user.id);
    if (!limits.allowed) {
        console.error(`Transaction limit reached for your tier (${limits.limit} per month)`);
        return null; // Should ideally throw a unified AppError that the UI can catch
    }

    const { data, error } = await insforge.database
        .from('transactions')
        .insert({
            user_id: sessionData.session.user.id,
            date: tx.date || new Date().toISOString().split('T')[0],
            type: tx.type,
            amount_ars: tx.amountARS || 0,
            amount_usd: tx.amountUSD || 0,
            category: tx.category,
            description: tx.description || null,
            payment_method: tx.paymentMethod || null,
            account_id: tx.accountId || null,
            recurring_id: tx.recurringId || null,
            fx_rate: tx.fxRate || null,
            fx_source: tx.fxSource || null,
            fx_timestamp: tx.fxTimestamp || null
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving transaction:", error);
        return null;
    }

    // --- RECONCILIATION LOGIC ---
    // Update the account balance dynamically
    if (tx.accountId) {
        // Fetch current account
        const { data: accData } = await insforge.database
            .from('accounts')
            .select('balance, currency')
            .eq('id', tx.accountId)
            .single();

        if (accData) {
            let amountToAffect = Number(tx.amountARS || 0);
            if (accData.currency === 'USD') amountToAffect = Number(tx.amountUSD || 0);
            if (accData.currency === 'EUR') amountToAffect = Number(tx.amountUSD || 0) * 0.92; // Approx EUR if needed, but UI usually passes correct native amount

            // Let's assume the UI sends the native amount in amount_ars or we can just use the provided amountARS as the native amount for the account for simplicity, 
            // since the frontend AddClient form stores the native amount in amountARS and calculates the other.

            const newBalance = tx.type === 'income'
                ? Number(accData.balance) + amountToAffect
                : Number(accData.balance) - amountToAffect;

            await insforge.database
                .from('accounts')
                .update({ balance: newBalance })
                .eq('id', tx.accountId);
        }
    }
    // ---------------------------

    return {
        id: data.id,
        date: data.date,
        type: data.type,
        amountARS: Number(data.amount_ars),
        amountUSD: Number(data.amount_usd),
        category: data.category,
        description: data.description || '',
        paymentMethod: data.payment_method || '',
        accountId: data.account_id || null,
        fxRate: Number(data.fx_rate),
        fxSource: data.fx_source || '',
        fxTimestamp: data.fx_timestamp || '',
        createdAt: data.created_at,
    };
};

export const updateTransaction = async (id: string, updates: any): Promise<boolean> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return false;

    const updatePayload: any = {};
    if (updates.date !== undefined) updatePayload.date = updates.date;
    if (updates.type !== undefined) updatePayload.type = updates.type;
    if (updates.amountARS !== undefined) updatePayload.amount_ars = updates.amountARS;
    if (updates.amountUSD !== undefined) updatePayload.amount_usd = updates.amountUSD;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.paymentMethod !== undefined) updatePayload.payment_method = updates.paymentMethod;
    if (updates.accountId !== undefined) updatePayload.account_id = updates.accountId;

    const { error } = await insforge.database
        .from('transactions')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error updating transaction:", error);
        return false;
    }
    return true;
};

export const addTransactions = async (records: Omit<MonthlyRecord, 'id'>[]): Promise<boolean> => {
    try {
        const { data: sessionData } = await insforge.auth.getCurrentSession();
        if (!sessionData.session) return false;

        const userId = sessionData.session.user.id;

        const limits = await checkCanAddTransaction(userId);
        if (limits.limit !== Infinity && (limits.current + records.length) > limits.limit) {
            console.error(`Bulk insert exceeds transaction limit (${limits.limit}). Current: ${limits.current}, Attempting to add: ${records.length}`);
            return false;
        }

        const payload = records.map(record => ({
            user_id: userId,
            date: record.date,
            type: record.type,
            amount_ars: record.amountARS,
            amount_usd: record.amountUSD,
            category: record.category,
            description: record.description,
            payment_method: record.paymentMethod,
        }));

        const { error } = await insforge.database.from('transactions').insert(payload);
        if (error) {
            console.error("InsForge bulk insert error:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error adding multiple transactions:", error);
        return false;
    }
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return false;

    // Get transaction details first to adjust balance
    const { data: txData } = await insforge.database
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

    const { error } = await insforge.database
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error deleting transaction:", error);
        return false;
    }

    // --- RECONCILIATION LOGIC ---
    if (txData && txData.account_id) {
        const { data: accData } = await insforge.database
            .from('accounts')
            .select('balance, currency')
            .eq('id', txData.account_id)
            .single();

        if (accData) {
            let amountToAffect = Number(txData.amount_ars || 0);
            if (accData.currency === 'USD') amountToAffect = Number(txData.amount_usd || 0);

            // Reverse the operation
            const newBalance = txData.type === 'income'
                ? Number(accData.balance) - amountToAffect
                : Number(accData.balance) + amountToAffect;

            await insforge.database
                .from('accounts')
                .update({ balance: newBalance })
                .eq('id', txData.account_id);
        }
    }
    // ---------------------------

    return true;
};

export const searchTransactions = async (queryStr: string): Promise<any[]> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return [];

    const { data, error } = await insforge.database
        .from('transactions')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .ilike('description', `%${queryStr}%`)
        .order('date', { ascending: false });

    if (error) {
        console.error("Error searching transactions:", error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        date: row.date,
        type: row.type,
        amountARS: Number(row.amount_ars),
        amountUSD: Number(row.amount_usd),
        category: row.category,
        description: row.description || '',
    }));
};


export const createTransfer = async (transfer: any): Promise<Transfer | null> => null;
export const fetchTransfers = async (month?: string): Promise<Transfer[]> => [];


export const fetchRecurringTransactions = async (): Promise<RecurringTransaction[]> => [];

// Real Aggregation Logic
export const fetchDashboardKPIs = async (month?: string): Promise<DashboardKPIs> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return {
        totalIncome: 0, totalExpenses: 0, savings: 0, savingsRate: 0,
        budgetUtilization: 0, fixedExpenses: 0, variableExpenses: 0,
        investments: 0, netBalance: 0, txCount: 0
    };

    const targetMonth = month || new Date().toISOString().substring(0, 7); // YYYY-MM
    const startDate = `${targetMonth}-01`;
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().split('T')[0];

    // 1. Fetch Transactions
    const { data: txs, error: txError } = await insforge.database
        .from('transactions')
        .select('type, amount_usd, amount_ars')
        .eq('user_id', sessionData.session.user.id)
        .gte('date', startDate)
        .lt('date', endDate);

    // 2. Fetch Accounts to calculate netBalance
    const { data: accs, error: accError } = await insforge.database
        .from('accounts')
        .select('balance, currency')
        .eq('user_id', sessionData.session.user.id);

    // Get current rates internally (fallback to 1200 if missing)
    let usdRate = 1200; // rough default for ARS/USD
    const { data: fxData } = await insforge.database.from('fx_rates').select('*').limit(1).maybeSingle();
    if (fxData && fxData.ars) usdRate = fxData.ars;

    let totalIncome = 0;
    let totalExpenses = 0;
    let fixedExpenses = 0;
    let variableExpenses = 0;
    let investments = 0;

    if (txs) {
        txs.forEach((tx: any) => {
            // Using ARS as the stable aggregation base
            const amount = Number(tx.amount_ars) || (Number(tx.amount_usd) * usdRate) || 0;
            if (tx.type === 'income') totalIncome += amount;
            else if (tx.type === 'expense' || tx.type === 'variable_expense') {
                totalExpenses += amount;
                variableExpenses += amount;
            }
            else if (tx.type === 'fixed_expense') {
                totalExpenses += amount;
                fixedExpenses += amount;
            }
            else if (tx.type === 'investment') investments += amount;
        });
    }

    let netBalanceARS = 0;
    if (accs) {
        accs.forEach((a: any) => {
            if (a.currency === 'ARS') netBalanceARS += Number(a.balance);
            else if (a.currency === 'USD') netBalanceARS += Number(a.balance) * usdRate;
            else if (a.currency === 'EUR') netBalanceARS += Number(a.balance) * (usdRate * 1.08); // rough EUR
        });
    }

    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate,
        budgetUtilization: 0, // Need full budget fetch to calculate properly
        fixedExpenses,
        variableExpenses,
        investments,
        netBalance: netBalanceARS,
        txCount: txs ? txs.length : 0
    };
};

export const fetchCategorySpending = async (month?: string): Promise<CategorySpending[]> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return [];

    const targetMonth = month || new Date().toISOString().substring(0, 7); // YYYY-MM
    const startDate = `${targetMonth}-01`;
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().split('T')[0];

    // Fetch expenses and categories
    const { data, error } = await insforge.database
        .from('transactions')
        .select(`amount_usd, amount_ars, category, categories(name, icon, color)`)
        .eq('user_id', sessionData.session.user.id)
        .in('type', ['expense', 'variable_expense', 'fixed_expense'])
        .gte('date', startDate)
        .lt('date', endDate);

    if (error || !data) return [];

    let usdRate = 1200; // rough default
    const { data: fxData } = await insforge.database.from('fx_rates').select('*').limit(1).maybeSingle();
    if (fxData && fxData.ars) usdRate = fxData.ars;

    const grouped: Record<string, { name: string, icon: string, color: string, value: number }> = {};
    let totalSpent = 0;

    data.forEach(tx => {
        const catId = tx.category || 'unknown';
        const rawCat = tx.categories as any;
        const cat = Array.isArray(rawCat) ? rawCat[0] : rawCat;

        const catName = cat?.name || 'Otros';
        const icon = cat?.icon || 'PieChart';
        const color = cat?.color || '#a1a1aa';
        const amount = Number(tx.amount_ars) || (Number(tx.amount_usd) * usdRate) || 0;

        if (!grouped[catId]) grouped[catId] = { name: catName, icon, color, value: 0 };
        grouped[catId].value += amount;
        totalSpent += amount;
    });

    return Object.entries(grouped)
        .map(([id, obj]) => ({
            categoryId: id,
            categoryName: obj.name,
            categoryIcon: obj.icon,
            categoryColor: obj.color,
            amount: obj.value,
            percentage: totalSpent > 0 ? (obj.value / totalSpent) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount); // Sort highest first
};

export const fetchMonthlyTrends = async (months: number = 6): Promise<MonthlyTrend[]> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return [];

    const d = new Date();
    d.setMonth(d.getMonth() - months + 1);
    const startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;

    const { data, error } = await insforge.database
        .from('transactions')
        .select('date, type, amount_usd, amount_ars')
        .eq('user_id', sessionData.session.user.id)
        .gte('date', startDate);

    if (error || !data) return [];

    let usdRate = 1200; // rough default
    const { data: fxData } = await insforge.database.from('fx_rates').select('*').limit(1).maybeSingle();
    if (fxData && fxData.ars) usdRate = fxData.ars;

    const trendsMap: Record<string, { income: number, expenses: number }> = {};

    // Initialize last N months
    for (let i = 0; i < months; i++) {
        const tempD = new Date();
        tempD.setMonth(tempD.getMonth() - i);
        const yyyyMm = `${tempD.getFullYear()}-${String(tempD.getMonth() + 1).padStart(2, '0')}`;
        trendsMap[yyyyMm] = { income: 0, expenses: 0 };
    }

    data.forEach(tx => {
        const monthKey = tx.date.substring(0, 7);
        if (trendsMap[monthKey]) {
            // Using ARS as stable aggregation base
            const amount = Number(tx.amount_ars) || (Number(tx.amount_usd) * usdRate) || 0;
            if (tx.type === 'income') trendsMap[monthKey].income += amount;
            else if (['expense', 'variable_expense', 'fixed_expense'].includes(tx.type)) {
                trendsMap[monthKey].expenses += amount;
            }
        }
    });

    return Object.entries(trendsMap)
        .map(([month, vals]) => ({
            month,
            income: vals.income,
            expenses: vals.expenses,
            savings: vals.income - vals.expenses
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
};

export class TableAudit { }
export const fetchAuditData = async () => {
    const tablesInfo = [
        { name: 'accounts', displayName: 'Cuentas', type: 'dimension' as const },
        { name: 'transactions', displayName: 'Transacciones', type: 'fact' as const },
        { name: 'profiles', displayName: 'Perfiles', type: 'dimension' as const },
        { name: 'withdrawal_plans', displayName: 'Planes Retiro', type: 'fact' as const },
        { name: 'budgets', displayName: 'Presupuestos', type: 'fact' as const }
    ];

    const tables = [];
    let connectedTables = 0;
    let totalRows = 0;

    for (const info of tablesInfo) {
        try {
            const { data, error, count } = await insforge.database
                .from(info.name)
                .select('*', { count: 'exact' })
                .limit(3);

            if (error) {
                tables.push({
                    name: info.name,
                    displayName: info.displayName,
                    type: info.type,
                    status: 'ERROR',
                    rowCount: 0,
                    sample: [],
                    columns: [],
                    error: error.message
                });
            } else {
                connectedTables++;
                const actualCount = count || (data ? data.length : 0);
                totalRows += actualCount;

                let columns: string[] = [];
                if (data && data.length > 0) {
                    columns = Object.keys(data[0]);
                }

                tables.push({
                    name: info.name,
                    displayName: info.displayName,
                    type: info.type,
                    status: actualCount === 0 ? 'EMPTY' : 'OK',
                    rowCount: actualCount,
                    sample: data || [],
                    columns: columns
                });
            }
        } catch (err: any) {
            tables.push({
                name: info.name,
                displayName: info.displayName,
                type: info.type,
                status: 'ERROR',
                rowCount: 0,
                sample: [],
                columns: [],
                error: (err as Error).message
            });
        }
    }

    // Attempt to get vault balances
    let totalVaultBalance = 0;
    try {
        const { data: accounts } = await insforge.database.from('accounts').select('balance');
        if (accounts) {
            totalVaultBalance = accounts.reduce((acc: number, curr: any) => acc + Number(curr.balance || 0), 0);
        }
    } catch { }

    // Get last transaction date
    let lastTransaction = 'N/A';
    try {
        const { data: lastTx } = await insforge.database
            .from('transactions')
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (lastTx && lastTx.created_at) {
            lastTransaction = lastTx.created_at;
        }
    } catch { }

    return {
        tables,
        systemHealth: {
            totalTables: tablesInfo.length,
            connectedTables,
            totalRows,
            lastTransaction,
            totalVaultBalance,
            databaseTimestamp: new Date().toISOString()
        }
    };
};

// Used by actions.ts
export const processFixedExpenses = async (): Promise<boolean> => true;
export const updateWeeklyExpenseStatus = async (planId: string, status: boolean): Promise<boolean> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return false;

    // In legacy it was a week number, now it should be the ID
    if (!planId || planId.length < 10) return false; // Basic UUID check since fallback was weekNumber.toString()

    const { error } = await insforge.database
        .from('withdrawal_plans')
        .update({ status: status ? 'completed' : 'pending' })
        .eq('id', planId)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error updating weekly expense status:", error);
        return false;
    }
    return true;
};

export const updateWeeklyExpenseValue = async (planId: string, amount: number): Promise<boolean> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return false;

    if (!planId || planId.length < 10) return false;

    const { error } = await insforge.database
        .from('withdrawal_plans')
        .update({ target_amount: amount })
        .eq('id', planId)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error updating weekly expense value:", error);
        return false;
    }
    return true;
};
export const addTransactionsToSheet = async (...args: any[]): Promise<boolean> => true;
export const updateTransactionInSheet = async (...args: any[]): Promise<boolean> => true;
export const deleteTransactionFromSheet = async (...args: any[]): Promise<boolean> => true;
export const updateIncomeValue = async (...args: any[]): Promise<boolean> => true;
export const updateFixedExpenseValue = async (...args: any[]): Promise<boolean> => true;
export const saveRecurringTransaction = async (...args: any[]): Promise<any> => ({});
export const deleteRecurringTransaction = async (...args: any[]): Promise<boolean> => true;
export const addTransactionToSheet = async (...args: any[]): Promise<any> => ({});
export const fetchDetailedExpenses = async (): Promise<any[]> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return [];

    const { data, error } = await insforge.database
        .from('transactions')
        .select('date, amount_ars, amount_usd, categories(name)')
        .eq('user_id', sessionData.session.user.id)
        .in('type', ['expense', 'variable_expense', 'fixed_expense'])
        .order('date', { ascending: false });

    if (error || !data) return [];

    const monthlyMap: Record<string, any> = {};
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    data.forEach(tx => {
        // Parse date reliably assuming YYYY-MM-DD
        const [yearStr, monthStr] = tx.date.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        const monthKey = `${monthNames[monthIndex]} - ${yearStr}`;

        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = {
                date: monthKey,
                alquiler: 0,
                luz: 0,
                agua: 0,
                wifi: 0,
                segAuto: 0,
                jardin: 0,
                celu: 0,
                entretenimiento: 0,
                mecanico: 0,
                extras: 0,
                estudio: 0,
                contador: 0,
                expensasCasa: 0,
                totalARS: 0
            };
        }

        const rawCat = tx.categories as any;
        const cat = Array.isArray(rawCat) ? rawCat[0] : rawCat;
        const catName = (cat?.name || '').toLowerCase();

        const amountARS = Number(tx.amount_ars) || 0;
        monthlyMap[monthKey].totalARS += amountARS;

        if (catName.includes('alquiler') || catName.includes('renta')) monthlyMap[monthKey].alquiler += amountARS;
        else if (catName.includes('luz') || catName.includes('electricidad')) monthlyMap[monthKey].luz += amountARS;
        else if (catName.includes('agua') || catName.includes('gas')) monthlyMap[monthKey].agua += amountARS;
        else if (catName.includes('seguro') && (catName.includes('auto') || catName.includes('coche'))) monthlyMap[monthKey].segAuto += amountARS;
        else if (catName.includes('jardin') || catName.includes('jardín')) monthlyMap[monthKey].jardin += amountARS;
        else if (catName.includes('celular') || catName.includes('movil')) monthlyMap[monthKey].celu += amountARS;
        else if (catName.includes('wifi') || catName.includes('internet')) monthlyMap[monthKey].wifi += amountARS;
        else if (catName.includes('entretenimiento') || catName.includes('ocio')) monthlyMap[monthKey].entretenimiento += amountARS;
        else if (catName.includes('mecanico') || catName.includes('mecánico') || catName.includes('taller')) monthlyMap[monthKey].mecanico += amountARS;
        else if (catName.includes('estudio') || catName.includes('educacion') || catName.includes('curso')) monthlyMap[monthKey].estudio += amountARS;
        else if (catName.includes('contador') || catName.includes('impuestos')) monthlyMap[monthKey].contador += amountARS;
        else if (catName.includes('expensas')) monthlyMap[monthKey].expensasCasa += amountARS;
        else monthlyMap[monthKey].extras += amountARS;
    });

    return Object.values(monthlyMap);
};
export const fetchIncomeHistory = async (): Promise<any[]> => [];
export const fetchWeeklyControl = async (month?: string): Promise<any> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return null;
    const userId = sessionData.session.user.id;

    const targetMonth = month || new Date().toISOString().substring(0, 7); // YYYY-MM
    const startDate = `${targetMonth}-01`;
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().split('T')[0];

    // 1. Fetch transactions for income and fixed expenses
    const { data: txs } = await insforge.database
        .from('transactions')
        .select('type, amount_ars, amount_usd')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lt('date', endDate);

    let incomeARS = 0;
    let gastosFijosARS = 0;

    if (txs) {
        incomeARS = txs.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + (Number(t.amount_ars) || 0), 0);
        gastosFijosARS = txs.filter((t: any) => t.type === 'fixed_expense').reduce((acc: number, t: any) => acc + (Number(t.amount_ars) || 0), 0);
    }

    // 2. Fetch withdrawal plans
    let { data: plans } = await insforge.database
        .from('withdrawal_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'weekly_withdrawal')
        .gte('target_date', startDate)
        .lt('target_date', endDate)
        .order('target_date', { ascending: true });

    // 3. Auto-generate if missing
    if (!plans || plans.length === 0) {
        const newPlans = [];
        for (let i = 1; i <= 4; i++) {
            const date = new Date(startDate);
            date.setDate(i * 7);
            newPlans.push({
                user_id: userId,
                target_date: date.toISOString().split('T')[0],
                type: 'weekly_withdrawal',
                from_currency: 'USD',
                to_currency: 'ARS',
                target_amount: 0,
                status: 'pending',
                exchange_rate_ars: 0,
                reference_usd_value: 0
            });
        }

        const { data: inserted } = await insforge.database
            .from('withdrawal_plans')
            .insert(newPlans)
            .select('*');

        plans = inserted || newPlans;
    }

    plans?.sort((a: any, b: any) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());

    // 4. Map to UI expected format
    return {
        month: targetMonth,
        income: incomeARS,
        gastosFijos: {
            fechaRetiro: startDate,
            restante: gastosFijosARS,
            valorUSDRef: 1,
            cambioARS: gastosFijosARS,
        },
        weeks: (plans || []).map((p: any, index: number) => ({
            id: p.id || String(index),
            weekNumber: index + 1,
            fechaRetiro: p.target_date,
            restante: Number(p.target_amount) || Number(p.exchange_rate_ars) || 0,
            assigned: Number(p.target_amount) || Number(p.exchange_rate_ars) || 0,
            valorUSDRef: Number(p.reference_usd_value || 1),
            cambioARS: Number(p.exchange_rate_ars || p.target_amount || 0),
            isPaid: p.status === 'completed',
            description: p.notes || `Semana ${index + 1}`
        })),
        availableMonths: [targetMonth]
    };
};
export const updateDebtStatus = async (...args: any[]): Promise<boolean> => true;
export const updateFixedExpenseStatus = async (...args: any[]): Promise<boolean> => true;
export const fetchMonthlyRecords = async (): Promise<any[]> => [];
export const fetchSummaryData = async (): Promise<any> => ({});
export const fetchExpenseControl = async (): Promise<any> => ({});

export const fetchBudgets = async (): Promise<Budget[]> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return [];

    const { data, error } = await insforge.database
        .from('budgets')
        .select(`*, categories(id, name, icon)`)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error fetching budgets:", error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        categoryId: row.category_id,
        categoryName: row.categories?.name,
        categoryIcon: row.categories?.icon,
        budgetLimit: Number(row.budget_limit),
        period: row.period as any,
        currencyCode: row.currency,
        spent: 0
    }));
};

export const addBudget = async (budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget | null> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) throw new Error("Not authenticated");

    const { data, error } = await insforge.database
        .from('budgets')
        .insert({
            user_id: sessionData.session.user.id,
            category_id: budget.categoryId,
            budget_limit: budget.budgetLimit,
            period: budget.period,
            currency: budget.currencyCode
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving budget:", error);
        return null;
    }

    return {
        id: data.id,
        categoryId: data.category_id,
        budgetLimit: Number(data.budget_limit),
        period: data.period as any,
        currencyCode: data.currency,
        spent: 0
    };
};

export const updateBudget = async (id: string, updates: Partial<Budget>): Promise<boolean> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return false;

    const updatePayload: any = {};
    if (updates.budgetLimit !== undefined) updatePayload.budget_limit = updates.budgetLimit;

    const { error } = await insforge.database
        .from('budgets')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error updating budget:", error);
        return false;
    }
    return true;
};

export const deleteBudget = async (id: string): Promise<boolean> => {
    const { data: sessionData } = await insforge.auth.getCurrentSession();
    if (!sessionData.session?.user) return false;

    const { error } = await insforge.database
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', sessionData.session.user.id);

    if (error) {
        console.error("Error deleting budget:", error);
        return false;
    }
    return true;
};
