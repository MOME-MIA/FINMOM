-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE subscription_tier AS ENUM ('free', 'pro');
CREATE TYPE account_type AS ENUM ('cash', 'bank', 'credit', 'crypto', 'investment');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- 2. TABLES

-- PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  
  -- SaaS Freemium Fields
  subscription_tier subscription_tier DEFAULT 'free'::subscription_tier,
  subscription_status TEXT DEFAULT 'active', -- active, past_due, canceled
  payment_provider TEXT, -- 'mercadopago', 'binance'
  provider_subscription_id TEXT, -- e.g. MP preapproval_id or similar
  trial_end_at TIMESTAMP WITH TIME ZONE,
  subscription_end_at TIMESTAMP WITH TIME ZONE,
  
  -- Meta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type transaction_type NOT NULL,
  color TEXT DEFAULT '#808080',
  icon TEXT DEFAULT 'tag',
  is_system BOOLEAN DEFAULT false, -- For default categories created by the app
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ACCOUNTS (Wallets/Banks/Crypto)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type account_type DEFAULT 'cash'::account_type,
  balance NUMERIC(15, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  color TEXT DEFAULT '#000000',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- Null if not recurring, e.g. 'monthly', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS (Row Level Security)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING ( auth.uid() = id );

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id );

-- Policies for Categories
CREATE POLICY "Users can see own categories"
ON public.categories FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own categories"
ON public.categories FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own categories"
ON public.categories FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own categories"
ON public.categories FOR DELETE
USING ( auth.uid() = user_id );

-- Policies for Accounts
CREATE POLICY "Users can see own accounts"
ON public.accounts FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own accounts"
ON public.accounts FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own accounts"
ON public.accounts FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own accounts"
ON public.accounts FOR DELETE
USING ( auth.uid() = user_id );

-- Policies for Transactions
CREATE POLICY "Users can see own transactions"
ON public.transactions FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own transactions"
ON public.transactions FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own transactions"
ON public.transactions FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own transactions"
ON public.transactions FOR DELETE
USING ( auth.uid() = user_id );

-- 4. TRIGGERS

-- Set updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create profile trigger for new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.profile->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating to prevent duplicate errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional: Function to update account balances on transaction insert/update/delete
-- (This can be handled via frontend aggregation or a DB trigger. Let's do it on DB for robust backend)
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Revert old amount
        IF OLD.type = 'income' THEN
            UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
        
        -- Apply new amount
        IF NEW.type = 'income' THEN
            UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSE
            UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_transaction_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW EXECUTE PROCEDURE update_account_balance();
