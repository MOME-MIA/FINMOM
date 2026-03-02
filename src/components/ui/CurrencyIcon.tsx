import React from 'react';
import type { CurrencyCode } from '@/types/finance';
import { cn } from '@/lib/utils';

interface CurrencyIconProps {
    code: CurrencyCode;
    className?: string;
}

export function CurrencyIcon({ code, className }: CurrencyIconProps) {
    const icons: Record<string, string> = {
        'ARS': 'https://flagcdn.com/ar.svg',
        'USD': 'https://flagcdn.com/us.svg',
        'EUR': 'https://flagcdn.com/eu.svg',
        'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
        'USDT': 'https://flagcdn.com/us.svg',
        'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    };

    const src = icons[code];

    if (src) {
        // Different styling for flags vs crypto logos
        const isCrypto = ['BTC', 'ETH'].includes(code);
        const isEth = code === 'ETH';
        return (
            <img
                src={src}
                alt={code}
                className={cn(
                    "rounded-full shadow-sm border border-white/5",
                    isCrypto ? "bg-white object-contain" : "object-cover",
                    isEth ? "p-[4px]" : isCrypto ? "p-0.5" : "",
                    className
                )}
            />
        );
    }

    return (
        <div className={cn("flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 text-white rounded-full border border-white/10 font-bold text-[10px] uppercase shadow-inner", className)}>
            {code.substring(0, 2)}
        </div>
    )
}
