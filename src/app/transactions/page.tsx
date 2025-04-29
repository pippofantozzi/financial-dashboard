
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/date-picker-range';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { PlusCircle, Filter, Edit, Trash2 } from 'lucide-react';
import type { DateRange } from "react-day-picker"
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';


// Initial Dummy Data - Managed by state
const initialCategories = [
    { id: uuidv4(), name: 'Mercado', type: 'expense' },
    { id: uuidv4(), name: 'Luxos', type: 'expense' },
    { id: uuidv4(), name: 'Farmácia', type: 'expense' },
    { id: uuidv4(), name: 'Transporte', type: 'expense' },
    { id: uuidv4(), name: 'Salário', type: 'income' },
    { id: uuidv4(), name: 'Investimentos', type: 'investment' },
    { id: uuidv4(), name: 'Poupança Viagem', type: 'saving' },
];

const initialTransactions = [
  { id: uuidv4(), date: '2024-06-15', amount: -55.30, category_id: initialCategories[0].id, payment_method: 'db', description: 'Groceries at Pão de Açúcar' },
  { id: uuidv4(), date: '2024-06-14', amount: -120.00, category_id: initialCategories[1].id, payment_method: 'cg', description: 'Dinner at Outback' },
  { id: uuidv4(), date: '2024-06-13', amount: 3500.00, category_id: initialCategories[4].id, payment_method: 'pb', description: 'Monthly Salary' },
  { id: uuidv4(), date: '2024-06-12', amount: -35.80, category_id: initialCategories[2].id, payment_method: 'db', description: 'Medicine at Droga Raia' },
  { id: uuidv4(), date: '2024-06-10', amount: -70.00, category_id: initialCategories[3].id, payment_method: 'dg', description: 'Uber rides' },
];


type Category = {
    id: string;
    name: string;
    type: 'expense' | 'income' | 'investment' | 'saving';
};

type Transaction = {
    id: string;
    date: string; // Store as YYYY-MM-DD string
    amount: number;
    category_id: string;
    payment_method: string;
    description?: string;
};

const paymentMethodMap = {
    db: 'Débito',
    pb: 'PIX/Boleto',
    cg: 'Crédito',
    dg: 'Dinheiro',
};

type PaymentMethodKey = keyof typeof paymentMethodMap;


export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const { toast } = useToast();

  // Filters State
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<DateRange | undefined>(undefined);
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState<string>('all');

   const getCategoryName = (categoryId: string): string => {
      return categories.find(cat => cat.id === categoryId)?.name || 'Unknown Category';
    };

   // Filtered transactions based on state
   const filteredTransactions = transactions.filter(tx => {
     const categoryMatch = categoryFilter === 'all' || tx.category_id === categoryFilter;
     const paymentMatch = paymentMethodFilter === 'all' || tx.payment_method === paymentMethodFilter;
     // Date filtering logic
     const txDate = new Date(tx.date + 'T00:00:00'); // Ensure consistent time for comparison
     const dateMatch = !dateFilter || !dateFilter.from || (
         txDate >= dateFilter.from &&
         (!dateFilter.to || txDate <= dateFilter.to)
     );
     return categoryMatch && paymentMatch && dateMatch;
   }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending


  const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
      const newTransaction: Transaction = {
          ...newTransactionData,
          id: uuidv4(), // Generate unique ID
      };
      setTransactions(prev => [newTransaction, ...prev]); // Add to the beginning of the list
      toast({ title: "Transaction Added", description: `Transaction for R$ ${newTransactionData.amount.toFixed(2)} added.` });
  };

   const handleEditTransaction = (transaction: Transaction) => {
     setEditingTransaction(transaction);
     setIsModalOpen(true);
   };

   const handleDeleteTransaction = (id: string) => {
      if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
        setTransactions(prev => prev.filter(tx => tx.id !== id));
        toast({ title: "Transaction Deleted", description: "The transaction has been removed." });
      }
    };


  const handleSaveEdit = (updatedTransaction: Transaction) => {
     setTransactions(prev => prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx));
     toast({ title: "Transaction Updated", description: "The transaction details have been saved." });
     setEditingTransaction(null); // Clear editing state
   };

   // Handler for adding new categories directly from the modal dropdown
   const handleAddNewCategory = (newCategoryName: string, type: Category['type'] = 'expense') => {
       const newCategory: Category = { id: uuidv4(), name: newCategoryName.trim(), type };
       setCategories(prev => [...prev, newCategory]);
       toast({ title: "Category Added", description: `Category "${newCategory.name}" created.` });
       return newCategory.id; // Return the new ID so the modal can select it
   };


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
          <CardHeader className="p-0 pb-4">
             <CardTitle className="text-lg flex items-center gap-2">
                 <Filter className="h-5 w-5" /> Filters
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DatePickerWithRange onDateChange={setDateFilter} />

                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Methods</SelectItem>
                     {Object.entries(paymentMethodMap).map(([key, value]) => (
                       <SelectItem key={key} value={key}>{value}</SelectItem>
                     ))}
                  </SelectContent>
                </Select>
            </div>
          </CardContent>
      </Card>


      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date + 'T00:00:00'), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="font-medium">{transaction.description || '-'}</TableCell>
                        <TableCell>{getCategoryName(transaction.category_id)}</TableCell>
                        <TableCell>{paymentMethodMap[transaction.payment_method as PaymentMethodKey] || transaction.payment_method}</TableCell>
                        <TableCell className={`text-right font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                           R$ {transaction.amount.toFixed(2)}
                        </TableCell>
                         <TableCell className="text-center space-x-1">
                           <Button variant="ghost" size="icon" onClick={() => handleEditTransaction(transaction)}>
                             <Edit className="h-4 w-4" />
                             <span className="sr-only">Edit</span>
                           </Button>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteTransaction(transaction.id)}>
                             <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete</span>
                           </Button>
                         </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No transactions found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>


       <AddTransactionModal
         isOpen={isModalOpen}
         onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
         onSave={editingTransaction ? handleSaveEdit : handleAddTransaction}
         categories={categories}
         transactionData={editingTransaction}
         paymentMethods={paymentMethodMap}
         onAddNewCategory={handleAddNewCategory} // Pass the add category handler
       />
    </div>
  );
}
