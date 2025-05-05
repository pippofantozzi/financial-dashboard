-- Create user_profiles table for storing user-specific settings (e.g., monthly budget)
create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  monthly_budget numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to update updated_at on row modification
create or replace function update_user_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_user_profiles_updated_at on user_profiles;
create trigger trg_update_user_profiles_updated_at
before update on user_profiles
for each row
execute procedure update_user_profiles_updated_at();