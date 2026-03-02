import { DashboardKPIs, Transaction } from "@/types/finance";
import { Insight } from "@/lib/insights";

/**
 * Pure local rule-based insights — ZERO Gemini tokens consumed.
 * Only M.I.A.'s chat (/api/chat) is authorized to use Gemini.
 */
export function generateSmartInsights(
    kpis: DashboardKPIs,
    transactions: Transaction[],
    month: string
): Insight {
    const savingsRate = kpis.totalIncome > 0
        ? (kpis.savings / kpis.totalIncome) * 100
        : 0;

    const fixedRatio = kpis.totalIncome > 0
        ? (kpis.fixedExpenses / kpis.totalIncome) * 100
        : 0;

    // Priority-based rule engine
    if (kpis.totalIncome === 0) {
        return {
            type: 'warning',
            message: `No hay ingresos registrados para ${month}. Cargá tus cobros del mes.`,
            priority: 1
        };
    }

    if (fixedRatio > 70) {
        return {
            type: 'danger',
            message: `Gastos fijos al ${Math.round(fixedRatio)}% de ingresos. Situación crítica.`,
            priority: 1
        };
    }

    if (savingsRate < 5) {
        return {
            type: 'warning',
            message: `Ahorro del ${Math.round(savingsRate)}%. Recortá gastos variables para mejorar margen.`,
            priority: 1
        };
    }

    if (savingsRate >= 30) {
        return {
            type: 'success',
            message: `Ahorro del ${Math.round(savingsRate)}%. Excelente disciplina financiera.`,
            priority: 1
        };
    }

    if (fixedRatio < 40) {
        return {
            type: 'success',
            message: `Gastos fijos controlados al ${Math.round(fixedRatio)}%.`,
            priority: 1
        };
    }

    return {
        type: 'info',
        message: 'Finanzas estables. Sin alertas por ahora.',
        priority: 1
    };
}
