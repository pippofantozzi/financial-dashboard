-- Create monthly_reports table for storing AI-generated and calculated monthly summaries
create table if not exists monthly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month int not null check (month >= 1 and month <= 12),
  year int not null,
  total_income numeric not null default 0,
  total_expenses numeric not null default 0,
  net_amount numeric not null default 0,
  total_investment numeric not null default 0,
  total_savings numeric not null default 0,
  tldr_summary text,
  full_report_markdown text,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

-- Trigger to update updated_at on row modification
create or replace function update_monthly_reports_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_update_monthly_reports_updated_at on monthly_reports;
create trigger trg_update_monthly_reports_updated_at
before update on monthly_reports
for each row
execute procedure update_monthly_reports_updated_at();