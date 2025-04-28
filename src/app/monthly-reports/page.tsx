
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BookOpenCheck, ArrowUpRight, ArrowDownRight, TrendingUp, PlusCircle } from 'lucide-react';
import { FullReportSidebar } from '@/components/full-report-sidebar'; // Assume this component exists

// Dummy Data - Replace with actual data fetching (e.g., useMonthlySummaries())
const dummyMonthlySummaries = [
  { id: 'sum1', month: 6, year: 2024, total_income: 4000.00, total_expenses: 2500.25, net: 1500.75, investment: 500.00, savings: 1000.75, notes: 'Car repair increased expenses.', tldr: 'Income steady, expenses up due to car repair, still saved well.' },
  { id: 'sum2', month: 5, year: 2024, total_income: 3900.00, total_expenses: 1800.50, net: 2099.50, investment: 600.00, savings: 1499.50, notes: 'Good month for savings.', tldr: 'Strong savings month, lower expenses than usual.' },
  { id: 'sum3', month: 4, year: 2024, total_income: 4100.00, total_expenses: 2200.00, net: 1900.00, investment: 500.00, savings: 1400.00, notes: 'Income slightly higher.', tldr: 'Solid month, consistent income and saving.' },
];

export default function MonthlyReportsPage() {
  const [monthlySummaries, setMonthlySummaries] = React.useState(dummyMonthlySummaries); // TODO: Replace with hook
  const [isReportSidebarOpen, setIsReportSidebarOpen] = React.useState(false);
  const [selectedReportData, setSelectedReportData] = React.useState<any>(null); // Data for the selected report

  const handleViewFullReport = (summary: any) => {
    // TODO: Fetch full report details based on summary id/month/year if needed
    const dummyFullReport = `
# Monthly Report - ${new Date(summary.year, summary.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}

**TL;DR:** ${summary.tldr}

## Financial Overview
- **Total Income:** R$ ${summary.total_income.toFixed(2)}
- **Total Expenses:** R$ ${summary.total_expenses.toFixed(2)}
- **Net Result:** R$ ${summary.net.toFixed(2)}

## Savings & Investments
- **Allocated to Investments:** R$ ${summary.investment.toFixed(2)}
- **Allocated to Savings Goals:** R$ ${summary.savings.toFixed(2)}

## Key Notes
- ${summary.notes || 'No specific notes this month.'}

## Plan for Next Month
- *Goal:* Increase savings by 5%.
- *Action:* Review subscription services for potential cuts.
- *Watch out for:* Upcoming annual insurance payment.
    `;
    setSelectedReportData({ ...summary, full_report: dummyFullReport }); // Add dummy report content
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
                    <CardTitle>{new Date(summary.year, summary.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
                    <CardDescription className="text-sm pt-1">{summary.tldr}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2 text-sm">
                     <div className="flex justify-between items-center">
                       <span className="text-muted-foreground flex items-center gap-1"><ArrowUpRight className="h-4 w-4 text-green-500"/>Income</span>
                       <span>R$ {summary.total_income.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-muted-foreground flex items-center gap-1"><ArrowDownRight className="h-4 w-4 text-red-500"/>Expenses</span>
                       <span>R$ {summary.total_expenses.toFixed(2)}</span>
                     </div>
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="h-4 w-4 text-blue-500"/>Net</span>
                        <span>R$ {summary.net.toFixed(2)}</span>
                      </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewFullReport(summary)}>
                       <BookOpenCheck className="mr-2 h-4 w-4" /> View Full Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        ) : (
           <Card className="col-span-full flex flex-col items-center justify-center py-12">
               <CardContent className="text-center">
                   <BookOpenCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">No monthly reports generated yet.</p>
                   <p className="text-xs text-muted-foreground">Add transactions to see your first report.</p>
                   {/* Optional: Link to transactions page */}
                    {/* <Button variant="link" className="mt-2"><Link href="/transactions">Add Transactions</Link></Button> */}
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

