-- RLS policies for user_profiles
create policy "Allow user to view own profile"
  on user_profiles for select
  using (auth.uid() = user_id);

create policy "Allow user to insert own profile"
  on user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update own profile"
  on user_profiles for update
  using (auth.uid() = user_id);

create policy "Allow user to delete own profile"
  on user_profiles for delete
  using (auth.uid() = user_id);

-- RLS policies for categories
create policy "Allow user to view own categories"
  on categories for select
  using (auth.uid() = user_id);

create policy "Allow user to insert own categories"
  on categories for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update own categories"
  on categories for update
  using (auth.uid() = user_id);

create policy "Allow user to delete own categories"
  on categories for delete
  using (auth.uid() = user_id);

-- RLS policies for payment_methods
create policy "Allow user to view own payment methods"
  on payment_methods for select
  using (auth.uid() = user_id);

create policy "Allow user to insert own payment methods"
  on payment_methods for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update own payment methods"
  on payment_methods for update
  using (auth.uid() = user_id);

create policy "Allow user to delete own payment methods"
  on payment_methods for delete
  using (auth.uid() = user_id);

-- RLS policies for savings_goals
create policy "Allow user to view own savings goals"
  on savings_goals for select
  using (auth.uid() = user_id);

create policy "Allow user to insert own savings goals"
  on savings_goals for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update own savings goals"
  on savings_goals for update
  using (auth.uid() = user_id);

create policy "Allow user to delete own savings goals"
  on savings_goals for delete
  using (auth.uid() = user_id);

-- RLS policies for transactions
create policy "Allow user to view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Allow user to insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Allow user to delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- RLS policies for monthly_reports
create policy "Allow user to view own monthly reports"
  on monthly_reports for select
  using (auth.uid() = user_id);

create policy "Allow user to insert own monthly reports"
  on monthly_reports for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update own monthly reports"
  on monthly_reports for update
  using (auth.uid() = user_id);

create policy "Allow user to delete own monthly reports"
  on monthly_reports for delete
  using (auth.uid() = user_id);