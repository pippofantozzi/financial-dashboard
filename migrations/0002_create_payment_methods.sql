-- Create payment_methods table for user-defined payment methods
create table if not exists payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

-- Trigger to update updated_at on row modification
create or replace function update_payment_methods_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_payment_methods_updated_at on payment_methods;
create trigger trg_update_payment_methods_updated_at
before update on payment_methods
for each row
execute procedure update_payment_methods_updated_at();