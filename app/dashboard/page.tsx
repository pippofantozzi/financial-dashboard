'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, ReferenceLine, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, Label } from 'recharts';
import { Badge } from '../../components/ui/badge';
import { ArrowUpRight, ArrowDownRight, DollarSign, Award, TrendingUp, TrendingDown, Settings, PieChart as PieChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'; // For chart toggle
import { Input } from '../../components/ui/input'; // For budget setting
import { Label as InputLabel } from '../../components/ui/label'; // For budget setting label
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog'; // For budget setting modal
import { format, parseISO, getMonth, getYear, lastDayOfMonth } from 'date-fns';

// --- State Definitions (Simulated - Replace with global state/context) ---
type Transaction = {
    id: string;
    date: string; // YYYY-MM-DD
    amount: number;
    category_id: string;
    payment_method: string;
    description?: string;
    allocated_to_goal_id?: string | null;
};

type Category = {
    id: string;
    name: string;
    type: 'expense' | 'income' | 'investment' | 'saving';
};

interface SavingsGoal {
  id: string;
  title: string;
  amount_saved: number;
  target_amount: number;
  due_date?: string | null;
}

// Initial Dummy Data (Same as other pages for consistency)
const initialCategories: Category[] = [
    { id: 'cat-mercado', name: 'Mercado', type: 'expense' },
    { id: 'cat-luxos', name: 'Luxos', type: 'expense' },
    { id: 'cat-farmacia', name: 'Farmácia', type: 'expense' },
    { id: 'cat-transporte', name: 'Transporte', type: 'expense' },
    { id: 'cat-salario', name: 'Salário', type: 'income' },
    { id: 'cat-invest', name: 'Investimentos', type: 'investment' },
    { id: 'cat-poupanca', name: 'Poupança Viagem', type: 'saving' },
    { id: 'cat-uncat', name: 'Uncategorized', type: 'expense' },
    { id: 'cat-freela', name: 'Freelance Income', type: 'income' },
    { id: 'cat-other-exp', name: 'Outros', type: 'expense' },
    { id: 'cat-rent', name: 'Rent', type: 'expense' },
    { id: 'cat-utilities', name: 'Utilities', type: 'expense' },
    { id: 'cat-dining', name: 'Dining Out', type: 'expense' },
];

const initialTransactions: Transaction[] = [
  // April 2025 (Added for Chart Demo)
  { id: 't-apr1', date: '2025-04-02', amount: -150.75, category_id: 'cat-mercado', payment_method: 'db' },
  { id: 't-apr2', date: '2025-04-05', amount: -80.00, category_id: 'cat-dining', payment_method: 'cg' },
  { id: 't-apr3', date: '2025-04-10', amount: -45.50, category_id: 'cat-transporte', payment_method: 'dg' },
  { id: 't-apr4', date: '2025-04-12', amount: -200.00, category_id: 'cat-luxos', payment_method: 'cg' },
  { id: 't-apr5', date: '2025-04-15', amount: 5000.00, category_id: 'cat-salario', payment_method: 'pb' }, // Income for April

  // July (Current Month)
  { id: 't-july1', date: '2024-07-05', amount: -85.50, category_id: 'cat-mercado', payment_method: 'db' },
  { id: 't-july2', date: '2024-07-03', amount: -1200.00, category_id: 'cat-rent', payment_method: 'pb' },
  { id: 't-july3', date: '2024-07-02', amount: -75.00, category_id: 'cat-dining', payment_method: 'cg' },
  { id: 't-july4', date: '2024-07-01', amount: -150.00, category_id: 'cat-utilities', payment_method: 'pb' },
  { id: 't-july5', date: '2024-07-06', amount: 3800.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: 't-july6', date: '2024-07-08', amount: -40.00, category_id: 'cat-transporte', payment_method: 'dg' },
  { id: 't-july7', date: '2024-07-10', amount: -60.00, category_id: 'cat-luxos', payment_method: 'cg' },
  { id: 't-july8', date: '2024-07-12', amount: -25.00, category_id: 'cat-farmacia', payment_method: 'db' },
  // June
  { id: 't1', date: '2024-06-15', amount: -55.30, category_id: 'cat-mercado', payment_method: 'db' },
  { id: 't2', date: '2024-06-14', amount: -120.00, category_id: 'cat-luxos', payment_method: 'cg' },
  { id: 't3', date: '2024-06-13', amount: 3500.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: 't4', date: '2024-06-12', amount: -35.80, category_id: 'cat-farmacia', payment_method: 'db' },
  { id: 't5', date: '2024-06-10', amount: -70.00, category_id: 'cat-transporte', payment_method: 'dg' },
  { id: 't6', date: '2024-06-20', amount: -250.00, category_id: 'cat-invest', payment_method: 'pb', allocated_to_goal_id: 'goal-emergency'}, // Investment/Saving tracked by goal
  // May
  { id: 't7', date: '2024-05-20', amount: 4000.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: 't8', date: '2024-05-25', amount: 500.00, category_id: 'cat-freela', payment_method: 'pb' },
  { id: 't9', date: '2024-05-15', amount: -180.00, category_id: 'cat-mercado', payment_method: 'db' },
  { id: 't10', date: '2024-05-10', amount: -50.00, category_id: 'cat-transporte', payment_method: 'dg' },
  { id: 't11', date: '2024-05-28', amount: -300.00, category_id: 'cat-luxos', payment_method: 'cg' },
   { id: 't18', date: '2024-05-30', amount: -100.00, category_id: 'cat-invest', payment_method: 'pb', allocated_to_goal_id: 'goal-car'},
  // April
  { id: 't12', date: '2024-04-15', amount: 3800.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: 't13', date: '2024-04-10', amount: -220.50, category_id: 'cat-mercado', payment_method: 'db' },
  { id: 't14', date: '2024-04-22', amount: -60.00, category_id: 'cat-transporte', payment_method: 'dg' },
  { id: 't15', date: '2024-04-25', amount: -150.00, category_id: 'cat-other-exp', payment_method: 'pb' }, // Other expense
  // March
  { id: 't16', date: '2024-03-15', amount: 3750.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: 't17', date: '2024-03-20', amount: -200.00, category_id: 'cat-mercado', payment_method: 'db' },
];

const initialSavingsGoals: SavingsGoal[] = [
  { id: 'goal-holiday', title: 'Holiday 2025', amount_saved: 1250.50, target_amount: 5000.00, due_date: '2025-12-01' },
  { id: 'goal-car', title: 'New Car Down Payment', amount_saved: 8800.00, target_amount: 15000.00, due_date: null }, // 8700 + 100
  { id: 'goal-emergency', title: 'Emergency Fund', amount_saved: 3250.00, target_amount: 10000.00, due_date: null }, // 3000 + 250
];
// --- End State Definitions ---


// --- Helper Functions ---
const calculateUnallocatedCash = (transactions: Transaction[], goals: SavingsGoal[], categories: Category[]): number => {
   const totalIncome = transactions
       .filter(tx => {
           const category = categories.find(c => c.id === tx.category_id);
           return category?.type === 'income' || tx.amount > 0; // Count explicit income categories or any positive amount
       })
       .reduce((sum, tx) => sum + tx.amount, 0);

   // Sum expenses: category type 'expense' AND amount is negative
   const totalGeneralExpenses = transactions
       .filter(tx => {
           const category = categories.find(c => c.id === tx.category_id);
           // Count if explicitly 'expense' type AND negative amount
           return category?.type === 'expense' && tx.amount < 0;
       })
       .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

   // Sum outflows categorized as 'investment' or 'saving' AND negative amount, NOT already linked to a goal
   const totalUnallocatedSavingsInvestments = transactions
       .filter(tx => {
            const category = categories.find(c => c.id === tx.category_id);
            return category && (category.type === 'investment' || category.type === 'saving') && tx.amount < 0 && !tx.allocated_to_goal_id;
        })
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Sum outflows with UNKNOWN category and negative amount
    const totalUncategorizedExpenses = transactions
        .filter(tx => !categories.some(c => c.id === tx.category_id) && tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);


   const totalManuallySavedInGoals = goals.reduce((sum, goal) => sum + goal.amount_saved, 0);

   // Refined calculation: Income - (Expenses + Unallocated Savings/Investments + Uncategorized Expenses + Goal Allocations)
   const netUnallocated = totalIncome - totalGeneralExpenses - totalUnallocatedSavingsInvestments - totalUncategorizedExpenses - totalManuallySavedInGoals;

   return Math.max(0, netUnallocated); // Ensure non-negative result
};


const calculateMonthlyData = (transactions: Transaction[], categories: Category[], goals: SavingsGoal[]) => {
    const monthlyData: { [key: string]: { month: string; income: number; expenses: number; netWorth: number } } = {};
    const monthlyExpenseByCategory: { [key: string]: { [categoryName: string]: number } } = {};


    // Group transactions by month (YYYY-MM)
    const transactionsByMonth: { [key: string]: Transaction[] } = {};
    transactions.forEach(tx => {
        const monthKey = tx.date.substring(0, 7); // YYYY-MM
        if (!transactionsByMonth[monthKey]) {
            transactionsByMonth[monthKey] = [];
        }
        transactionsByMonth[monthKey].push(tx);
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(transactionsByMonth).sort();

    // Calculate net worth at the START of the first month with data
    const firstMonthKey = sortedMonths.length > 0 ? sortedMonths[0] : format(new Date(), 'yyyy-MM'); // Handle no transactions case
    const firstMonthDate = parseISO(`${firstMonthKey}-01T00:00:00`);
    const firstMonthLabel = format(firstMonthDate, 'MMM');
    const initialGoalTotal = goals.reduce((sum, g) => sum + g.amount_saved, 0); // Initial goal state

    // Calculate initial unallocated cash based on transactions BEFORE the first month
     const transactionsBeforeFirstMonth = transactions.filter(tx => tx.date < `${firstMonthKey}-01`);
     const initialUnallocated = calculateUnallocatedCash(transactionsBeforeFirstMonth, goals, categories);
     const initialNetWorth = initialUnallocated + initialGoalTotal;


    monthlyData[`${firstMonthLabel}-Start`] = {
         month: `${firstMonthLabel}-Start`,
         income: 0,
         expenses: 0,
         netWorth: initialNetWorth,
     };

    let runningNetWorth = initialNetWorth; // Start with net worth before the first month's transactions

    sortedMonths.forEach(monthKey => {
        const monthTransactions = transactionsByMonth[monthKey];
        const monthDate = parseISO(`${monthKey}-01T00:00:00`);
        const monthLabel = format(monthDate, 'MMM');

        if (!monthlyData[monthLabel]) {
           monthlyData[monthLabel] = { month: monthLabel, income: 0, expenses: 0, netWorth: runningNetWorth }; // Initialize with previous net worth
           monthlyExpenseByCategory[monthKey] = {};
         }

        let monthIncome = 0;
        let monthExpenses = 0;

        monthTransactions.forEach(tx => {
            const category = categories.find(c => c.id === tx.category_id);
            const amount = tx.amount;

            if (category?.type === 'income' || (!category && amount > 0)) {
                monthIncome += amount;
            } else if (category?.type === 'expense' || (!category && amount < 0)) {
                 monthExpenses += Math.abs(amount);
                 // Track expenses by category for the pie chart
                 const catName = category?.name || 'Uncategorized';
                 if (!monthlyExpenseByCategory[monthKey]) monthlyExpenseByCategory[monthKey] = {};
                 monthlyExpenseByCategory[monthKey][catName] = (monthlyExpenseByCategory[monthKey][catName] || 0) + Math.abs(amount);
            }
            // Savings/Investment categories contribute to net worth change but aren't typically 'expenses'
            // unless we decide to track them that way for budgeting.
            // The net worth calculation will implicitly handle them via the unallocated cash calculation at month end.
        });

        // Net change for the month's transactions
        const netChange = monthIncome - monthExpenses - monthTransactions
            .filter(tx => {
                const cat = categories.find(c => c.id === tx.category_id);
                // Include savings/investments outflows in net change calculation
                return cat && (cat.type === 'investment' || cat.type === 'saving') && tx.amount < 0;
            })
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        runningNetWorth += netChange; // Update running net worth based *only* on this month's transaction flows

        // Update monthly data
        monthlyData[monthLabel].income += monthIncome;
        monthlyData[monthLabel].expenses += monthExpenses;
        monthlyData[monthLabel].netWorth = runningNetWorth; // Set the end-of-month net worth
    });

     // --- Fill Missing Months & Final Sort ---
     const finalChartData = [];
     const lastTxDate = transactions.length > 0 ? parseISO(transactions.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())[0].date + 'T00:00:00') : new Date();
     let currentDate = transactions.length > 0 ? parseISO(sortedMonths[0] + '-01T00:00:00') : new Date(new Date().getFullYear(), 0, 1);
     const endDate = lastTxDate > new Date() ? lastDayOfMonth(lastTxDate) : lastDayOfMonth(new Date());

     // Add the initial starting point
     if (monthlyData[`${firstMonthLabel}-Start`]) {
         finalChartData.push({ ...monthlyData[`${firstMonthLabel}-Start`], month: firstMonthLabel });
     }

     let lastKnownNetWorth = initialNetWorth; // Start with net worth before the first month's transactions

     while (currentDate <= endDate) {
         const monthLabel = format(currentDate, 'MMM');
         const monthKey = format(currentDate, 'yyyy-MM');

         if (monthlyData[monthLabel] && monthlyData[monthLabel].month !== `${firstMonthLabel}-Start`) {
            finalChartData.push(monthlyData[monthLabel]);
            lastKnownNetWorth = monthlyData[monthLabel].netWorth;
         } else if (!monthlyData[monthLabel] && finalChartData.length > 0) {
             // Month exists in range but had no transactions, carry forward net worth
             finalChartData.push({
                 month: monthLabel,
                 income: 0,
                 expenses: 0,
                 netWorth: lastKnownNetWorth, // Carry over last known net worth
             });
         }
         currentDate.setMonth(currentDate.getMonth() + 1);
     }

    // --- Calculate Expense Breakdown for the *Current* Month ---
    const currentMonthKey = format(new Date(), 'yyyy-MM');
    const currentMonthExpensesByCategory = monthlyExpenseByCategory[currentMonthKey] || {};
    const expenseBreakdown = Object.entries(currentMonthExpensesByCategory)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Sort descending by value


    return {
        monthlyChartData: finalChartData.filter(d => d.month !== `${firstMonthLabel}-Start`), // Exclude the start point for line chart
        expenseBreakdown,
    };
};

// --- End Helper Functions ---


// --- Chart Configuration ---
const chartConfigNetWorth = {
  netWorth: { label: 'Net Worth', color: 'hsl(var(--chart-1))' },
};
const chartConfigExpenses = {
  expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
  budget: { label: 'Budget', color: 'hsl(var(--destructive))' },
};
const chartConfigPie = (expenseBreakdown: {name: string; value: number}[]) => {
   const config: Record<string, { label: string; color: string }> = {};
   const colors = [
       'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))',
       'hsl(var(--chart-4))', 'hsl(var(--chart-5))',
       // Add more distinct colors if needed
       'hsl(195 53% 79%)', 'hsl(173 57% 57%)', 'hsl(32 95% 66%)', 'hsl(263 60% 64%)'
   ];
   expenseBreakdown.forEach((item, index) => {
       config[item.name] = { label: item.name, color: colors[index % colors.length] };
   });
   return config;
};


export default function DashboardPage() {
  // State Hooks
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [savingsGoals, setSavingsGoals] = React.useState<SavingsGoal[]>(initialSavingsGoals);
  const [monthlyBudget, setMonthlyBudget] = React.useState<number>(2500); // Default budget increased
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [tempBudget, setTempBudget] = React.useState<number | string>(monthlyBudget);
  const [chartType, setChartType] = React.useState<'netWorth' | 'expenses'>('netWorth');


  // Derived Data Calculations using useMemo
  const netUnallocatedCash = React.useMemo(() => calculateUnallocatedCash(transactions, savingsGoals, categories), [transactions, savingsGoals, categories]);
  const totalSavedInGoals = React.useMemo(() => savingsGoals.reduce((sum, goal) => sum + goal.amount_saved, 0), [savingsGoals]);


  const { monthlyChartData, expenseBreakdown } = React.useMemo(() => calculateMonthlyData(transactions, categories, savingsGoals), [transactions, categories, savingsGoals]);

  const currentNetWorth = monthlyChartData.length > 0 ? monthlyChartData[monthlyChartData.length - 1].netWorth : (netUnallocatedCash + totalSavedInGoals); // Use calculated EOM or initial if no data

  // Extract latest month's summary data
  const currentMonthDate = new Date();
  const currentMonthLabel = format(currentMonthDate, 'MMM');
  const latestMonthData = monthlyChartData.find(d => d.month === currentMonthLabel) || { income: 0, expenses: 0 };
  const netThisMonth = latestMonthData.income - latestMonthData.expenses;

  const monthlySummaryTldr = `Net this month: R$ ${netThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Income: R$ ${latestMonthData.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, Expenses: R$ ${latestMonthData.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;


  // --- Budget Modal Handlers ---
  const handleOpenBudgetModal = () => {
      setTempBudget(monthlyBudget); // Initialize modal with current budget
      setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = () => {
      const budgetNum = parseFloat(String(tempBudget));
      if (!isNaN(budgetNum) && budgetNum >= 0) {
          setMonthlyBudget(budgetNum);
          setIsBudgetModalOpen(false);
           // TODO: Add toast notification
      } else {
          // TODO: Show error in modal or toast
           alert("Please enter a valid non-negative number for the budget.");
      }
  };
  // --- End Budget Modal Handlers ---

   // Config for Pie Chart
   const pieConfig = React.useMemo(() => chartConfigPie(expenseBreakdown), [expenseBreakdown]);
   const totalCurrentMonthExpenses = expenseBreakdown.reduce((sum, item) => sum + item.value, 0);


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          {/* Budget Setting Button */}
          <Button variant="outline" size="sm" onClick={handleOpenBudgetModal}>
               <Settings className="mr-2 h-4 w-4" /> Set Monthly Budget
          </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Current Net Worth</CardTitle>
                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
                 <div className="text-2xl font-bold">R$ {currentNetWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                 <p className="text-xs text-muted-foreground">Incl. savings & unallocated cash</p>
             </CardContent>
         </Card>
         <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
                 <ArrowDownRight className="h-4 w-4 text-destructive" />
             </CardHeader>
             <CardContent>
                 <div className="text-2xl font-bold">R$ {latestMonthData.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                 <p className="text-xs text-muted-foreground">Budget: R$ {monthlyBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
             </CardContent>
         </Card>
         <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Total Income (This Month)</CardTitle>
                 <ArrowUpRight className="h-4 w-4 text-green-600" />
             </CardHeader>
             <CardContent>
                 <div className="text-2xl font-bold">R$ {latestMonthData.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                 {/* <p className="text-xs text-muted-foreground">+5.2% from last month</p> */}
             </CardContent>
         </Card>
         <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Net Unallocated Cash</CardTitle>
                 <DollarSign className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">R$ {netUnallocatedCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Available to allocate</p>
             </CardContent>
         </Card>
      </div>

      {/* Main Content Area: Charts and TLDR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Line Chart and TLDR */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Line Chart Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle>{chartType === 'netWorth' ? 'Net Worth Over Time' : 'Monthly Expenses vs Budget'}</CardTitle>
                        <CardDescription>Visualize your financial trends.</CardDescription>
                    </div>
                    {/* Chart Type Toggle */}
                    <Select value={chartType} onValueChange={(value) => setChartType(value as 'netWorth' | 'expenses')}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Select Chart Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="netWorth">Net Worth</SelectItem>
                            <SelectItem value="expenses">Expenses vs Budget</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="h-[350px] p-0 pl-2 pr-4 pb-2">
                    <ChartContainer config={chartType === 'netWorth' ? chartConfigNetWorth : chartConfigExpenses} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'netWorth' ? (
                                <LineChart data={monthlyChartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} domain={['auto', 'auto']} />
                                    <ChartTooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="netWorth" stroke="var(--color-netWorth)" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'hsl(var(--background))', stroke: "var(--color-netWorth)" }} name="Net Worth"/>
                                </LineChart>
                            ) : (
                                <LineChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} tickFormatter={(value) => `R$${value/1000}k`} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                    <Line
                                        dataKey="expenses"
                                        type="monotone"
                                        stroke="var(--color-expenses)"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: 'var(--color-expenses)', strokeWidth: 1, stroke: 'var(--color-expenses)' }}
                                        activeDot={{ r: 6 }}
                                        name="Expenses"
                                    />
                                    <ReferenceLine
                                        y={monthlyBudget}
                                        stroke="hsl(var(--chart-3))" // Using a generic chart color for budget
                                        strokeDasharray="3 3"
                                        strokeWidth={1}
                                    >
                                        <Label value={`Budget: R$${monthlyBudget.toLocaleString()}`} position="insideTopRight" offset={10} fontSize={10} fill="hsl(var(--muted-foreground))" />
                                    </ReferenceLine>
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Monthly TL;DR */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly TL;DR</CardTitle>
                    <CardDescription>A quick summary of the last calculated month's finances.</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">{monthlySummaryTldr}</p>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Expense Breakdown Donut Chart */}
        <div className="lg:col-span-1">
             <Card className="flex flex-col h-full"> {/* Ensure card takes full height */}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5" /> Expense Breakdown (This Month)
                    </CardTitle>
                    <CardDescription>Spending by category for {format(new Date(), 'MMMM yyyy')}. Total: R$ {totalCurrentMonthExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0"> {/* Allow content to grow */}
                     {expenseBreakdown.length > 0 ? (
                        <ChartContainer
                            config={pieConfig}
                            className="mx-auto aspect-square max-h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Pie
                                        data={expenseBreakdown}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        strokeWidth={5}
                                    >
                                       {expenseBreakdown.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={pieConfig[entry.name]?.color || '#ccc'} />
                                       ))}
                                    </Pie>
                                </PieChart>
                             </ResponsiveContainer>
                        </ChartContainer>
                     ) : (
                       <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
                         No expense data for this month yet.
                       </div>
                     )}
                </CardContent>
                <CardContent className="pb-4 pt-2"> {/* Legend area */}
                    {expenseBreakdown.length > 0 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-muted-foreground">
                            {expenseBreakdown.map((item) => (
                                <div key={item.name} className="flex items-center gap-1.5">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: pieConfig[item.name]?.color }}
                                    />
                                    {item.name} (R$ {item.value.toFixed(2)})
                                </div>
                            ))}
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>

      </div>


      {/* Set Budget Modal */}
       <Dialog open={isBudgetModalOpen} onOpenChange={setIsBudgetModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Set Monthly Expense Budget</DialogTitle>
                   <DialogDescription>
                      Enter your target monthly spending limit. This will be shown on the expense chart.
                   </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <InputLabel htmlFor="monthly-budget" className="text-right">
                          Budget (R$)
                      </InputLabel>
                      <Input
                          id="monthly-budget"
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="col-span-3"
                          placeholder="e.g., 2500"
                          step="10"
                          min="0"
                      />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                     <Button type="button" variant="outline">Cancel</Button>
                   </DialogClose>
                  <Button type="button" onClick={handleSaveBudget}>Save Budget</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}
