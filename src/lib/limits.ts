import { insforge } from './insforge';
import { TierType } from '@/types/database';

export const LIMITS = {
    free: {
        accounts: 2,
        transactionsPerMonth: 50,
        subscriptions: 2,
    },
    pro: {
        accounts: 10,
        transactionsPerMonth: 500,
        subscriptions: 10,
    },
    premium: {
        accounts: Infinity,
        transactionsPerMonth: Infinity,
        subscriptions: Infinity,
    }
};

export async function getUserTier(userId: string): Promise<TierType> {
    const { data, error } = await insforge.database
        .from('profiles')
        .select('tier')
        .eq('id', userId)
        .single();

    if (error || !data) return 'free'; // default to free
    return data.tier as TierType;
}

export async function checkCanAddAccount(userId: string): Promise<{ allowed: boolean, limit: number, current: number }> {
    const tier = await getUserTier(userId);
    const limit = LIMITS[tier].accounts;

    if (limit === Infinity) return { allowed: true, limit, current: 0 };

    const { count, error } = await insforge.database
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const current = count || 0;
    return { allowed: current < limit, limit, current };
}

export async function checkCanAddTransaction(userId: string): Promise<{ allowed: boolean, limit: number, current: number }> {
    const tier = await getUserTier(userId);
    const limit = LIMITS[tier].transactionsPerMonth;

    if (limit === Infinity) return { allowed: true, limit, current: 0 };

    const targetMonth = new Date().toISOString().substring(0, 7);
    const startDate = `${targetMonth}-01`;
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toISOString().split('T')[0];

    const { count, error } = await insforge.database
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('date', startDate)
        .lt('date', endDate);

    const current = count || 0;
    return { allowed: current < limit, limit, current };
}

export async function checkCanAddSubscription(userId: string): Promise<{ allowed: boolean, limit: number, current: number }> {
    const tier = await getUserTier(userId);
    const limit = LIMITS[tier].subscriptions;

    if (limit === Infinity) return { allowed: true, limit, current: 0 };

    const { count, error } = await insforge.database
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const current = count || 0;
    return { allowed: current < limit, limit, current };
}
