-- Create transactions table for user financial transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  amount numeric not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  payment_method_id uuid references payment_methods(id) on delete set null,
  allocated_to_goal_id uuid references savings_goals(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to update updated_at on row modification
create or replace function update_transactions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_transactions_updated_at on transactions;
create trigger trg_update_transactions_updated_at
before update on transactions
for each row
execute procedure update_transactions_updated_at();