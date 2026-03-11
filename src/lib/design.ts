/**
 * FINMOM Design System — Apple Dark Mode Tokens
 * Import this file instead of hardcoding colors/radii/sizes.
 */

// ────────────────────────────────────────────
// Apple System Colors
// ────────────────────────────────────────────
export const COLORS = {
    green: '#30D158',
    red: '#FF453A',
    blue: '#0A84FF',
    orange: '#FF9F0A',
    teal: '#14b8a6',
    cyan: '#64D2FF',
    gray: '#8E8E93',

    // Surfaces
    card: '#1C1C1E',
    cardHover: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.06)',
    cardBorderHover: 'rgba(255,255,255,0.1)',
    surface: '#2C2C2E',
    background: '#000000',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.8)',
    textTertiary: 'rgba(255,255,255,0.5)',
    textQuaternary: 'rgba(255,255,255,0.3)',
    textMuted: 'rgba(255,255,255,0.2)',

    // Accents for data
    income: '#30D158',
    expense: '#FF453A',
    savings: '#0A84FF',
    investment: '#14b8a6',
} as const;

// ────────────────────────────────────────────
// Spacing & Radii
// ────────────────────────────────────────────
export const RADIUS = {
    card: 'rounded-2xl',    // 16px
    button: 'rounded-xl',   // 12px
    input: 'rounded-xl',    // 12px
    badge: 'rounded-md',    // 6px
    pill: 'rounded-full',
} as const;

// ────────────────────────────────────────────
// Typography Scale
// ────────────────────────────────────────────
export const FONT = {
    caption: 'text-[11px]',
    footnote: 'text-[12px]',
    body: 'text-[13px]',
    callout: 'text-[14px]',
    subhead: 'text-[15px]',
    title3: 'text-lg',
    title2: 'text-xl',
    title1: 'text-2xl',
    largeTitle: 'text-3xl',
} as const;

// ────────────────────────────────────────────
// Reusable Tailwind Class Strings
// ────────────────────────────────────────────
export const CARD = 'glass-panel' as const;
export const CARD_ELEVATED = 'glass-obsidian' as const;

export const TABLE_HEADER = 'text-[11px] uppercase text-white/50 bg-white/[0.02] border-b border-white/[0.04]' as const;
export const TABLE_ROW = 'hover:bg-white/[0.03] transition-colors' as const;
export const TABLE_CELL = 'px-4 py-3 text-[13px]' as const;

export const BUTTON_PRIMARY = 'bg-[#0A84FF] hover:bg-[#0A84FF]/80 text-white rounded-xl text-[13px] font-medium' as const;
export const BUTTON_GHOST = 'text-white/50 hover:text-white hover:bg-white/[0.06] rounded-xl text-[13px]' as const;
export const BUTTON_DANGER = 'bg-[#FF453A]/10 text-[#FF453A] hover:bg-[#FF453A]/20 rounded-xl text-[13px]' as const;

export const INPUT_STYLE = 'bg-white/[0.04] border-white/[0.06] text-white rounded-xl text-[13px]' as const;
export const MODAL_STYLE = 'bg-[#1C1C1E] border-white/[0.06] text-white' as const;

export const TOOLTIP_STYLE = {
    backgroundColor: '#2C2C2E',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '13px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
} as const;

// ────────────────────────────────────────────
// Status Helpers
// ────────────────────────────────────────────
export function statusColor(status: 'success' | 'warning' | 'danger' | 'info' | 'neutral'): string {
    switch (status) {
        case 'success': return COLORS.green;
        case 'warning': return COLORS.orange;
        case 'danger': return COLORS.red;
        case 'info': return COLORS.blue;
        default: return COLORS.gray;
    }
}

export function progressColor(percent: number): string {
    if (percent > 90) return COLORS.red;
    if (percent > 75) return COLORS.orange;
    return COLORS.green;
}
