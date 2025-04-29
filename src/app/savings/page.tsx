
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select
import { PlusCircle, Target, CalendarDays, Edit, Trash2, PiggyBank, Coins, Banknote, MinusCircle, Plus } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns'; // For formatting dates and difference
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

// --- State Definitions ---
// Assume transactions and categories are potentially available (e.g., via context or props in a real app)
type Transaction = {
    id: string;
    date: string; // YYYY-MM-DD
    amount: number;
    category_id: string;
    payment_method: string;
    description?: string;
    allocated_to_goal_id?: string | null; // Link transaction to a specific goal
};

type Category = {
    id: string;
    name: string;
    type: 'expense' | 'income' | 'investment' | 'saving';
};

// Type Definition for Savings Goal
interface SavingsGoal {
  id: string;
  title: string;
  amount_saved: number; // Amount *manually* allocated or linked via transactions
  target_amount: number;
  due_date?: string | null; // Store as YYYY-MM-DD string or null
}
// --- End State Definitions ---


// Initial Dummy Data - Managed by state
const initialCategories: Category[] = [
    { id: 'cat-mercado', name: 'Mercado', type: 'expense' },
    { id: 'cat-salario', name: 'Salário', type: 'income' },
    { id: 'cat-invest', name: 'Investimentos', type: 'investment' },
    { id: 'cat-poupanca', name: 'Poupança Viagem', type: 'saving' },
    { id: 'cat-freela', name: 'Freelance Income', type: 'income' },
];

const initialTransactions: Transaction[] = [
  { id: uuidv4(), date: '2024-06-15', amount: -55.30, category_id: 'cat-mercado', payment_method: 'db' },
  { id: uuidv4(), date: '2024-06-13', amount: 3500.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: uuidv4(), date: '2024-05-20', amount: 4000.00, category_id: 'cat-salario', payment_method: 'pb' },
  { id: uuidv4(), date: '2024-05-25', amount: 500.00, category_id: 'cat-freela', payment_method: 'pb' },
  // Example of a transaction linked to a goal (needs goal ID)
  // { id: uuidv4(), date: '2024-07-01', amount: -500.00, category_id: 'cat-poupanca', payment_method: 'pb', allocated_to_goal_id: 'goal-holiday' },
];


const initialSavingsGoals: SavingsGoal[] = [
  { id: 'goal-holiday', title: 'Holiday 2025', amount_saved: 1250.50, target_amount: 5000.00, due_date: '2025-12-01' },
  { id: 'goal-car', title: 'New Car Down Payment', amount_saved: 8700.00, target_amount: 15000.00, due_date: null },
  { id: 'goal-emergency', title: 'Emergency Fund', amount_saved: 3000.00, target_amount: 10000.00, due_date: null },
];

// --- Helper Functions ---
const calculateProgress = (saved: number, target: number): number => {
  if (target <= 0) return 0;
  const progress = Math.round((saved / target) * 100);
  return Math.min(100, Math.max(0, progress)); // Ensure progress is between 0 and 100
};

const formatDateString = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
        return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return "Invalid Date";
    }
}

const calculateUnallocatedCash = (transactions: Transaction[], goals: SavingsGoal[], categories: Category[]): number => {
   let totalIncome = 0;
   let totalExpenses = 0; // Includes general expenses + amounts moved to savings/investments *not* tracked by goals

   transactions.forEach(tx => {
       const category = categories.find(c => c.id === tx.category_id);
       // Only consider transactions *not* directly allocated to a savings goal via 'allocated_to_goal_id'
       if (!tx.allocated_to_goal_id) {
           if (tx.amount > 0) {
                // Assume all positive amounts are income unless categorized differently
                totalIncome += tx.amount;
           } else if (category && (category.type === 'expense' || category.type === 'saving' || category.type === 'investment')) {
                // Sum negative amounts for expense, saving, investment *unless* they are part of a goal's saved amount
                totalExpenses += Math.abs(tx.amount);
           } else if (tx.amount < 0) {
                // Assume un-categorized negative amounts are expenses
                totalExpenses += Math.abs(tx.amount);
           }
       }
   });

   // Subtract the amounts manually tracked within goals from the total derived from income/expenses
   const totalManuallySavedInGoals = goals.reduce((sum, goal) => sum + goal.amount_saved, 0);

   // Unallocated cash = (Total Income - Total General Expenses) - Total Manually Saved in Goals
   // This is a simplified model. A more robust model might directly sum income and subtract all outflows (expenses + goal allocations).
   // Let's refine: Unallocated = Total Income - (Total Expenses + Total Manually Saved In Goals)
   const netUnallocated = totalIncome - totalExpenses - totalManuallySavedInGoals;


   // Alternative simpler calculation:
   // Sum all income. Sum all negative transactions (expenses, savings, investments).
   // Unallocated = Total Income - Total Outflows
   /*
   const totalIncome = transactions
       .filter(tx => tx.amount > 0)
       .reduce((sum, tx) => sum + tx.amount, 0);

   const totalOutflows = transactions
       .filter(tx => tx.amount < 0)
       .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

   const netUnallocated = totalIncome - totalOutflows;
   */

   return Math.max(0, netUnallocated); // Ensure unallocated cash isn't negative
};


// --- Component ---
export default function SavingsPage() {
  // Simulate fetching/using global state
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [savingsGoals, setSavingsGoals] = React.useState<SavingsGoal[]>(initialSavingsGoals);

  // Add/Edit Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<SavingsGoal | null>(null);
  const [goalTitle, setGoalTitle] = React.useState('');
  const [goalTarget, setGoalTarget] = React.useState<number | string>('');
  const [goalSaved, setGoalSaved] = React.useState<number | string>(0);
  const [goalDueDate, setGoalDueDate] = React.useState<string>('');

  // Allocate Funds Modal State
  const [isAllocateModalOpen, setIsAllocateModalOpen] = React.useState(false);
  const [allocateAmount, setAllocateAmount] = React.useState<number | string>('');
  const [selectedGoalId, setSelectedGoalId] = React.useState<string>(''); // ID of the goal to allocate to
  const [allocationType, setAllocationType] = React.useState<'add' | 'remove'>('add'); // Default to adding funds


  const { toast } = useToast();

  // Calculate unallocated cash based on current state
  const netUnallocatedCash = React.useMemo(() => calculateUnallocatedCash(transactions, savingsGoals, categories), [transactions, savingsGoals, categories]);


  // --- Goal Management Functions ---
  const openAddGoalModal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalTarget('');
    setGoalSaved(0);
    setGoalDueDate('');
    setIsGoalModalOpen(true);
  };

  const openEditGoalModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalTarget(goal.target_amount);
    setGoalSaved(goal.amount_saved);
    setGoalDueDate(goal.due_date || '');
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = () => {
    const targetAmountNum = parseFloat(String(goalTarget));
    const savedAmountNum = parseFloat(String(goalSaved));

    // Validations (keep existing ones)
     if (!goalTitle.trim()) {
      toast({ title: "Error", description: "Goal title cannot be empty.", variant: "destructive" });
      return;
    }
    if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
      toast({ title: "Error", description: "Target amount must be a positive number.", variant: "destructive" });
      return;
    }
     if (isNaN(savedAmountNum) || savedAmountNum < 0) {
       toast({ title: "Error", description: "Initial saved amount cannot be negative.", variant: "destructive" });
       return;
     }
     // Allow initial saved amount to be >= 0, but maybe not exceed target?
     if (savedAmountNum > targetAmountNum) {
        toast({ title: "Warning", description: "Initial saved amount exceeds target amount.", variant: "default" });
        // Allow saving anyway, or adjust? For now, allow.
     }


    const goalData: Omit<SavingsGoal, 'id'> = {
        title: goalTitle.trim(),
        target_amount: targetAmountNum,
        amount_saved: savedAmountNum,
        due_date: goalDueDate || null,
    };

    if (editingGoal) {
      setSavingsGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...editingGoal, ...goalData } : g));
      toast({ title: "Goal Updated", description: `Savings goal "${goalData.title}" updated.` });
    } else {
      const newGoal: SavingsGoal = { ...goalData, id: uuidv4() };
      setSavingsGoals(prev => [...prev, newGoal]);
      toast({ title: "Goal Added", description: `New savings goal "${goalData.title}" created.` });
    }
    setIsGoalModalOpen(false);
  };

   const handleDeleteGoal = (id: string, title: string) => {
       if (window.confirm(`Are you sure you want to delete the savings goal "${title}"? This also removes allocated funds from the goal.`)) {
           // In a real app, you might want to un-allocate associated transactions first
           setSavingsGoals(prev => prev.filter(g => g.id !== id));
           toast({ title: "Goal Deleted", description: `Savings goal "${title}" has been deleted.` });
       }
   };


  // --- Fund Allocation Functions ---
  const openAllocateModal = (goalId: string) => {
      setSelectedGoalId(goalId);
      setAllocateAmount(''); // Reset amount
      setAllocationType('add'); // Default to add
      setIsAllocateModalOpen(true);
  }

  const handleAllocateFunds = () => {
      const amountNum = parseFloat(String(allocateAmount));
      const targetGoal = savingsGoals.find(g => g.id === selectedGoalId);

       if (!targetGoal) {
           toast({ title: "Error", description: "Selected goal not found.", variant: "destructive" });
           return;
       }
       if (isNaN(amountNum) || amountNum <= 0) {
          toast({ title: "Error", description: "Please enter a valid positive amount to allocate.", variant: "destructive" });
          return;
       }

       if (allocationType === 'add') {
            // Check if enough unallocated cash is available
           if (amountNum > netUnallocatedCash) {
               toast({ title: "Insufficient Funds", description: `Not enough unallocated cash (Available: R$ ${netUnallocatedCash.toFixed(2)}).`, variant: "destructive" });
               return;
           }
            // Increase goal's saved amount
            setSavingsGoals(prevGoals => prevGoals.map(goal =>
                goal.id === selectedGoalId
                    ? { ...goal, amount_saved: goal.amount_saved + amountNum }
                    : goal
            ));
            // // Decrease unallocated cash (implicitly handled by recalculation, but good to show effect immediately)
            // setNetUnallocatedCash(prev => prev - amountNum); // If managing unallocated cash directly in state
            toast({ title: "Funds Allocated", description: `R$ ${amountNum.toFixed(2)} added to "${targetGoal.title}".` });

       } else { // allocationType === 'remove'
            // Check if goal has enough saved amount to remove
           if (amountNum > targetGoal.amount_saved) {
               toast({ title: "Cannot Remove Funds", description: `Cannot remove more than saved (Saved: R$ ${targetGoal.amount_saved.toFixed(2)}).`, variant: "destructive" });
               return;
           }
            // Decrease goal's saved amount
           setSavingsGoals(prevGoals => prevGoals.map(goal =>
                goal.id === selectedGoalId
                    ? { ...goal, amount_saved: goal.amount_saved - amountNum }
                    : goal
            ));
           // Increase unallocated cash (implicitly handled by recalculation)
           // setNetUnallocatedCash(prev => prev + amountNum); // If managing unallocated cash directly in state
           toast({ title: "Funds Removed", description: `R$ ${amountNum.toFixed(2)} removed from "${targetGoal.title}" and returned to unallocated cash.` });
       }


       // TODO: Optionally, create a Transaction record for this allocation/removal
       // This makes tracking more robust but adds complexity.
       // Example:
       /*
       const allocationTransaction: Transaction = {
           id: uuidv4(),
           date: format(new Date(), 'yyyy-MM-dd'),
           amount: allocationType === 'add' ? -amountNum : amountNum, // Negative for adding to goal (outflow from unallocated), Positive for removing (inflow to unallocated)
           category_id: targetGoal.type === 'investment' ? 'cat-invest' : 'cat-poupanca', // Or a specific 'Allocation' category
           payment_method: 'internal', // Indicate internal transfer
           description: `${allocationType === 'add' ? 'Allocation to' : 'Removal from'} goal: ${targetGoal.title}`,
           allocated_to_goal_id: allocationType === 'add' ? selectedGoalId : null, // Link if adding
       };
       setTransactions(prev => [...prev, allocationTransaction]);
       */


      setIsAllocateModalOpen(false); // Close modal
  }


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Savings & Investment Goals</h1>
        <Button onClick={openAddGoalModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
        </Button>
      </div>

       {/* Net Unallocated Cash Card */}
       <Card className="bg-accent/10 border-accent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Banknote className="h-5 w-5 text-accent" />
                    Net Unallocated Cash
                </CardTitle>
                 <CardDescription>
                    Cash available after accounting for income, expenses, and funds already in goals.
                 </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-accent">
                    R$ {netUnallocatedCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                 {/* <p className="text-xs text-muted-foreground mt-1">
                    This is the cash you can freely allocate to your goals.
                 </p> */}
            </CardContent>
       </Card>

      {/* Grid for Savings Goals */}
      {savingsGoals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.amount_saved, goal.target_amount);
            const formattedDueDate = formatDateString(goal.due_date);
            const daysLeft = goal.due_date ? differenceInDays(parseISO(goal.due_date), new Date()) : null;

            return (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate pr-2">{goal.title}</span>
                     <div className="flex-shrink-0 space-x-1">
                       <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditGoalModal(goal)}>
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
                     <CardDescription className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                           <CalendarDays className="h-4 w-4 text-muted-foreground" /> Due: {formattedDueDate}
                        </span>
                         {daysLeft !== null && daysLeft >= 0 && (
                           <span className="text-xs text-muted-foreground">({daysLeft} days left)</span>
                         )}
                         {daysLeft !== null && daysLeft < 0 && (
                           <span className="text-xs text-red-500">(Overdue)</span>
                         )}
                     </CardDescription>
                   )}
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <Progress value={progress} aria-label={`${progress}% progress towards ${goal.title}`} />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                       R$ {goal.amount_saved.toLocaleString('pt-BR', {minimumFractionDigits: 2})} Saved
                    </span>
                    <span className="text-muted-foreground">{progress}% Complete</span>
                  </div>
                   {/* Display remaining amount */}
                   <p className="text-xs text-muted-foreground text-right">
                       R$ {(goal.target_amount - goal.amount_saved).toLocaleString('pt-BR', {minimumFractionDigits: 2})} remaining
                   </p>
                </CardContent>
                 <CardFooter className="border-t pt-4">
                   <Button variant="outline" size="sm" className="w-full" onClick={() => openAllocateModal(goal.id)}>
                     <Coins className="mr-2 h-4 w-4" /> Allocate / Remove Funds
                   </Button>
                 </CardFooter>
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
                 <Button className="mt-4" onClick={openAddGoalModal}>
                   <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Goal
                 </Button>
             </CardContent>
         </Card>
      )}

      {/* --- Modals --- */}

      {/* Add/Edit Goal Modal */}
       <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>{editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}</DialogTitle>
                   <DialogDescription>
                      {editingGoal ? 'Update the details of your savings goal.' : 'Set a target and track your progress. You can allocate funds later.'}
                   </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-title" className="text-right">Title</Label>
                      <Input id="goal-title" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} className="col-span-3" placeholder="e.g., Emergency Fund" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-target" className="text-right">Target (R$)</Label>
                      <Input id="goal-target" type="number" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} className="col-span-3" placeholder="e.g., 5000" step="0.01" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-saved" className="text-right">Initial Saved (R$)</Label>
                      <Input id="goal-saved" type="number" value={goalSaved} onChange={(e) => setGoalSaved(e.target.value)} className="col-span-3" placeholder="e.g., 1250.50" step="0.01" disabled={!!editingGoal} title={editingGoal ? "Edit saved amount via Allocate/Remove Funds" : ""} />
                      {/* Optionally disable editing initial saved amount after creation */}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="goal-due-date" className="text-right">Due Date</Label>
                      <Input id="goal-due-date" type="date" value={goalDueDate} onChange={(e) => setGoalDueDate(e.target.value)} className="col-span-3" />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="button" onClick={handleSaveGoal}>Save Goal</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Allocate Funds Modal */}
      <Dialog open={isAllocateModalOpen} onOpenChange={setIsAllocateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                   <DialogTitle>Allocate / Remove Funds</DialogTitle>
                   <DialogDescription>
                      {allocationType === 'add'
                          ? `Add funds to "${savingsGoals.find(g => g.id === selectedGoalId)?.title || ''}" from your unallocated cash (R$ ${netUnallocatedCash.toFixed(2)} available).`
                          : `Remove funds from "${savingsGoals.find(g => g.id === selectedGoalId)?.title || ''}" back to unallocated cash.`
                      }
                   </DialogDescription>
              </DialogHeader>
               <div className="grid gap-4 py-4">
                  {/* Hidden Select for Goal ID - Value set when opening modal */}
                  {/* <Input type="hidden" value={selectedGoalId} /> */}

                  {/* Allocation Type Buttons */}
                   <div className="flex justify-center gap-2 mb-4">
                       <Button variant={allocationType === 'add' ? 'default' : 'outline'} onClick={() => setAllocationType('add')}>
                           <Plus className="mr-2 h-4 w-4" /> Add to Goal
                       </Button>
                       <Button variant={allocationType === 'remove' ? 'destructive' : 'outline'} onClick={() => setAllocationType('remove')}>
                           <MinusCircle className="mr-2 h-4 w-4" /> Remove from Goal
                       </Button>
                   </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="allocate-amount" className="text-right">Amount (R$)</Label>
                      <Input
                          id="allocate-amount"
                          type="number"
                          value={allocateAmount}
                          onChange={(e) => setAllocateAmount(e.target.value)}
                          className="col-span-3"
                          placeholder="e.g., 100.00"
                          step="0.01"
                          min="0.01" // Ensure positive amount
                      />
                  </div>
                  {/* Optionally show remaining in goal or target after allocation */}
               </div>
              <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button
                    type="button"
                    onClick={handleAllocateFunds}
                    variant={allocationType === 'remove' ? 'destructive' : 'default'}
                    disabled={!allocateAmount || parseFloat(String(allocateAmount)) <= 0} // Disable if no amount
                   >
                      {allocationType === 'add' ? 'Allocate Funds' : 'Remove Funds'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}
