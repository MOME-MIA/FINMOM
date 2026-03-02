import React from 'react';
import { Landmark, CreditCard, Wallet, Box, Coins } from 'lucide-react';

export const ProviderLogos = {
    // Custom SVGs for requested providers
    MercadoPago: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 12c-0.83 0-1.5-0.67-1.5-1.5v-3c0-0.83 0.67-1.5 1.5-1.5h3c0.83 0 1.5 0.67 1.5 1.5v3c0 0.83-0.67 1.5-1.5 1.5h-3z" fill="#009ee3" />
            <path d="M5.5 12c-0.83 0-1.5-0.67-1.5-1.5v-3c0-0.83 0.67-1.5 1.5-1.5h3c0.83 0 1.5 0.67 1.5 1.5v3c0 0.83-0.67 1.5-1.5 1.5h-3z" fill="#009ee3" />
            <path d="M12 18c-0.83 0-1.5-0.67-1.5-1.5v-3c0-0.83 0.67-1.5 1.5-1.5h3c0.83 0 1.5 0.67 1.5 1.5v3c0 0.83-0.67 1.5-1.5 1.5h-3z" fill="#009ee3" />
            <circle cx="12" cy="12" r="10" stroke="#009ee3" strokeWidth="2" />
        </svg>
    ),
    Uala: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ff4c4c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Brubank: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="4" stroke="#6C5CE7" strokeWidth="2" />
            <path d="M8 12h8M12 8v8" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Santander: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="12" rx="10" ry="10" stroke="#EC0000" strokeWidth="2" />
            <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#EC0000" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    HSBC: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12L12 2l10 10-10 10L2 12z" fill="#DB0011" />
            <path d="M12 2L2 12h20L12 2z" fill="#ffffff" />
            <path d="M12 22l10-10H2l10 10z" fill="#ffffff" />
        </svg>
    ),
    Binance: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L6 8l3 3 3-3 3 3 3-3-6-6zM6 16l6 6 6-6-3-3-3 3-3-3-3 3zM2 12l3-3 3 3-3 3-3-3zM22 12l-3-3-3 3 3 3 3-3zM12 10l-2 2 2 2 2-2-2-2z" fill="#F3BA2F" />
        </svg>
    ),
    Payoneer: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FF4800" strokeWidth="3" />
            <path d="M12 6v6l4 2" stroke="#FF4800" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    DolarApp: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" fill="#00D084" />
            <path d="M12 9v6M10 10.5h4M10 13.5h4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    Lemon: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#00E59B" />
            <circle cx="12" cy="12" r="6" fill="#ffffff" />
        </svg>
    ),
    Belo: ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#8C52FF" />
        </svg>
    ),
};

export const getProviderIcon = (provider: string, className: string = "w-5 h-5") => {
    const p = provider.toLowerCase();

    if (p.includes('mercado') || p.includes('mp')) return <ProviderLogos.MercadoPago className={className} />;
    if (p.includes('ual')) return <ProviderLogos.Uala className={className} />;
    if (p.includes('brubank')) return <ProviderLogos.Brubank className={className} />;
    if (p.includes('santander')) return <ProviderLogos.Santander className={className} />;
    if (p.includes('hsbc')) return <ProviderLogos.HSBC className={className} />;
    if (p.includes('binance')) return <ProviderLogos.Binance className={className} />;
    if (p.includes('payoneer')) return <ProviderLogos.Payoneer className={className} />;
    if (p.includes('dolarapp')) return <ProviderLogos.DolarApp className={className} />;
    if (p.includes('lemon')) return <ProviderLogos.Lemon className={className} />;
    if (p.includes('belo')) return <ProviderLogos.Belo className={className} />;

    // Fallbacks
    if (p.includes('bank') || p.includes('banco')) return <Landmark className={className} />;
    if (p.includes('card') || p.includes('tarjeta')) return <CreditCard className={className} />;
    if (p.includes('cash') || p.includes('efectivo')) return <Wallet className={className} />;
    if (p.includes('crypto') || p.includes('bit')) return <Coins className={className} />;

    return <Box className={className} />;
};

export const getProviderBrandColor = (provider: string) => {
    const p = provider.toLowerCase();
    if (p.includes('mercado') || p.includes('mp')) return "#009ee3";
    if (p.includes('ual')) return "#ff4c4c";
    if (p.includes('brubank')) return "#6C5CE7";
    if (p.includes('santander')) return "#EC0000";
    if (p.includes('hsbc')) return "#DB0011";
    if (p.includes('binance')) return "#F3BA2F";
    if (p.includes('payoneer')) return "#FF4800";
    if (p.includes('dolarapp')) return "#00D084";
    if (p.includes('lemon')) return "#00E59B";
    if (p.includes('belo')) return "#8C52FF";

    return "#ffffff";
};
