/**
 * FINMOM — Canonical Categories
 * 
 * WHY: The History page requires fixed columns for each expense type.
 * These categories map 1:1 to both the transaction form and the
 * analytic breakdown. Adding a category here automatically makes it
 * available in forms, filters, and the history detail table.
 */

export const CATEGORIES = {
    // Fixed / Housing
    ALQUILER: 'Alquiler',
    LUZ: 'Luz',
    AGUA: 'Agua',
    GAS: 'Gas',
    WIFI: 'Wifi',
    EXPENSAS: 'Expensas',

    // Transport & Insurance
    SEG_AUTO: 'Seg. Auto',
    COMBUSTIBLE: 'Combustible',
    TRANSPORTE: 'Transporte',
    ESTACIONAMIENTO: 'Estacionamiento',

    // Daily Living
    SUPERMERCADO: 'Supermercado',
    CELU: 'Celu',
    JARDIN: 'Jardín',

    // Health & Wellness
    SALUD: 'Salud',
    FARMACIA: 'Farmacia',
    GIMNASIO: 'Gimnasio',

    // Lifestyle
    OCIO: 'Ocio',
    RESTAURANTES: 'Restaurantes',
    DELIVERY: 'Delivery',
    ROPA: 'Ropa',
    SUSCRIPCIONES: 'Suscripciones',

    // Financial
    IMPUESTOS: 'Impuestos',
    SEGUROS: 'Seguros',
    PRESTAMOS: 'Préstamos',
    INVERSIONES: 'Inversiones',
    CRYPTO: 'Crypto',

    // Other
    EDUCACION: 'Educación',
    MASCOTAS: 'Mascotas',
    HOGAR: 'Hogar',
    OTROS: 'Otros',
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CategoryValue = typeof CATEGORIES[CategoryKey];

/** Flat array for Select dropdowns */
export const CATEGORY_LIST: CategoryValue[] = Object.values(CATEGORIES);

/** Categories that appear as columns in the History detail table */
export const HISTORY_COLUMNS: CategoryValue[] = [
    CATEGORIES.ALQUILER,
    CATEGORIES.LUZ,
    CATEGORIES.AGUA,
    CATEGORIES.GAS,
    CATEGORIES.WIFI,
    CATEGORIES.CELU,
    CATEGORIES.SUPERMERCADO,
    CATEGORIES.COMBUSTIBLE,
    CATEGORIES.SALUD,
    CATEGORIES.OCIO,
];

/** Payment methods */
export const PAYMENT_METHODS = [
    { id: 'Cash', label: 'Efectivo' },
    { id: 'Debit', label: 'Débito' },
    { id: 'Credit', label: 'Crédito' },
    { id: 'Transfer', label: 'Transferencia' },
    { id: 'MercadoPago', label: 'Mercado Pago' },
    { id: 'Crypto', label: 'Crypto' },
] as const;

/** Transaction types */
export const TRANSACTION_TYPES = [
    { id: 'Gasto Fijo', label: 'Fijo / Recurrente' },
    { id: 'Gasto Semanal', label: 'Variable / Extra' },
    { id: 'Ingreso', label: 'Ingreso' },
] as const;
