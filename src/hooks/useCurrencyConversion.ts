import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrencyType } from '@/types/transaction';

// Optional: you can extract this fetcher to a separate api client file if preferred
const fetchExchangeRate = async (): Promise<number> => {
    try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.venta || 1000; // Fallback
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return 1000; // Safe fallback mapped to a common constant
    }
};

export function useCurrencyConversion(initialCurrency: CurrencyType = 'ARS') {
    // Using React Query with 5 minutes stale time
    const { data: exchangeRate = 1000, isLoading, isError } = useQuery({
        queryKey: ['exchangeRate', 'ars-usd-blue'],
        queryFn: fetchExchangeRate,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches
    });

    const [baseCurrency, setBaseCurrency] = useState<CurrencyType>(initialCurrency);
    const [baseAmount, setBaseAmount] = useState<string>('');

    const parsedAmount = parseFloat(baseAmount) || 0;

    const convertedAmount = useMemo(() => {
        if (baseCurrency === 'ARS') {
            return parsedAmount / exchangeRate;
        }
        return parsedAmount * exchangeRate;
    }, [parsedAmount, baseCurrency, exchangeRate]);

    const convertedCurrency: CurrencyType = baseCurrency === 'ARS' ? 'USD' : 'ARS';

    return {
        exchangeRate,
        isLoading,
        isError,
        baseCurrency,
        setBaseCurrency,
        baseAmount,
        setBaseAmount,
        convertedAmount,
        convertedCurrency,
    };
}
