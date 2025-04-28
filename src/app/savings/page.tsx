'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns'; // For formatting dates

// Dummy Data - Replace with actual data fetching (e.g., useSavingsGoals())
const dummySavingsGoals = [
  { id: 'sg1', title: 'Holiday 2025', amount_saved: 1250.50, target_amount: 5000.00, due_date: '2025-12-01' },
  { id: 'sg2', title: 'New Car Down Payment', amount_saved: 8700.00, target_amount: 15000.00, due_date: null },
  { id: 'sg3', title: 'Emergency Fund', amount_saved: 3000.00, target_amount: 10000.00, due_date: null },
];

// Helper function to calculate progress percentage
const calculateProgress = (saved: number, target: number) => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((saved / target) * 100));
};

export default function SavingsPage() {
  const [savingsGoals, setSavingsGoals] = React.useState(dummySavingsGoals); // TODO: Replace with useSavingsGoals hook
  // TODO: Add state and functions for creating/editing saving goals (likely via a modal)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Savings & Investment Goals</h1>
        <Button onClick={() => alert('Open "Create New Saving Goal" Modal')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
        </Button>
      </div>

      {/* Grid for Savings Goals */}
      {savingsGoals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.amount_saved, goal.target_amount);
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{goal.title}</span>
                     {/* Optional: Add Edit/Delete buttons here */}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                     <Target className="h-4 w-4 text-muted-foreground" /> Target: R$ {goal.target_amount.toFixed(2)}
                   </CardDescription>
                   {goal.due_date && (
                     <CardDescription className="flex items-center gap-1 text-sm">
                       <CalendarDays className="h-4 w-4 text-muted-foreground" /> Due: {format(new Date(goal.due_date), 'MMM yyyy')}
                     </CardDescription>
                   )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={progress} aria-label={`${progress}% progress towards ${goal.title}`} />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-accent-foreground">R$ {goal.amount_saved.toFixed(2)} Saved</span>
                    <span className="text-muted-foreground">{progress}% Complete</span>
                  </div>
                </CardContent>
                 {/* Optional Footer for actions like "Allocate Funds" */}
                 {/* <CardFooter>
                   <Button variant="outline" size="sm">Allocate Funds</Button>
                 </CardFooter> */}
              </Card>
            );
          })}
        </div>
      ) : (
         <Card className="col-span-full flex flex-col items-center justify-center py-12">
             <CardContent className="text-center">
                 <PiggyBank className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                 <p className="text-muted-foreground">You haven't set any savings goals yet.</p>
                 <Button className="mt-4" onClick={() => alert('Open "Create New Saving Goal" Modal')}>
                   <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Goal
                 </Button>
             </CardContent>
         </Card>
      )}

       {/* Placeholder for allocating monthly net - Could be a separate section or integrated */}
        {/* <Card className="mt-6">
            <CardHeader>
                <CardTitle>Allocate Monthly Net</CardTitle>
                <CardDescription>Distribute your remaining funds into your savings buckets.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Monthly Net Available: R$ XXXX.XX</p>
                {/* Add inputs/sliders for allocation */}
            {/* </CardContent>
            <CardFooter>
                <Button>Save Allocation</Button>
            </CardFooter>
        </Card> */}

    </div>
  );
}
