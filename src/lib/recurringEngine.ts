import { fetchRecurringTransactions, addTransaction } from './db';

/**
 * Recurring Engine — Processes due recurring transactions.
 * For each active recurring with nextDueDate <= today,
 * generates a fact_transaction and advances the due date.
 */
export async function processRecurringTransactions(): Promise<number> {
    try {
        const recurringList = await fetchRecurringTransactions();
        let generatedCount = 0;

        const today = new Date();
        const todayIso = today.toISOString().split('T')[0];

        for (const rt of recurringList) {
            if (!rt.active) continue;

            let nextDate = new Date(rt.nextDueDate);
            while (nextDate <= today && rt.active) {
                const dateStr = nextDate.toISOString().split('T')[0];

                // Generate transaction from template
                await addTransaction({
                    date: dateStr,
                    type: rt.type,
                    amount: rt.amount,
                    currencyCode: rt.currencyCode,
                    categoryId: rt.categoryId,
                    accountId: rt.accountId,
                    description: rt.description,
                    paymentMethod: '',
                    fxRate: null,
                    fxSource: null,
                    fxTimestamp: null,
                });
                generatedCount++;

                // Advance nextDueDate
                if (rt.frequency === 'weekly') {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (rt.frequency === 'biweekly') {
                    nextDate.setDate(nextDate.getDate() + 14);
                } else if (rt.frequency === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                } else if (rt.frequency === 'yearly') {
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                } else {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }
            }

            // TODO: Update fact_recurring.next_due_date + last_generated after processing
        }

        return generatedCount;
    } catch (error) {
        console.error("Error processing recurring transactions:", error);
        return 0;
    }
}
