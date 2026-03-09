import * as z from 'zod';

export const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('El monto debe ser mayor a 0'),
    currency: z.enum(['ARS', 'USD']),
    date: z.date(),
    accountId: z.string().min(1, 'Debes seleccionar una cuenta'),
    exchangeRate: z.number().positive(),

    // Income Fields
    source: z.string().optional(),
    description: z.string().optional(),

    // Expense Fields
    expenseNature: z.enum(['fixed', 'variable']).optional(),
    categoryId: z.string().optional(),
    note: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.type === 'income') {
        if (!data.source || data.source.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La fuente es obligatoria para ingresos',
                path: ['source']
            });
        }
    } else if (data.type === 'expense') {
        if (!data.categoryId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La categoría es obligatoria para gastos',
                path: ['categoryId']
            });
        }
        if (!data.expenseNature) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Debes definir si es gasto fijo o variable',
                path: ['expenseNature']
            });
        }
    }
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
