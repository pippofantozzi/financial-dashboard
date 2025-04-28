
 'use client';

 import * as React from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
 import { BookOpenCheck, ArrowUpRight, ArrowDownRight, TrendingUp, FilePlus } from 'lucide-react';
 import { FullReportSidebar } from '@/components/full-report-sidebar';
 import { format, startOfMonth, endOfMonth } from 'date-fns';
 import { v4 as uuidv4 } from 'uuid';

 // --- Shared State Simulation (Replace with actual global state/context) ---
 type Transaction = {
     id: string;
     date: string; // YYYY-MM-DD
     amount: number;
     category_id: string;
     payment_method: string;
     description?: string;
 };

 type Category = {
     id: string;
     name: string;
     type: 'expense' | 'income' | 'investment' | 'saving';
 };

 const initialCategories: Category[] = [
     { id: 'cat1', name: 'Mercado', type: 'expense' },
     { id: 'cat2', name: 'Luxos', type: 'expense' },
     { id: 'cat3', name: 'Farmácia', type: 'expense' },
     { id: 'cat4', name: 'Transporte', type: 'expense' },
     { id: 'cat5', name: 'Salário', type: 'income' },
     { id: 'cat6', name: 'Investimentos', type: 'investment' },
     { id: 'cat7', name: 'Poupança Viagem', type: 'saving' },
 ];

 const initialTransactions: Transaction[] = [
   { id: uuidv4(), date: '2024-06-15', amount: -55.30, category_id: 'cat1', payment_method: 'db', description: 'Groceries' },
   { id: uuidv4(), date: '2024-06-14', amount: -120.00, category_id: 'cat2', payment_method: 'cg', description: 'Dinner' },
   { id: uuidv4(), date: '2024-06-13', amount: 3500.00, category_id: 'cat5', payment_method: 'pb', description: 'Salary' },
   { id: uuidv4(), date: '2024-05-20', amount: 4000.00, category_id: 'cat5', payment_method: 'pb', description: 'Salary' },
   { id: uuidv4(), date: '2024-05-15', amount: -200.00, category_id: 'cat1', payment_method: 'db', description: 'More Groceries' },
   { id: uuidv4(), date: '2024-05-10', amount: -50.00, category_id: 'cat4', payment_method: 'dg', description: 'Bus Fare' },
 ];
 // --- End Shared State Simulation ---


 // Type for the calculated monthly summary
 type MonthlySummary = {
   id: string; // Unique ID for the summary (e.g., YYYY-MM)
   month: number; // 1-12
   year: number;
   total_income: number;
   total_expenses: number;
   net: number;
   investment: number; // Example, derived from categories later
   savings: number;    // Example, derived from categories later
   notes?: string; // Optional manual notes
   tldr?: string; // Short summary (could be AI generated later)
   full_report?: string; // Detailed markdown report
 };

 // Function to calculate summaries from transactions
 const calculateMonthlySummaries = (transactions: Transaction[], categories: Category[]): MonthlySummary[] => {
     const summaries: { [key: string]: MonthlySummary } = {}; // Use YYYY-MM as key

     transactions.forEach(tx => {
         const date = new Date(tx.date + 'T00:00:00');
         const year = date.getFullYear();
         const month = date.getMonth() + 1; // 1-12
         const key = `${year}-${String(month).padStart(2, '0')}`;
         const category = categories.find(c => c.id === tx.category_id);

         if (!summaries[key]) {
             summaries[key] = {
                 id: key,
                 year,
                 month,
                 total_income: 0,
                 total_expenses: 0,
                 net: 0,
                 investment: 0, // Initialize
                 savings: 0,    // Initialize
             };
         }

         const summary = summaries[key];
         const amount = tx.amount;

         if (category) {
             switch (category.type) {
                 case 'income':
                     summary.total_income += amount;
                     break;
                 case 'expense':
                     summary.total_expenses += Math.abs(amount); // Expenses are negative, sum absolute values
                     break;
                 case 'investment':
                     summary.investment += Math.abs(amount); // Assume investments are expenses/outflows
                     // Also count as expense for net calculation
                     summary.total_expenses += Math.abs(amount);
                     break;
                 case 'saving':
                      summary.savings += Math.abs(amount); // Assume savings are expenses/outflows
                     // Also count as expense for net calculation
                      summary.total_expenses += Math.abs(amount);
                      break;
             }
         } else {
             // Handle uncategorized or default behavior
             if (amount > 0) summary.total_income += amount;
             else summary.total_expenses += Math.abs(amount);
         }
     });

     // Calculate net for each summary and generate TLDR/Report
     Object.values(summaries).forEach(summary => {
         summary.net = summary.total_income - summary.total_expenses;
         // Generate dummy TLDR and Full Report
         summary.tldr = `Net for ${format(new Date(summary.year, summary.month - 1), 'MMMM yyyy')}: R$ ${summary.net.toFixed(2)}. Income: R$ ${summary.total_income.toFixed(2)}, Expenses: R$ ${summary.total_expenses.toFixed(2)}.`;
         summary.full_report = generateDummyReport(summary);
     });

     // Sort summaries by date descending
     return Object.values(summaries).sort((a, b) => {
         if (a.year !== b.year) return b.year - a.year;
         return b.month - a.month;
     });
 };

 // Dummy report generator function
 const generateDummyReport = (summary: MonthlySummary): string => `
 # Monthly Report - ${format(new Date(summary.year, summary.month - 1), 'MMMM yyyy')}

 **TL;DR:** ${summary.tldr || 'No summary available.'}

 ## Financial Overview
 - **Total Income:** R$ ${summary.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
 - **Total Expenses:** R$ ${summary.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
 - **Net Result:** R$ ${summary.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

 ## Savings & Investments
 - **Allocated to Investments:** R$ ${summary.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
 - **Allocated to Savings Goals:** R$ ${summary.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

 ## Key Notes
 - ${summary.notes || 'No specific notes this month.'}

 ## Plan for Next Month
 - *Goal:* Analyze spending patterns.
 - *Action:* Categorize all transactions promptly.
 `;


 export default function MonthlyReportsPage() {
   // Use simulated state for transactions and categories
   const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
   const [categories, setCategories] = React.useState<Category[]>(initialCategories);

   // Calculate summaries based on the current state
   const monthlySummaries = React.useMemo(() => calculateMonthlySummaries(transactions, categories), [transactions, categories]);

   const [isReportSidebarOpen, setIsReportSidebarOpen] = React.useState(false);
   const [selectedReportData, setSelectedReportData] = React.useState<MonthlySummary | null>(null);

   const handleViewFullReport = (summary: MonthlySummary) => {
     setSelectedReportData(summary);
     setIsReportSidebarOpen(true);
   };

   return (
     <div className="flex flex-col gap-6 p-4 md:p-6">
       <h1 className="text-2xl font-semibold">Monthly Reports</h1>

        {monthlySummaries.length > 0 ? (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {monthlySummaries.map((summary) => (
                 <Card key={summary.id} className="flex flex-col">
                   <CardHeader>
                     <CardTitle>{format(new Date(summary.year, summary.month - 1), 'MMMM yyyy')}</CardTitle>
                     <CardDescription className="text-sm pt-1 line-clamp-2">{summary.tldr || 'Summary not available.'}</CardDescription>
                   </CardHeader>
                   <CardContent className="flex-grow space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1"><ArrowUpRight className="h-4 w-4 text-green-600"/>Income</span>
                        <span>R$ {summary.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1"><ArrowDownRight className="h-4 w-4 text-red-600"/>Expenses</span>
                        <span>R$ {summary.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                       <div className="flex justify-between items-center font-medium pt-1 border-t mt-2">
                         <span className="text-foreground flex items-center gap-1"><TrendingUp className="h-4 w-4 text-blue-500"/>Net</span>
                         <span className={summary.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                             R$ {summary.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                         </span>
                       </div>
                   </CardContent>
                   <CardFooter className="border-t pt-4">
                     <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewFullReport(summary)}>
                        <BookOpenCheck className="mr-2 h-4 w-4" /> View Full Report
                     </Button>
                   </CardFooter>
                 </Card>
               ))}
             </div>
         ) : (
            <Card className="col-span-full flex flex-col items-center justify-center py-12 border-dashed">
                <CardContent className="text-center">
                    <FilePlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="text-lg mb-1">No Monthly Reports Yet</CardTitle>
                    <CardDescription className="mb-4">Add some transactions to generate your first financial report.</CardDescription>
                    {/* Optional: Link to transactions page - Assuming routing is set up */}
                     {/* <Button asChild variant="default" className="mt-4">
                         <Link href="/transactions">
                             <PlusCircle className="mr-2 h-4 w-4" /> Add Transactions
                         </Link>
                     </Button> */}
                     <Button variant="default" className="mt-4" onClick={() => alert('Navigate to Transactions page (implement Link later)')}>
                        Add Transactions
                     </Button>
                </CardContent>
            </Card>
         )}


       <FullReportSidebar
         isOpen={isReportSidebarOpen}
         onClose={() => setIsReportSidebarOpen(false)}
         reportData={selectedReportData}
       />
     </div>
   );
 }
        