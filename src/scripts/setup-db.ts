import { Client } from 'pg';

const connectionString = 'postgresql://postgres:NN8t9trc2Tn9UH9G@db.qedwthvraajexelsgzvt.supabase.co:5432/postgres';

const schema = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    currency TEXT NOT NULL,
    initial_balance NUMERIC NOT NULL DEFAULT 0,
    current_balance NUMERIC NOT NULL DEFAULT 0,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TEXT NOT NULL, 
    type TEXT NOT NULL,
    amount_ars NUMERIC DEFAULT 0,
    amount_usd NUMERIC DEFAULT 0,
    category TEXT,
    description TEXT,
    payment_method TEXT,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    recurring_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    category TEXT,
    frequency TEXT NOT NULL,
    next_due_date TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    type TEXT NOT NULL DEFAULT 'Gasto Fijo',
    last_generated TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    budget_limit NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monthly_records (
    month TEXT PRIMARY KEY,
    ingresos_totales NUMERIC DEFAULT 0,
    ahorros NUMERIC DEFAULT 0,
    inversiones NUMERIC DEFAULT 0,
    fixed_expenses JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
`;

async function setup() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to PostgreSQL...');
        await client.query(schema);
        console.log('Schema created successfully.');
    } catch (error) {
        console.error('Error setting up the database:', error);
    } finally {
        await client.end();
    }
}

setup();
