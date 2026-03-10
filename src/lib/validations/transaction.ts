import * as z from 'zod';

export const transactionSchema = z.object({
    type: z.enum(['income', 'expense', 'transfer']),
    amount: z.number().positive('El monto debe ser mayor a 0'),
    currency: z.enum(['ARS', 'USD']),
    date: z.date(),
    accountId: z.string().min(1, 'Debes seleccionar una cuenta de origen'),
    exchangeRate: z.number().positive(),

    // Transfer Fields
    destAccountId: z.string().optional(),
    destAmount: z.number().optional(),

    // Income Fields
    source: z.string().optional(),
    description: z.string().optional(),

    // Expense Fields
    expenseNature: z.enum(['fixed', 'variable']).optional(),
    categoryId: z.string().optional(),
    note: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.type === 'transfer') {
        if (!data.destAccountId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Debes seleccionar una cuenta destino',
                path: ['destAccountId']
            });
        }
        if (data.accountId === data.destAccountId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La cuenta origen y destino no pueden ser la misma',
                path: ['destAccountId']
            });
        }
        if (data.destAmount === undefined || data.destAmount <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Debes especificar el monto a recibir',
                path: ['destAmount']
            });
        }
    } else if (data.type === 'income') {
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
