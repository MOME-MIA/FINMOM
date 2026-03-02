import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
    if (!dateStr) return "";

    // Handle "Month - Year" format (e.g., "octubre - 2025")
    if (dateStr.includes(' - ')) {
        const [month, year] = dateStr.split(' - ');
        if (month && year) {
            return `${month.charAt(0).toUpperCase() + month.slice(1)} '${year.trim().slice(-2)}`;
        }
    }

    // Handle "DD/MM/YYYY" format
    const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
        const [_, day, month, year] = ddmmyyyy;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(date);
    }

    // Handle ISO or other formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(date);
    }

    return dateStr;
}

/**
 * Format a monetary amount with the appropriate symbol and decimals.
 * Supports all CurrencyCode values: ARS, USD, EUR, USDT, BTC, ETH
 */
export function formatCurrency(amount: number, currency: string = 'ARS'): string {
    switch (currency) {
        case 'BTC':
            return `₿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
        case 'ETH':
            return `Ξ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
        case 'USDT':
            return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
        case 'EUR':
            return new Intl.NumberFormat('es-AR', {
                style: 'currency', currency: 'EUR', maximumFractionDigits: 0
            }).format(amount);
        case 'USD':
            return new Intl.NumberFormat('es-AR', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 0
            }).format(amount);
        case 'ARS':
        default:
            return new Intl.NumberFormat('es-AR', {
                style: 'currency', currency: 'ARS', maximumFractionDigits: 0
            }).format(amount);
    }
}
