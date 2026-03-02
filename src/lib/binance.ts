export interface CryptoPrice {
    symbol: string;
    price: string;
}

export async function getMarketPrices(symbols: string[] = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT"]): Promise<Record<string, number>> {
    try {
        // Binance public API for ticker prices
        // We can fetch all or specific symbols. For efficiency with small lists, we can use individual requests or filter a larger list.
        // The endpoint /api/v3/ticker/price returns all if no symbol provided, or specific one.
        // For multiple specific symbols, it's often easier to fetch all (lightweight) or make parallel requests.
        // Let's try fetching all and filtering, it's usually fast enough.

        const response = await fetch("https://api.binance.com/api/v3/ticker/price", {
            next: { revalidate: 10 } // Cache for 10 seconds
        });

        if (!response.ok) {
            throw new Error("Failed to fetch crypto prices");
        }

        const data: CryptoPrice[] = await response.json();

        const priceMap: Record<string, number> = {};

        data.forEach(item => {
            if (symbols.includes(item.symbol)) {
                priceMap[item.symbol] = parseFloat(item.price);
            }
        });

        return priceMap;
    } catch (error) {
        console.error("Binance API Error:", error);
        return {};
    }
}

export const POPULAR_SYMBOLS = [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "AVAXUSDT",
    "DOTUSDT",
    "MATICUSDT"
];
