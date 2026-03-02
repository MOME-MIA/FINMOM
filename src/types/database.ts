export type TierType = 'free' | 'pro' | 'premium';
export type AccountType = 'bank' | 'wallet' | 'crypto' | 'cash' | 'platform';
export type CurrencyType = 'USD' | 'EUR' | 'ARS' | 'USDT' | 'BTC' | 'ETH';
export type TransactionType = 'income' | 'fixed_expense' | 'variable_expense' | 'transfer';
export type TransactionStatus = 'pending' | 'completed';
export type BillingCycle = 'weekly' | 'monthly' | 'yearly';
export type WithdrawalType = 'fixed_expenses_batch' | 'weekly_withdrawal';
export type WithdrawalStatus = 'pending' | 'in_progress' | 'completed';

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    tier: TierType;
    created_at: string;
    updated_at: string;
}

export interface Account {
    id: string;
    user_id: string;
    name: string;
    type: AccountType;
    currency: CurrencyType;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface DbTransaction {
    id: string;
    user_id: string;
    account_id: string | null;
    type: TransactionType;
    amount: number;
    currency: string;
    category: string | null;
    date: string;
    is_recurring: boolean;
    status: TransactionStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    account_id: string | null;
    name: string;
    amount: number;
    currency: string;
    billing_cycle: BillingCycle;
    next_billing_date: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface WithdrawalPlan {
    id: string;
    user_id: string;
    target_date: string;
    type: WithdrawalType;
    from_currency: string;
    to_currency: string;
    target_amount: number;
    reference_usd_value: number | null;
    exchange_rate_ars: number | null;
    status: WithdrawalStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}
