-- Create categories table for user-defined transaction categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('expense', 'income', 'investment', 'saving')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

-- Trigger to update updated_at on row modification
create or replace function update_categories_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_categories_updated_at on categories;
create trigger trg_update_categories_updated_at
before update on categories
for each row
execute procedure update_categories_updated_at();