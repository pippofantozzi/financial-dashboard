-- Enable Row Level Security (RLS) on all user tables
alter table user_profiles enable row level security;
alter table categories enable row level security;
alter table payment_methods enable row level security;
alter table savings_goals enable row level security;
alter table transactions enable row level security;
alter table monthly_reports enable row level security;