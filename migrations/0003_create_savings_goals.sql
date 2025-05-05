-- Create savings_goals table for user-defined savings and investment goals
create table if not exists savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric not null,
  amount_saved numeric not null default 0,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to update updated_at on row modification
create or replace function update_savings_goals_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_savings_goals_updated_at on savings_goals;
create trigger trg_update_savings_goals_updated_at
before update on savings_goals
for each row
execute procedure update_savings_goals_updated_at();