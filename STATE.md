# Project State: Supabase Schema & Migrations

## Overview

The following database schema and migrations have been implemented for the FinanceFlow app, supporting all current features and future extensibility:

### Tables

- **user_profiles**: Stores user-specific settings (e.g., monthly budget).
- **categories**: User-defined transaction categories (expense, income, investment, saving).
- **payment_methods**: User-defined payment methods.
- **savings_goals**: User-defined savings/investment goals.
- **transactions**: All user financial transactions, linked to categories, payment methods, and optionally savings goals.
- **monthly_reports**: AI-generated and calculated monthly summaries and reports.

### Security

- **Row Level Security (RLS)** is enabled on all tables.
- Each table has policies for SELECT, INSERT, UPDATE, DELETE, ensuring users can only access and modify their own data.

### Migration Files

All migrations are located in the `migrations/` directory:

- `0000_create_user_profiles.sql`
- `0001_create_categories.sql`
- `0002_create_payment_methods.sql`
- `0003_create_savings_goals.sql`
- `0004_create_transactions.sql`
- `0005_create_monthly_reports.sql`
- `0006_enable_rls.sql`
- `0007_create_rls_policies.sql`

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ USER_PROFILES : has
    USERS ||--o{ CATEGORIES : defines
    USERS ||--o{ PAYMENT_METHODS : defines
    USERS ||--o{ SAVINGS_GOALS : defines
    USERS ||--o{ TRANSACTIONS : records
    USERS ||--o{ MONTHLY_REPORTS : generates

    USER_PROFILES {
        uuid user_id PK FK
        numeric monthly_budget
        timestamptz created_at
        timestamptz updated_at
    }

    CATEGORIES {
        uuid id PK
        uuid user_id FK
        text name
        text type "('expense', 'income', 'investment', 'saving')"
        timestamptz created_at
        timestamptz updated_at
    }

    PAYMENT_METHODS {
        uuid id PK
        uuid user_id FK
        text name
        timestamptz created_at
        timestamptz updated_at
    }

    SAVINGS_GOALS {
        uuid id PK
        uuid user_id FK
        text title
        numeric target_amount
        numeric amount_saved
        date due_date "Nullable"
        timestamptz created_at
        timestamptz updated_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        date date
        numeric amount
        text description "Nullable"
        uuid category_id FK "Nullable"
        uuid payment_method_id FK "Nullable"
        uuid allocated_to_goal_id FK "Nullable"
        timestamptz created_at
        timestamptz updated_at
    }

    MONTHLY_REPORTS {
        uuid id PK
        uuid user_id FK
        int month
        int year
        numeric total_income
        numeric total_expenses
        numeric net_amount
        numeric total_investment
        numeric total_savings
        text tldr_summary "Nullable"
        text full_report_markdown "Nullable"
        timestamptz generated_at
        timestamptz created_at
        timestamptz updated_at
    }

    CATEGORIES ||--o{ TRANSACTIONS : categorizes
    PAYMENT_METHODS ||--o{ TRANSACTIONS : used_by
    SAVINGS_GOALS ||--o{ TRANSACTIONS : allocated_from
```

---

## Next Steps

- Run these migrations on your Supabase/Postgres instance to initialize the schema.
- Integrate Supabase client logic in your Next.js app to use these tables.
- Extend as needed for future features (e.g., chatbot conversation history, per-category budgets, etc).