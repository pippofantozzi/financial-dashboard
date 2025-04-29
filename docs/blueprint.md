# **App Name**: FinanceFlow

## Core Features:

- Extrato Upload: Enable users to upload bank statement PDFs and view pre-filled transaction tables for review and manual category assignment.
- Dynamic Category Management: Allow users to dynamically add, edit, and delete categories for transactions, accessible via dropdown menus.
- Financial Dashboard: Display a summary of monthly financial activity, including income, expenses, and net worth, in a clear and concise format.

## Style Guidelines:

- Primary color: A calming teal (#008080) to promote a sense of financial well-being.
- Secondary color: A light gray (#F0F0F0) for backgrounds and neutral elements.
- Accent color: A vibrant lime green (#32CD32) to highlight key actions and positive financial indicators.
- Clean and spacious layouts with clear visual hierarchy to aid in quick comprehension of financial data.
- Use a consistent set of minimalist icons to represent transaction categories and financial concepts.
- Subtle transitions and animations to provide feedback on user interactions and data updates.

## Original User Request:
Awesome, let's expand the plan, **cleaner and more powerful**, exactly as you asked — including:

- **Extrato Upload** (PDF bank extract → automatic expense parsing)
- **Dynamic Category Management** (easily add/remove categories)
- and everything else.

Here’s the full **updated** and **super detailed plan**:

---

# 🧠 App Plan — "Personal Finance Tracker"  
**Next.js + Clerk Auth + Supabase**

---

## 🎯 General Concept

An interactive finance dashboard where she:
- Adds transactions manually OR uploads her **extrato bancário (bank statement PDF)**.
- Sees summaries, charts, and full reports.
- Organizes money leftover into **investments** or **savings buckets** (ex: "Holiday 2025", "New Car").
- Dynamically manages her own **categories**.

---

## 🔐 Authentication (Clerk)
- User signup/login with **Clerk**.
- Clerk's user ID used across the app.

---

## 🗄️ Database (Supabase) — **Expanded Schema**

### Tables

1. **users**
   - id (UUID - Clerk)
   - email
   - name

2. **categories** (new!)
   - id (UUID)
   - user_id (FK to users.id)
   - name (text) — e.g., "Mercado", "Luxos", "Farmácia"
   - type (enum: `expense`, `income`, `investment`, `saving`)

3. **transactions**
   - id (UUID)
   - user_id (FK to users.id)
   - date (timestamp)
   - amount (decimal)
   - category_id (FK to categories.id)
   - payment_method (enum: `db`, `pb`, `cg`, `dg`)
   - description (text)

4. **monthly_summaries**
   - id (UUID)
   - user_id (FK to users.id)
   - month (int)
   - year (int)
   - total_income (decimal)
   - total_expenses (decimal)
   - net (decimal)
   - investment (decimal)
   - savings (decimal)
   - notes (text)
   - tldr (text)
   - full_report (text)

5. **savings_goals**
   - id (UUID)
   - user_id (FK to users.id)
   - title (varchar)
   - amount_saved (decimal)
   - target_amount (decimal)
   - due_date (optional)

6. **uploaded_files** (optional future expansion)
   - id (UUID)
   - user_id (FK)
   - file_url (Supabase Storage)
   - parsed_data (JSON)
   - upload_date (timestamp)

---

## 🧩 Pages and Core UX

### 1. **Login / Signup Page**
- Using Clerk
- Basic onboarding (what the app does in 2-3 lines)

---

### 2. **Dashboard (Home)**
- Overview cards:
  - Net This Month
  - Total Expenses
  - Total Income
  - Best Saving Month Badge
- Line chart: Net worth per month
- Pie chart: Expenses by category
- **Monthly TL;DR** section
- Button: **Full Report** → opens Sidebar

#### Current Chart Data Flow (Implementation Note - 28 Apr 2025):
- **Data Source:** Currently, all financial data (`transactions`, `categories`, `savingsGoals`, `monthlyBudget`) is **hardcoded as initial state** within the `src/app/dashboard/page.tsx` component. No external data fetching (e.g., from Supabase) is implemented yet.
- **Data Processing:**
    - The `calculateMonthlyData` helper function in `src/app/dashboard/page.tsx` takes the hardcoded data.
    - It groups transactions by month, calculates monthly income/expenses, aggregates expenses by category, and computes a running net worth.
    - This processed data is stored using `React.useMemo` for efficiency.
- **Chart-Specific Preparation:**
    - **Expenses vs Budget:** The card compares `latestMonthData.expenses` (derived from `calculateMonthlyData`) against the `monthlyBudget` state variable.
    - **Expenses Pie Chart:** The `expenseBreakdown` variable (derived from the monthly expense category aggregation in `calculateMonthlyData`) is passed to the `recharts` PieChart component. Colors are generated dynamically by the `chartConfigPie` function.

---

### 3. **Transactions Page**
- Table of transactions
- Filterable:
  - By Category
  - By Date
  - By Payment Method
- **Add Transaction Modal**:
  - Select Date
  - Amount
  - Category (Dropdown — **dynamic**)
    - ✨ Option: "**+ Add new category**" inside dropdown
  - Payment Method
  - Description

---

### 4. **Current Month Page** (NEW - Extrato Upload)
- Big CTA: **Upload Extrato (PDF)**
- Upload a PDF → Auto Parse:
  - Extract each line (Date, Description, Value)
  - Render a pre-filled table to review
  - Auto-suggest category "Uncategorized" initially
- Allow manual editing:
  - User can change categories inline before finalizing
- After confirmation → Save transactions to DB.

_(For now, parsing can be dummy: just read text lines and split columns. Later you can improve with better parsing.)_

---

### 5. **Savings/Investments Page**
- View existing savings goals
- Progress bars (current vs target)
- "Create New Saving Goal" button
- Allocate monthly net into a savings bucket

---

### 6. **Monthly Reports Page**
- Card list of all months
- Summary TL;DR for each
- Button: Full Artifact Report Sidebar
  - Styled like Claude artifact
  - Markdown-friendly
  - Plan for next month inside

---

## 🛠️ Core Features

- **Transaction Management**
  - Add manually
  - Edit/delete transactions
- **Dynamic Categories** 🔥
  - Add/Edit/Delete categories at any time
  - Use per transaction
- **Extrato Upload**
  - Upload a PDF
  - Render table
  - Edit before saving
- **Financial Dashboard**
  - Graphs and summaries
- **Monthly TL;DR + Full Report**
  - Auto-generated insights (dummy now)
- **Savings/Investments Buckets**
  - Move remaining net into goals

---

## 🛒 Components

- `TransactionTable`
- `TransactionModal`
- `ExtratoUpload`
- `ExtratoTablePreview`
- `MonthlySummaryCard`
- `SavingsGoalCard`
- `CategoryDropdown` (with "+ Add Category" inline)
- `FullReportSidebar`

---

## ✨ Future Ideas
- Parse CSV/OFX/JSON financial files too.
- Connect Open Finance APIs for auto sync.
- Predict next month's saving potential.
- AI Monthly Reports: real LLM summaries.
- Alerts (e.g., 80% budget warning).

---

# 📂 Suggested Next.js Folder Structure

```
/app
  /dashboard
  /transactions
  /current-month
  /savings
  /monthly-reports
  /auth (clerk)
  /components
    TransactionTable.tsx
    ExtratoUpload.tsx
    CategoryDropdown.tsx
    FullReportSidebar.tsx
    ...
  /lib
    supabaseClient.ts
    pdfParser.ts (for dummy parsing)
  /hooks
    useTransactions.ts
    useCategories.ts
    useSavings.ts
  /utils
    calculations.ts
    summaries.ts
  /styles
    globals.css
```

---

# 🚀 Priority MVP Development Plan

1. Set up Next.js project + TailwindCSS.
2. Add Clerk authentication.
3. Connect to Supabase.
4. Build basic Transactions page (manual input).
5. Build Categories (dynamic dropdowns).
6. Build basic Dashboard with summary data.
7. Build Extrato Upload dummy parser (PDF text extraction).
8. Build Monthly TL;DR + Full Report sidebar.
9. Build Savings Goals screen.
10. Polish & deploy (Vercel).

---

# 🏆 Final Thought

This would take her chaotic, slow, manual spreadsheet system →  
to a **clean, interactive, stress-free personal finance cockpit** —  
**where she spends less time typing and more time planning her future**.
  