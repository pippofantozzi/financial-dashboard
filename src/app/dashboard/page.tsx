
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, ReferenceLine, PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, DollarSign, Award, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For chart toggle
import { Input } from '@/components/ui/input'; // For budget setting
import { Label } from '@/components/ui/label'; // For budget setting label
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'; // For budget setting modal

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
    { id: 'cat-other-exp', name: 'Outros', type: 'expense' }, // Added for expense chart
];

const initialTransactions: Transaction[] = [
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
       .filter(tx => tx.amount > 0)
       .reduce((sum, tx) => sum + tx.amount, 0);

   // Sum expenses NOT linked to goals + amounts explicitly saved/invested in goals
   const totalExpenses = transactions
       .filter(tx => tx.amount < 0 && !tx.allocated_to_goal_id)
       .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

   const totalManuallySavedInGoals = goals.reduce((sum, goal) => sum + goal.amount_saved, 0);

   const netUnallocated = totalIncome - totalExpenses - totalManuallySavedInGoals;
   return Math.max(0, netUnallocated);
};

const calculateMonthlyData = (transactions: Transaction[], categories: Category[], goals: SavingsGoal[]) => {
    const monthlyData: { [key: string]: { month: string; income: number; expenses: number; netWorth: number } } = {};
    let cumulativeNetWorth = 0; // Start net worth calculation (simplified)

    // Calculate initial unallocated cash - consider this as starting point before processing months
    const initialUnallocated = calculateUnallocatedCash([], goals, categories); // Start with 0 transactions
    cumulativeNetWorth += initialUnallocated + goals.reduce((sum, g) => sum + g.amount_saved, 0);

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
    const firstMonthKey = sortedMonths[0];
    if (firstMonthKey) {
         const [year, monthNum] = firstMonthKey.split('-').map(Number);
         const monthLabel = new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' });
          // Initialize net worth for the start of the period
         monthlyData[`${monthLabel}-Start`] = {
             month: `${monthLabel}-Start`,
             income: 0,
             expenses: 0,
             netWorth: calculateUnallocatedCash([], goals, categories) + goals.reduce((sum, g) => sum + g.amount_saved, 0), // Initial net worth
         };
    }


    let runningUnallocated = calculateUnallocatedCash([], goals, categories);
    let runningGoalTotal = goals.reduce((sum, g) => sum + g.amount_saved, 0);

    sortedMonths.forEach(monthKey => {
        const [year, monthNum] = monthKey.split('-').map(Number);
        const monthLabel = new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' }); // e.g., "Jan"
        const monthTransactions = transactionsByMonth[monthKey];

        let monthIncome = 0;
        let monthExpenses = 0;

        monthTransactions.forEach(tx => {
            const category = categories.find(c => c.id === tx.category_id);
            if (tx.amount > 0) {
                monthIncome += tx.amount;
                runningUnallocated += tx.amount; // Income increases unallocated cash
            } else {
                 // Only count as expense if NOT allocated to a goal already accounted for
                 if (!tx.allocated_to_goal_id) {
                     monthExpenses += Math.abs(tx.amount);
                     runningUnallocated -= Math.abs(tx.amount); // Expenses decrease unallocated cash
                 } else {
                     // If allocated, assume amount_saved in goal was updated elsewhere,
                     // so the change in net worth is already reflected.
                     // No change needed to runningUnallocated here if goal amount was updated.
                     // This part needs careful handling based on how allocations are recorded.
                     // For simplicity now, assume goal amount_saved is the source of truth.
                 }

                 // If category is investment/saving and linked to goal, it's part of goal amount
                 if (category && (category.type === 'investment' || category.type === 'saving') && tx.allocated_to_goal_id) {
                    // This outflow is part of the goal's saved amount, not general expense
                 } else if (tx.amount < 0) {
                     // Count as expense if negative and not an explicit goal contribution
                     monthExpenses += Math.abs(tx.amount);
                 }
            }
        });

        // Recalculate total goal savings *at the end of the month* based on the goals state passed in
        // This assumes the `goals` prop reflects the state *after* all transactions for the period.
        const endOfMonthGoalTotal = initialSavingsGoals.reduce((sum, g) => sum + g.amount_saved, 0); // Use the initial state for calculation demo


        // Net Worth at the end of the month = Current Unallocated Cash + Total Saved in Goals
        // Recalculate unallocated cash at end of month for accuracy
         const endOfMonthUnallocated = calculateUnallocatedCash(
             transactions.filter(tx => tx.date <= `${monthKey}-31`), // Include all transactions up to this month end
             initialSavingsGoals, // Use the LATEST goal state for end-of-month calculation
             categories
         );


        monthlyData[monthLabel] = {
            month: monthLabel,
            income: monthIncome,
            expenses: monthExpenses,
            netWorth: endOfMonthUnallocated + endOfMonthGoalTotal,
        };
    });


     // Ensure data points for recent months exist even if no transactions
     const lastTxDate = transactions.length > 0 ? new Date(transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date + 'T00:00:00') : new Date();
     let currentDate = transactions.length > 0 ? new Date(sortedMonths[0] + '-01T00:00:00') : new Date(new Date().getFullYear(), 0, 1); // Start from first transaction month or Jan of current year
     const endDate = lastTxDate > new Date() ? lastTxDate : new Date(); // Go up to today or last transaction date

     while (currentDate <= endDate) {
         const monthLabel = currentDate.toLocaleString('default', { month: 'short' });
         const year = currentDate.getFullYear();
         const monthKey = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

         if (!monthlyData[monthLabel]) {
              // Find the previous month's data to carry over net worth
              let prevMonth = new Date(currentDate);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              const prevLabel = prevMonth.toLocaleString('default', { month: 'short' });
              const prevNetWorth = monthlyData[prevLabel]?.netWorth ?? (monthlyData[`${prevLabel}-Start`]?.netWorth ?? 0);

             monthlyData[monthLabel] = {
                 month: monthLabel,
                 income: 0,
                 expenses: 0,
                 netWorth: prevNetWorth, // Carry over previous net worth if no transactions
             };
         }
         currentDate.setMonth(currentDate.getMonth() + 1);
     }


    // Sort final data for chart rendering
    const chartData = Object.values(monthlyData).sort((a, b) => {
         // Handle 'Month-Start' entries correctly
         const dateA = new Date(a.month.replace('-Start', '') + ' 1, 2024'); // Assuming 2024 for sorting
         const dateB = new Date(b.month.replace('-Start', '') + ' 1, 2024');
         if (a.month.includes('-Start')) dateA.setDate(0); // Put start at beginning
         if (b.month.includes('-Start')) dateB.setDate(0);
        return dateA.getTime() - dateB.getTime();
    });

     // Remove the potentially duplicate start entry if first month has data
    // if (chartData.length > 1 && chartData[1].month === firstMonthKey?.substring(0, 3)) {
    //     chartData.shift(); // Remove the synthetic start if the first month exists
    // }


    return chartData.map(d => ({...d, month: d.month.replace('-Start', '')})); // Clean up labels
};

// --- End Helper Functions ---


// Chart Configuration
const chartConfig = {
  netWorth: { label: 'Net Worth', color: 'hsl(var(--chart-1))' },
  expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
  budget: { label: 'Budget', color: 'hsl(var(--destructive))' }, // Use destructive color for budget line
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Access the full data point payload
    const value = payload[0].value;
    const name = payload[0].name;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
        {label && <p className="font-medium mb-1">{label}</p>}
        {name === 'netWorth' && <p className="text-muted-foreground">{`Net Worth: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>}
        {name === 'expenses' && <p className="text-muted-foreground">{`Expenses: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>}
        {/* Add other potential tooltips here */}
      </div>
    );
  }
  return null;
};


export default function DashboardPage() {
  // State Hooks
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [savingsGoals, setSavingsGoals] = React.useState<SavingsGoal[]>(initialSavingsGoals);
  const [monthlyBudget, setMonthlyBudget] = React.useState<number>(2000); // Default budget
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [tempBudget, setTempBudget] = React.useState<number | string>(monthlyBudget);
  const [chartType, setChartType] = React.useState<'netWorth' | 'expenses'>('netWorth');


  // Derived Data Calculations using useMemo
  const netUnallocatedCash = React.useMemo(() => calculateUnallocatedCash(transactions, savingsGoals, categories), [transactions, savingsGoals, categories]);
  const totalSavedInGoals = React.useMemo(() => savingsGoals.reduce((sum, goal) => sum + goal.amount_saved, 0), [savingsGoals]);
  const currentNetWorth = netUnallocatedCash + totalSavedInGoals;

  const monthlyChartData = React.useMemo(() => calculateMonthlyData(transactions, categories, savingsGoals), [transactions, categories, savingsGoals]);

  // Extract latest month's summary data
  const latestMonthData = monthlyChartData.length > 0 ? monthlyChartData[monthlyChartData.length - 1] : { income: 0, expenses: 0 };
  const netThisMonth = latestMonthData.income - latestMonthData.expenses;

  // TODO: Replace dummy TLDR logic with actual summary/AI generation
  const monthlySummaryTldr = `Net this month: R$ ${netThisMonth.toFixed(2)}. Income: R$ ${latestMonthData.income.toFixed(2)}, Expenses: R$ ${latestMonthData.expenses.toFixed(2)}.`;


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

      {/* Charts Area */}
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
             <ChartContainer config={chartConfig} className="h-full w-full">
                 <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={monthlyChartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                         <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} domain={['auto', 'auto']} />
                         <RechartsTooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                         {chartType === 'netWorth' && (
                             <Line type="monotone" dataKey="netWorth" stroke={chartConfig.netWorth.color} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'hsl(var(--background))', stroke: chartConfig.netWorth.color }} name="Net Worth"/>
                         )}
                         {chartType === 'expenses' && (
                            <>
                             <Line type="monotone" dataKey="expenses" stroke={chartConfig.expenses.color} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'hsl(var(--background))', stroke: chartConfig.expenses.color }} name="Expenses"/>
                             {/* Budget Reference Line */}
                              <ReferenceLine
                                  y={monthlyBudget}
                                  label={{ value: `Budget R$${monthlyBudget/1000}k`, position: 'insideTopRight', fill: 'hsl(var(--destructive))', fontSize: 10, dy: -5, dx: -5 }}
                                  stroke={chartConfig.budget.color}
                                  strokeDasharray="5 5"
                                  strokeWidth={1}
                               />
                            </>
                         )}
                     </LineChart>
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
                      <Label htmlFor="monthly-budget" className="text-right">
                          Budget (R$)
                      </Label>
                      <Input
                          id="monthly-budget"
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="col-span-3"
                          placeholder="e.g., 2000"
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

// Removed Pie Chart - Replaced with Expenses Line Chart + Budget
// Removed Best Saving Month Card - Replaced with Net Worth Card
