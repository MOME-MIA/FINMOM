export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    price: number;
    category: 'service' | 'product' | 'subscription';
    tier: 'codex' | 'system' | 'dominion' | 'realm' | 'blueprint';
    features: string[];
    avpFactor: number; // Asset Value Pricing Factor
}

export const PIM_CATALOG: Product[] = [
    {
        id: 'p_001',
        sku: 'MOM-CODEX-PACK',
        name: 'The Codex Pack',
        description: 'Foundational brand architecture and visual identity system.',
        price: 2500,
        category: 'service',
        tier: 'codex',
        features: ['Brand Book', 'Logo System', 'Typography', 'Color Palette'],
        avpFactor: 1.2
    },
    {
        id: 'p_002',
        sku: 'MOM-SYS-ENG',
        name: 'The System Engine',
        description: 'Operational framework and process optimization.',
        price: 5000,
        category: 'service',
        tier: 'system',
        features: ['Process Mapping', 'Notion OS', 'Automation', 'Team Training'],
        avpFactor: 1.5
    },
    {
        id: 'p_003',
        sku: 'MOM-DOMINION',
        name: 'The Dominion',
        description: 'Full-scale digital transformation and market dominance strategy.',
        price: 12000,
        category: 'service',
        tier: 'dominion',
        features: ['Web Platform', 'Mobile App', 'Marketing Funnel', 'Analytics Suite'],
        avpFactor: 2.0
    },
    {
        id: 'p_004',
        sku: 'MOM-REALM',
        name: 'Realm Protocol',
        description: 'Decentralized infrastructure and blockchain integration.',
        price: 25000,
        category: 'service',
        tier: 'realm',
        features: ['Smart Contracts', 'Tokenomics', 'DAO Setup', 'Web3 Integration'],
        avpFactor: 3.0
    },
    {
        id: 'p_005',
        sku: 'MOM-BLUEPRINT',
        name: 'Phygital Blueprint',
        description: 'Bridging the physical and digital worlds for immersive experiences.',
        price: 50000,
        category: 'service',
        tier: 'blueprint',
        features: ['IoT Integration', 'AR/VR Experiences', 'Physical Space Design', 'Digital Twin'],
        avpFactor: 5.0
    }
];

export function getProductByTier(tier: Product['tier']): Product | undefined {
    return PIM_CATALOG.find(p => p.tier === tier);
}

export function calculateAVP(product: Product, costBasis: number): number {
    // AVP Formula: (Cost * 3) * Factor
    return (costBasis * 3) * product.avpFactor;
}
