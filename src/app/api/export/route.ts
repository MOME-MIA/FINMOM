import { NextResponse } from 'next/server';
import { getTransactionsAction } from '@/app/actions';

export async function GET() {
    try {
        const transactions = await getTransactionsAction();

        if (!transactions || transactions.length === 0) {
            return new NextResponse('No data found', { status: 404 });
        }

        // CSV Header
        const headers = [
            'ID',
            'Fecha',
            'Tipo',
            'Monto',
            'Moneda',
            'Categoria',
            'Descripcion',
            'Metodo de Pago',
            'ID Cuenta',
            'FX Rate',
        ].join(',');

        // CSV Rows
        const rows = transactions.map(t => {
            return [
                t.id,
                t.date,
                `"${t.type}"`,
                t.amount,
                t.currencyCode,
                `"${t.categoryName || ''}"`,
                `"${(t.description || '').replace(/"/g, '""')}"`,
                `"${t.paymentMethod || ''}"`,
                t.accountId || '',
                t.fxRate || '',
            ].join(',');
        });

        const csvContent = [headers, ...rows].join('\n');

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="momentum_export_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("Error generating CSV:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
