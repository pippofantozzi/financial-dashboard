
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Target, CalendarDays, Edit, Trash2, PiggyBank } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // For formatting dates
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

// Type Definition for Savings Goal
interface SavingsGoal {
  id: string;
  title: string;
  amount_saved: number;
  target_amount: number;
  due_date?: string | null; // Store as YYYY-MM-DD string or null
}

// Initial Dummy Data - Managed by state
const initialSavingsGoals: SavingsGoal[] = [
  { id: uuidv4(), title: 'Holiday 2025', amount_saved: 1250.50, target_amount: 5000.00, due_date: '2025-12-01' },
  { id: uuidv4(), title: 'New Car Down Payment', amount_saved: 8700.00, target_amount: 15000.00, due_date: null },
  { id: uuidv4(), title: 'Emergency Fund', amount_saved: 3000.00, target_amount: 10000.00, due_date: null },
];

// Helper function to calculate progress percentage
const calculateProgress = (saved: number, target: number): number => {
  if (target <= 0) return 0;
  const progress = Math.round((saved / target) * 100);
  return Math.min(100, Math.max(0, progress)); // Ensure progress is between 0 and 100
};

// Helper to safely format date string
const formatDateString = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
        return format(parseISO(dateString), 'MMM dd, yyyy'); // More specific format
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return "Invalid Date";
    }
}

export default function SavingsPage() {
  const [savingsGoals, setSavingsGoals] = React.useState<SavingsGoal[]>(initialSavingsGoals);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<SavingsGoal | null>(null);
  const [goalTitle, setGoalTitle] = React.useState('');
  const [goalTarget, setGoalTarget] = React.useState<number | string>(''); // Use string for input flexibility
  const [goalSaved, setGoalSaved] = React.useState<number | string>(0); // Start saved amount at 0 for new goals
  const [goalDueDate, setGoalDueDate] = React.useState<string>(''); // Store as YYYY-MM-DD
  const { toast } = useToast();

  const openAddModal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalTarget('');
    setGoalSaved(0); // Default saved amount for new goal
    setGoalDueDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalTarget(goal.target_amount);
    setGoalSaved(goal.amount_saved);
    setGoalDueDate(goal.due_date || '');
    setIsModalOpen(true);
  };

  const handleSaveGoal = () => {
    const targetAmountNum = parseFloat(String(goalTarget));
    const savedAmountNum = parseFloat(String(goalSaved));

    if (!goalTitle.trim()) {
      toast({ title: "Error", description: "Goal title cannot be empty.", variant: "destructive" });
      return;
    }
    if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
      toast({ title: "Error", description: "Target amount must be a positive number.", variant: "destructive" });
      return;
    }
     if (isNaN(savedAmountNum) || savedAmountNum < 0) {
       toast({ title: "Error", description: "Saved amount cannot be negative.", variant: "destructive" });
       return;
     }
     if (savedAmountNum > targetAmountNum) {
        toast({ title: "Error", description: "Saved amount cannot exceed the target amount.", variant: "destructive" });
        return;
     }

    const goalData: Omit<SavingsGoal, 'id'> = {
        title: goalTitle.trim(),
        target_amount: targetAmountNum,
        amount_saved: savedAmountNum,
        due_date: goalDueDate || null, // Save null if empty
    };

    if (editingGoal) {
      // Update existing goal
      setSavingsGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...editingGoal, ...goalData } : g));
      toast({ title: "Goal Updated", description: `Savings goal "${goalData.title}" has been updated.` });
    } else {
      // Add new goal
      const newGoal: SavingsGoal = { ...goalData, id: uuidv4() };
      setSavingsGoals(prev => [...prev, newGoal]);
      toast({ title: "Goal Added", description: `New savings goal "${goalData.title}" has been created.` });
    }
    setIsModalOpen(false);
  };

   const handleDeleteGoal = (id: string, title: string) => {
       if (window.confirm(`Are you sure you want to delete the savings goal "${title}"? This action cannot be undone.`)) {
           setSavingsGoals(prev => prev.filter(g => g.id !== id));
           toast({ title: "Goal Deleted", description: `Savings goal "${title}" has been deleted.` });
       }
   };


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Savings & Investment Goals</h1>
        <Button onClick={openAddModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
        </Button>
      </div>

      {/* Grid for Savings Goals */}
      {savingsGoals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.amount_saved, goal.target_amount);
            const formattedDueDate = formatDateString(goal.due_date);
            return (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate pr-2">{goal.title}</span>
                     <div className="flex-shrink-0 space-x-1">
                       <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(goal)}>
                         <Edit className="h-4 w-4" />
                         <span className="sr-only">Edit Goal</span>
                       </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleDeleteGoal(goal.id, goal.title)}>
                         <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete Goal</span>
                       </Button>
                     </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm pt-1">
                     <Target className="h-4 w-4 text-muted-foreground" /> Target: R$ {goal.target_amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                   </CardDescription>
                   {formattedDueDate && (
                     <CardDescription className="flex items-center gap-1 text-sm">
                       <CalendarDays className="h-4 w-4 text-muted-foreground" /> Due: {formattedDueDate}
                     </CardDescription>
                   )}
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <Progress value={progress} aria-label={`${progress}% progress towards ${goal.title}`} />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-accent-foreground">R$ {goal.amount_saved.toLocaleString('pt-BR', {minimumFractionDigits: 2})} Saved</span>
                    <span className="text-muted-foreground">{progress}% Complete</span>
                  </div>
                </CardContent>
                 {/* Optional Footer for actions like "Allocate Funds" */}
                 {/* <CardFooter className="pt-4">
                   <Button variant="outline" size="sm">Allocate Funds</Button>
                 </CardFooter> */}
              </Card>
            );
          })}
        </div>
      ) : (
         <Card className="col-span-full flex flex-col items-center justify-center py-12 border-dashed">
             <CardContent className="text-center">
                 <PiggyBank className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                 <CardTitle className="text-lg mb-1">No Savings Goals Yet</CardTitle>
                 <CardDescription className="mb-4">Create goals to track your progress towards financial targets.</CardDescription>
                 <Button className="mt-4" onClick={openAddModal}>
                   <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Goal
                 </Button>
             </CardContent>
         </Card>
      )}

      {/* Add/Edit Goal Modal */}
       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>{editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}</DialogTitle>
                   <DialogDescription>
                      {editingGoal ? 'Update the details of your savings goal.' : 'Set a target and track your progress.'}
                   </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-title" className="text-right">Title</Label>
                      <Input
                          id="goal-title"
                          value={goalTitle}
                          onChange={(e) => setGoalTitle(e.target.value)}
                          className="col-span-3"
                          placeholder="e.g., Emergency Fund"
                      />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-target" className="text-right">Target (R$)</Label>
                      <Input
                          id="goal-target"
                          type="number"
                          value={goalTarget}
                          onChange={(e) => setGoalTarget(e.target.value)}
                          className="col-span-3"
                          placeholder="e.g., 5000"
                          step="0.01"
                      />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-saved" className="text-right">Saved (R$)</Label>
                      <Input
                          id="goal-saved"
                          type="number"
                          value={goalSaved}
                          onChange={(e) => setGoalSaved(e.target.value)}
                          className="col-span-3"
                          placeholder="e.g., 1250.50"
                          step="0.01"
                      />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-due-date" className="text-right">Due Date</Label>
                      <Input
                          id="goal-due-date"
                          type="date"
                          value={goalDueDate}
                          onChange={(e) => setGoalDueDate(e.target.value)}
                          className="col-span-3"
                      />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                     <Button type="button" variant="outline">Cancel</Button>
                   </DialogClose>
                  <Button type="button" onClick={handleSaveGoal}>Save Goal</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}
