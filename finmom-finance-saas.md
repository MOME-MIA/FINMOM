# FinMom: Premium Financial SaaS

## Overview
FinMom is an all-in-one personal and entrepreneurial financial management SaaS. It solves the pain point of fragmented financial tracking, especially for freelancers dealing with multiple currencies, platforms (Payoneer, Binance, Mercado Pago), and complex withdrawal routes with varying commissions. Target audience is B2C (individual users) expecting a premium, Apple/Samsung-tier minimalist aesthetic (professional, reliable, clean).

## Project Type
WEB (Next.js, React) + BACKEND (Supabase) + Database

## Success Criteria
- User can manage multiple accounts across different currencies and platforms.
- User can record and track complex income routes (e.g., EUR to USD to ARS with commission tracking).
- Dashboard provides a clear, high-level summary of financial health (Income, Fixed Expenses, Savings, Free to Spend).
- Weekly withdrawal planner function works correctly.
- Application has a premium, dark-mode-first aesthetic (removing shadows, clean lines, professional typography).
- MVP includes Freemium tier database architecture and limits, with preparation for Mercado Pago/Binance payment webhook integrations.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS (CSS-first, no templates).
- **Backend/Auth/DB:** Insforge (Auth, Database, Storage).
- **Payments:** APIs for Mercado Pago and Binance Pay (prep for v2).

## File Structure (Current & Planned)
```
src/
├── app/
│   ├── (auth)/         # Login, Register
│   ├── (dashboard)/    # Dashboard, Accounts, Income, Expenses, Withdrawals, Settings
│   ├── api/            # Webhooks for payments
│   └── layout.tsx
├── components/
│   ├── ui/             # Reusable aesthetic components (cards, inputs, buttons)
│   ├── dashboard/      # Specific widgets
│   └── forms/          # Reusable forms
├── lib/
│   ├── insforge/       # DB client
│   └── utils/          # Currency conversion, date formatting
└── types/              # TS interfaces (Finance, DB schemas)
```

## Task Breakdown

### Phase 1: Foundation & Database Schema
1. **[database-architect] Design initial InsForge schema**
   - Tables for: `accounts` (balances, currency), `transactions` (income/expenses with recurrence support), `withdrawals_plan`, `user_tiers`.
   - INPUT: MVP Requirements -> OUTPUT: SQL Schema -> VERIFY: Valid SQL, RLS configured.
2. **[backend-specialist] Configure InsForge Services**
   - Update `src/lib/insforge.ts` and create base client data-fetching services.
   - INPUT: SQL Schema -> OUTPUT: TS helper functions -> VERIFY: No TS errors.

### Phase 2: Core Entities Admin (CRUD & Layouts)
3. **[frontend-specialist] Accounts & Platforms Admin**
   - UI/Logic for managing accounts (Payoneer, Binance, Bank, Cash) and their currencies.
   - INPUT: DB Schema -> OUTPUT: Working UI -> VERIFY: Can CRUD accounts.
4. **[frontend-specialist] Expenses & Income Admin**
   - Forms to add variable/fixed expenses, subscriptions (X of X installments), and income tracking.
   - INPUT: Form designs -> OUTPUT: Working UI -> VERIFY: Can CRUD transactions accurately.

### Phase 3: Advanced Business Logic
5. **[frontend-specialist] Weekly Withdrawal Planner**
   - Unique feature to plan weekly withdrawals from USD/EUR to local currency, tracking remaining balances, exchange rates, and commission costs.
   - INPUT: User logic examples -> OUTPUT: Interactive Planner UI -> VERIFY: Calculations balance correctly against Fixed Expenses and Total Income.
6. **[frontend-specialist] Financial DNA Dashboard**
   - High-level summary widgets (Balance, Savings %, Total Expenses, vs Income).
   - INPUT: Transaction data -> OUTPUT: Dashboard UI -> VERIFY: Aggregation numbers match raw data.

### Phase 4: Polish & Monetization Prep
7. **[backend-specialist] Freemium Limits Logic**
   - Add DB functions or middleware checks before allowing new account/transaction creation based on user tier.
   - INPUT: Tier specs -> OUTPUT: Row Level Security / RPCs -> VERIFY: Free user gets blocked on limit.
8. **[frontend-specialist] UI/UX Refinement (Apple/Samsung standards)**
   - Audit colors, spacing (safe areas), and typography across the new pages. Clean, minimalistic, trusting.
   - INPUT: UI Audit -> OUTPUT: Polished CSS -> VERIFY: `ux_audit.py` passes (or manual equivalent).

## ✅ Phase X: Verification (To Be Done at end of task)
- [ ] Lint: `npm run lint` && `npx tsc --noEmit`
- [ ] Security/Audit: Manual check for unsecure DB queries.
- [ ] UI Rules: No purple/violet, no standard UI templates, clean spacing.
- [ ] Build: `npm run build`
